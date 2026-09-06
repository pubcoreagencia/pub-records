-- PUB RECORDS Beats - schema preparado para Supabase/Postgres
-- MVP independente: autenticacao, catalogo, pedidos, pagamentos e entrega digital segura.

create extension if not exists pgcrypto;

create type beat_status as enum ('disponivel', 'vendido', 'exclusivo', 'destaque', 'indisponivel');
create type payment_status as enum ('pendente', 'pago', 'cancelado', 'reembolsado');
create type delivery_status as enum ('aguardando_pagamento', 'entregue', 'bloqueado', 'expirado');
create type file_type as enum ('cover', 'preview', 'mp3_final', 'wav_final', 'stems', 'license_pdf');
create type app_role as enum ('cliente', 'admin');

create table public.producers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.genres (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  artist_name text,
  email text not null unique,
  document text,
  role app_role not null default 'cliente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.beats (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  producer_id uuid references public.producers(id) on delete set null,
  genre_id uuid references public.genres(id) on delete set null,
  bpm integer check (bpm between 40 and 240),
  musical_key text,
  mood text,
  cover_url text,
  preview_audio_url text,
  status beat_status not null default 'disponivel',
  is_featured boolean not null default false,
  publish_date date default current_date,
  sales_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.beat_tags (
  beat_id uuid references public.beats(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (beat_id, tag_id)
);

create table public.license_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  base_price numeric(12,2) not null default 0,
  allows_monetization boolean not null default false,
  allows_distribution boolean not null default false,
  allows_performances boolean not null default false,
  includes_wav boolean not null default false,
  includes_stems boolean not null default false,
  is_exclusive boolean not null default false,
  usage_limit text,
  keeps_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.beat_licenses (
  id uuid primary key default gen_random_uuid(),
  beat_id uuid not null references public.beats(id) on delete cascade,
  license_type_id uuid not null references public.license_types(id) on delete cascade,
  price numeric(12,2) not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (beat_id, license_type_id)
);

create table public.beat_files (
  id uuid primary key default gen_random_uuid(),
  beat_id uuid references public.beats(id) on delete cascade,
  type file_type not null,
  bucket text not null default 'beat-files',
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  total_amount numeric(12,2) not null default 0,
  payment_status payment_status not null default 'pendente',
  delivery_status delivery_status not null default 'aguardando_pagamento',
  payment_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  beat_id uuid not null references public.beats(id) on delete restrict,
  license_type_id uuid not null references public.license_types(id) on delete restrict,
  price numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  amount numeric(12,2) not null,
  status text not null,
  provider_reference text,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.downloads (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  file_id uuid not null references public.beat_files(id) on delete restrict,
  download_count integer not null default 0,
  last_downloaded_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (order_item_id, file_id)
);

create index beats_slug_idx on public.beats(slug);
create index beats_status_featured_idx on public.beats(status, is_featured);
create index orders_customer_status_idx on public.orders(customer_id, payment_status);
create index downloads_customer_idx on public.downloads(customer_id);

alter table public.producers enable row level security;
alter table public.genres enable row level security;
alter table public.tags enable row level security;
alter table public.customers enable row level security;
alter table public.beats enable row level security;
alter table public.beat_tags enable row level security;
alter table public.license_types enable row level security;
alter table public.beat_licenses enable row level security;
alter table public.beat_files enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.downloads enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.customers
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create policy "catalogo publico de beats" on public.beats for select using (status in ('disponivel', 'destaque', 'exclusivo'));
create policy "licencas publicas" on public.license_types for select using (true);
create policy "precos publicos" on public.beat_licenses for select using (is_available = true);
create policy "arquivos preview publicos" on public.beat_files for select using (is_public = true or public.is_admin());
create policy "cliente ve proprio cadastro" on public.customers for select using (user_id = auth.uid() or public.is_admin());
create policy "cliente ve proprios pedidos" on public.orders for select using (customer_id in (select id from public.customers where user_id = auth.uid()) or public.is_admin());
create policy "cliente ve itens dos proprios pedidos" on public.order_items for select using (order_id in (select id from public.orders where customer_id in (select id from public.customers where user_id = auth.uid())) or public.is_admin());
create policy "cliente ve downloads liberados" on public.downloads for select using (customer_id in (select id from public.customers where user_id = auth.uid()) or public.is_admin());
create policy "admin gerencia catalogo" on public.beats for all using (public.is_admin()) with check (public.is_admin());
create policy "admin gerencia arquivos" on public.beat_files for all using (public.is_admin()) with check (public.is_admin());
create policy "admin gerencia licencas" on public.license_types for all using (public.is_admin()) with check (public.is_admin());
create policy "admin gerencia precos" on public.beat_licenses for all using (public.is_admin()) with check (public.is_admin());
create policy "admin gerencia pedidos" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "admin gerencia pagamentos" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "admin gerencia downloads" on public.downloads for all using (public.is_admin()) with check (public.is_admin());

-- Storage recomendado:
-- bucket public-beat-previews: previews e capas publicas.
-- bucket beat-files: arquivos finais privados, acesso via signed URLs apos pedido pago.
