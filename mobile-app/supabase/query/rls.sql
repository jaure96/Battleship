-- activar RLS
alter table public.match_players enable row level security;
alter table public.matches enable row level security;
alter table public.moves enable row level security;

-- ---- MATCHES ----
-- policy: allow anyone to select basic match listing (but hide sensitive columns if you wish)
create policy "public_select_matches" on public.matches
  for select
  using (true);

-- policy: allow insert via rpc only (block direct inserts from anon)
create policy "no_insert_matches_anon" on public.matches
  for insert
  using (false);

-- policy: allow updates to matches only by RPCs or service role
create policy "no_update_matches_anon" on public.matches
  for update
  using (false);

-- ---- MATCH_PLAYERS ----
-- allow the owner (player) to select and update their own player row
create policy "player_select_own" on public.match_players
  for select
  using (auth.jwt() ->> 'player_id' = id);

create policy "player_update_own" on public.match_players
  for update
  using (auth.jwt() ->> 'player_id' = id);

-- allow anyone to insert into match_players only through RPC (deny anon client inserts)
create policy "no_insert_match_players_anon" on public.match_players
  for insert
  using (false);

-- ---- MOVES ----
-- For moves, allow select only to players in the match (or public if you want)
create policy "moves_select_in_match" on public.moves
  for select
  using (exists (
    select 1 from public.match_players mp
    where mp.match_id = public.moves.match_id and mp.id = (auth.jwt() ->> 'player_id')::uuid
  ));

-- prohibit direct insert/update/delete from anon clients, only allow via RPC
create policy "no_insert_moves_anon" on public.moves
  for insert
  using (false);

create policy "no_update_moves_anon" on public.moves
  for update
  using (false);

create policy "no_delete_moves_anon" on public.moves
  for delete
  using (false);
