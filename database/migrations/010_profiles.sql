-- ============================================================================
-- PROFILES: User profiles extending auth.users
-- ============================================================================
-- Migrations: 010
-- Dependencies: 000 (functions)
-- Table: public.profiles
-- RLS: Yes — public read, self update
-- ============================================================================

create table if not exists public.profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  email      text        not null,
  full_name  text,
  role       text        check (role in ('client', 'freelancer', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table  public.profiles is 'Extends auth.users with marketplace profile data';
comment on column public.profiles.role is 'User role: client, freelancer, or admin';

-- --------------------------------------------------------------------------
-- Admin check function (needs profiles table to exist)
-- --------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- --------------------------------------------------------------------------
-- Trigger: auto-create profile on auth.users insert
-- --------------------------------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- --------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- --------------------------------------------------------------------------
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Profiles are publicly readable marketplace identities" on public.profiles;
create policy "Profiles are publicly readable marketplace identities"
  on public.profiles for select
  using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can update any profile (managed via is_admin() in RLS on other tables)
