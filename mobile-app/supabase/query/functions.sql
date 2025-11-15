-- 0) helper: generate_match_code
create or replace function public.generate_match_code() returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  out text := '';
  i int;
begin
  for i in 1..6 loop
    out := out || substr(chars, (1 + floor(random() * length(chars)))::int, 1);
  end loop;
  return out;
end;
$$ language plpgsql volatile;


-- 1) create_match
create or replace function public.rpc_create_match(
  p_name text,
  p_is_private boolean,
  p_host_player_id uuid,
  p_display_name text default null
) returns public.matches as $$
declare
  new_match public.matches%rowtype;
begin
  insert into public.matches (code, name, is_private, host_player_id, status)
  values (generate_match_code(), p_name, p_is_private, p_host_player_id, 'waiting')
  returning * into new_match;

  -- insert host as player slot 1 (use provided id)
  insert into public.match_players (id, match_id, slot, display_name, ready)
  values (p_host_player_id, new_match.id, 1, p_display_name, false);

  return new_match;
end;
$$ language plpgsql security definer;


-- 2) join_match by code
--drop function if exists rpc_join_match_by_code(text, uuid, text);
create or replace function rpc_join_match_by_code(
  p_code text,
  p_player_id uuid,
  p_display_name text
)
returns public.matches
security definer
language plpgsql
as $$
declare
  m public.matches%rowtype;
  count_players int;
  next_slot int;
begin
  select * into m from public.matches where code = p_code for update;
  if not found then
    raise exception using message = 'Match not found';
  end if;

  select count(*) into count_players from public.match_players where match_id = m.id;
  if count_players >= 2 then
    raise exception using message = 'Match full';
  end if;

  next_slot := case when count_players = 0 then 1 else 2 end;

  insert into public.match_players (id, match_id, slot, display_name, ready)
  values (p_player_id, m.id, next_slot, p_display_name, false);

  select count(*) into count_players from public.match_players where match_id = m.id;
  if count_players = 2 then
    update public.matches set status = 'placing' where id = m.id returning * into m;
  end if;

  return m;
end;
$$;



-- 3) set ships and ready
create or replace function public.rpc_set_ships_and_ready(
  p_match_id uuid,
  p_player_id uuid,
  p_ships jsonb,
  p_ready boolean
) returns public.match_players as $$
declare
  mp public.match_players%rowtype;
  both_ready boolean;
  start_player uuid;
begin
  update public.match_players
  set ships = p_ships, ready = p_ready
  where match_id = p_match_id and id = p_player_id
  returning * into mp;

  if not found then
    raise exception using message = 'Player not found in match';
  end if;

  -- check if both ready -> start match
  select bool_and(ready) into both_ready from public.match_players where match_id = p_match_id;

  if both_ready then
    -- pick random player to start
    select id into start_player from public.match_players where match_id = p_match_id order by random() limit 1;
    update public.matches set status = 'in_progress', turn_player_id = start_player where id = p_match_id;
  end if;

  return mp;
end;
$$ language plpgsql security definer;


-- 4) rpc_make_move: completo
-- Resumen de la lógica:
--  - valida que el match está in_progress y que es el turno del jugador
--  - valida que la celda no haya sido disparada previamente
--  - comprueba si el disparo golpea alguna coord del oponente
--  - si golpea, marca la coordenada como "hit": true en match_players.ships del oponente
--  - detecta si ese barco ha quedado hundido (todos coords con hit=true)
--  - si hunde el último barco del oponente, marca match finished y winner_player_id
--  - inserta fila en moves con result: miss|hit|sunk y sunk_ship_id opcional
--  - TURNO: si acierta (hit|sunk), el mismo jugador repite turno. Si falla (miss), pasa al oponente
create or replace function public.rpc_make_move(
  p_match_id uuid,
  p_by_player_id uuid,
  p_x int,
  p_y int
)
returns table (
  out_move_id uuid,
  out_result text,
  out_sunk_ship_id text,
  out_move_number int,
  out_match_finished boolean,
  out_winner uuid
) as $$
declare
  v_match public.matches%rowtype;
  v_me public.match_players%rowtype;
  v_opponent public.match_players%rowtype;
  v_mv_id uuid := gen_random_uuid();
  v_next_move_number int;
  v_opp_ships jsonb;
  v_updated_ships jsonb := '[]'::jsonb;
  v_ship jsonb;
  v_ship_coords jsonb;
  v_new_coords jsonb;
  v_coord jsonb;
  v_coord_x int;
  v_coord_y int;
  v_coord_hit boolean;
  v_i int;
  v_j int;
  v_ship_len int;
  v_ship_all_hit boolean;
  v_any_hit boolean := false;
  v_sunk_ship text := null;
  v_all_ships_sunk boolean := false;
