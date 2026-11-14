-- PULSE optional sync tables (demo works offline without these)

create table if not exists public.crew (
  id text primary key,
  name text not null,
  role text not null,
  age int,
  created_at timestamptz not null default now()
);

create table if not exists public.receipts (
  id text primary key,
  kind text not null,
  channel text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.escalations (
  id text primary key,
  crew_id text references public.crew (id),
  severity text not null,
  message text not null,
  status text not null,
  sync_receipt_id text,
  created_at timestamptz not null default now()
);

alter table public.crew enable row level security;
alter table public.receipts enable row level security;
alter table public.escalations enable row level security;

create policy "anon read crew" on public.crew for select using (true);
create policy "anon insert receipts" on public.receipts for insert with check (true);
create policy "anon select receipts" on public.receipts for select using (true);
create policy "anon insert escalations" on public.escalations for insert with check (true);
create policy "anon select escalations" on public.escalations for select using (true);
create policy "anon update escalations" on public.escalations for update using (true);

insert into public.crew (id, name, role, age) values
  ('nova', 'Nova Reyes', 'Commander', 42),
  ('cass', 'Cass Okonkwo', 'Flight Engineer', 35),
  ('ravi', 'Ravi Sharma', 'Science Officer', 38),
  ('amara', 'Dr. Amara Diallo', 'Crew Medical Officer', 44)
on conflict (id) do nothing;
