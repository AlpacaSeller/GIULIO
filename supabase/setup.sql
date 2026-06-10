-- ============================================================
-- SETUP DATABASE — sito fotografo
-- Supabase > SQL Editor > incolla tutto > Run
-- ============================================================

create table if not exists shoots (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titolo text not null,
  sottotitolo text,
  anno text,
  luoghi text,
  racconto text,
  ordine int default 0,
  created_at timestamptz default now()
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  shoot_id uuid not null references shoots(id) on delete cascade,
  url text not null,
  path text,
  w int,
  h int,
  ordine int default 0,
  created_at timestamptz default now()
);

-- RLS: lettura pubblica, scrittura solo per utenti loggati
alter table shoots enable row level security;
alter table photos enable row level security;

create policy "lettura pubblica shoots" on shoots for select using (true);
create policy "lettura pubblica photos" on photos for select using (true);
create policy "scrittura autenticata shoots" on shoots for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "scrittura autenticata photos" on photos for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage: bucket pubblico per le foto
insert into storage.buckets (id, name, public)
values ('foto', 'foto', true)
on conflict (id) do nothing;

create policy "lettura pubblica foto" on storage.objects for select
  using (bucket_id = 'foto');
create policy "upload autenticato foto" on storage.objects for insert
  with check (bucket_id = 'foto' and auth.role() = 'authenticated');
create policy "delete autenticato foto" on storage.objects for delete
  using (bucket_id = 'foto' and auth.role() = 'authenticated');
