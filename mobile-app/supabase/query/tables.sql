-- Habilitar extensión (si no está)
create extension if not exists pgcrypto;

-- matches
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_private boolean not null default false,
  status text not null default 'waiting', -- waiting | placing | oppo_placing | in_progress | finished | cancelled
  host_player_id uuid not null,
  turn_player_id uuid,
  winner_player_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists idx_matches_status on public.matches (status);
create index if not exists idx_matches_created_at on public.matches (created_at);

-- match_players
create table public.match_players (
  id uuid not null, -- corresponde al player_id emitido por token y usado por cliente
  match_id uuid not null references public.matches(id) on delete cascade,
  slot smallint not null, -- 1 o 2
  display_name text,
  ships jsonb,            -- array de barcos con coords y hits
  ready boolean not null default false,
  joined_at timestamptz not null default now(),
  primary key (match_id, id),
  constraint match_slot_unique unique (match_id, slot)
);
create index if not exists idx_match_players_match_id on public.match_players (match_id);

-- moves
create table public.moves (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  by_player_id uuid not null, -- referencia al match_players.id (player id)
  x smallint not null,
  y smallint not null,
  result text not null,  -- 'miss' | 'hit' | 'sunk'
  sunk_ship_id text,     -- id del barco hundido (opcional)
  move_number integer not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_moves_match_move_number on public.moves (match_id, move_number);
create unique index if not exists uidx_moves_match_move_number on public.moves (match_id, move_number);