begin
  -- lock match row
  select * into v_match from public.matches where id = p_match_id for update;
  if not found then
    raise exception using message = 'Match not found';
  end if;

  if v_match.status != 'in_progress' then
    raise exception using message = 'Match not in progress';
  end if;

  if v_match.turn_player_id is null or v_match.turn_player_id <> p_by_player_id then
    raise exception using message = 'Not your turn';
  end if;

  -- get players
  select * into v_me from public.match_players where match_id = p_match_id and id = p_by_player_id for update;
  select * into v_opponent from public.match_players where match_id = p_match_id and id <> p_by_player_id for update;

  if v_opponent is null then
    raise exception using message = 'Opponent missing';
  end if;

  -- check if this cell has already been shot
  if exists (select 1 from public.moves where match_id = p_match_id and x = p_x and y = p_y) then
    raise exception using message = 'Cell already shot';
  end if;

  -- next move number
  select coalesce(max(move_number),0) + 1 into v_next_move_number from public.moves where match_id = p_match_id;

  v_opp_ships := coalesce(v_opponent.ships, '[]'::jsonb);

  -- iterate ships
  for v_i in 0..jsonb_array_length(v_opp_ships)-1 loop
    v_ship := v_opp_ships -> v_i;
    v_ship_coords := v_ship -> 'coords';
    v_new_coords := '[]'::jsonb;
    v_ship_all_hit := true;
    v_ship_len := jsonb_array_length(v_ship_coords);

    -- iterate coords of this ship
    for v_j in 0..v_ship_len-1 loop
      v_coord := v_ship_coords -> v_j;
      v_coord_x := (v_coord ->> 'x')::int;
      v_coord_y := (v_coord ->> 'y')::int;

      if v_coord_x = p_x and v_coord_y = p_y then
        v_coord_hit := (v_coord ? 'hit') and (v_coord ->> 'hit')::boolean;
        if not v_coord_hit then
          v_coord := jsonb_strip_nulls(jsonb_set(v_coord, '{hit}', 'true'::jsonb, true));
          v_any_hit := true;
        end if;
      end if;

      v_new_coords := v_new_coords || to_jsonb(v_coord);

      if not ((v_coord ? 'hit') and (v_coord ->> 'hit')::boolean) then
        v_ship_all_hit := false;
      end if;
    end loop;

    if v_ship_all_hit then
      v_ship := jsonb_strip_nulls(v_ship || jsonb_build_object('coords', v_new_coords, 'sunk', true));
    else
      v_ship := jsonb_strip_nulls(v_ship || jsonb_build_object('coords', v_new_coords));
    end if;

    v_updated_ships := v_updated_ships || to_jsonb(v_ship);
  end loop;

  -- determine result
  if not v_any_hit then
    out_result := 'miss';
    out_sunk_ship_id := null;
  else
    -- detect if any ship was sunk by this shot
    for v_i in 0..jsonb_array_length(v_updated_ships)-1 loop
      v_ship := v_updated_ships -> v_i;
      if (v_ship ? 'sunk') and (v_ship ->> 'sunk')::boolean then
        v_ship_coords := v_ship -> 'coords';
        for v_j in 0..jsonb_array_length(v_ship_coords)-1 loop
          v_coord := v_ship_coords -> v_j;
          if ((v_coord ->> 'x')::int) = p_x and ((v_coord ->> 'y')::int) = p_y and (v_coord ? 'hit') and (v_coord ->> 'hit')::boolean then
            v_sunk_ship := v_ship ->> 'id';
          end if;
        end loop;
      end if;
    end loop;

    if v_sunk_ship is not null then
      out_result := 'sunk';
      out_sunk_ship_id := v_sunk_ship;
    else
      out_result := 'hit';
      out_sunk_ship_id := null;
    end if;
  end if;

  -- update opponent ships
  update public.match_players
  set ships = v_updated_ships
  where id = v_opponent.id and match_id = p_match_id;

  -- insert move
  insert into public.moves (id, match_id, by_player_id, x, y, result, sunk_ship_id, move_number)
  values (v_mv_id, p_match_id, p_by_player_id, p_x, p_y, out_result, out_sunk_ship_id, v_next_move_number);

  -- check if all opponent ships are sunk
  select bool_and(coalesce((v_s->>'sunk')::boolean, false))
  into v_all_ships_sunk
  from jsonb_array_elements(v_updated_ships) as ships(v_s);

  if jsonb_array_length(v_updated_ships) = 0 then
    v_all_ships_sunk := true;
  end if;

  if v_all_ships_sunk then
    update public.matches
    set status = 'finished',
        winner_player_id = p_by_player_id,
        turn_player_id = null
    where id = p_match_id;
    out_match_finished := true;
    out_winner := p_by_player_id;
  else
    -- if miss, change turn to opponent; if hit/sunk, keep same player's turn
    if out_result = 'miss' then
      update public.matches
      set turn_player_id = v_opponent.id
      where id = p_match_id;
    end if;
    out_match_finished := false;
    out_winner := null;
  end if;

  out_move_id := v_mv_id;
  out_move_number := v_next_move_number;

  return next;
end;
$$ language plpgsql security definer;


-- 5) rpc_cancel_match
create or replace function public.rpc_cancel_match(
  p_match_id uuid
)
returns public.matches
security definer
language plpgsql
as $$
declare
  m public.matches%rowtype;
begin
  update public.matches
  set status = 'cancelled'
  where id = p_match_id
  returning * into m;

  if not found then
    raise exception using message = 'Match not found';
  end if;

  -- Delete all moves associated with this match
  delete from public.moves where match_id = p_match_id;

  -- Delete all match players associated with this match
  delete from public.match_players where match_id = p_match_id;

  return m;
end;
$$;


-- 6) rpc_cleanup_finished_match: elimina datos de una partida terminada
create or replace function public.rpc_cleanup_finished_match(
  p_match_id uuid
)
returns public.matches
security definer
language plpgsql
as $$
declare
  m public.matches%rowtype;
begin
  -- Validate match exists and is finished
  select * into m from public.matches where id = p_match_id;
  if not found then
    raise exception using message = 'Match not found';
  end if;

  if m.status != 'finished' then
    raise exception using message = 'Match is not finished';
  end if;

  -- Delete all moves associated with this match
  delete from public.moves where match_id = p_match_id;

  -- Delete all match players associated with this match
  delete from public.match_players where match_id = p_match_id;

  return m;
end;
$$;
