-- ============================================================================
-- FREELANCER PROFILES: Extended freelancer information
-- ============================================================================
-- Migrations: 030
-- Dependencies: 010 (profiles)
-- Tables: public.freelancer_profiles, public.portfolio_items
-- RLS: Yes
-- ============================================================================

create table if not exists public.freelancer_profiles (
  id                  uuid        primary key default gen_random_uuid(),
  profile_id          uuid        not null unique references public.profiles(id) on delete cascade,
  display_name        text        not null,
  title               text,
  avatar_url          text,
  bio                 text,
  hourly_rate         numeric(12,2) not null default 0,
  rating              numeric(3,2)  not null default 0 check (rating >= 0 and rating <= 5),
  review_count        integer       not null default 0 check (review_count >= 0),
  skills              text[]        not null default '{}',
  categories          text[]        not null default '{}',
  completed_jobs      integer       not null default 0 check (completed_jobs >= 0),
  availability        text          not null default 'away'
                                      check (availability in ('available', 'busy', 'away')),
  location            text          not null default 'Remote',
  experience_level    text          not null default 'mid'
                                      check (experience_level in ('junior', 'mid', 'senior', 'expert')),
  languages           text[]        not null default '{}',
  response_time       text          not null default 'within 24 hours',
  verification_status text          not null default 'pending'
                                      check (verification_status in ('pending', 'verified', 'rejected')),
  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now()
);

comment on table  public.freelancer_profiles is 'Extended profile for freelancer role users';
comment on column public.freelancer_profiles.verification_status is 'Admin verification workflow: pending → verified/rejected';

-- --------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- --------------------------------------------------------------------------
drop trigger if exists freelancer_profiles_updated_at on public.freelancer_profiles;
create trigger freelancer_profiles_updated_at
  before update on public.freelancer_profiles
  for each row
  execute procedure public.handle_updated_at();

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.freelancer_profiles enable row level security;

drop policy if exists "freelancer_profiles_select_public" on public.freelancer_profiles;
create policy "freelancer_profiles_select_public"
  on public.freelancer_profiles for select
  using (verification_status = 'verified' or profile_id = auth.uid() or public.is_admin());

drop policy if exists "freelancer_profiles_manage_own" on public.freelancer_profiles;
create policy "freelancer_profiles_manage_own"
  on public.freelancer_profiles for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists "freelancer_profiles_admin_all" on public.freelancer_profiles;
create policy "freelancer_profiles_admin_all"
  on public.freelancer_profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- PORTFOLIO ITEMS
-- ============================================================================

create table if not exists public.portfolio_items (
  id                     uuid        primary key default gen_random_uuid(),
  freelancer_profile_id  uuid        not null references public.freelancer_profiles(id) on delete cascade,
  title                  text        not null,
  description            text,
  image_url              text,
  tags                   text[]      not null default '{}',
  url                    text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table public.portfolio_items is 'Freelancer portfolio entries showcasing work samples';

-- --------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- --------------------------------------------------------------------------
drop trigger if exists portfolio_items_updated_at on public.portfolio_items;
create trigger portfolio_items_updated_at
  before update on public.portfolio_items
  for each row
  execute procedure public.handle_updated_at();

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.portfolio_items enable row level security;

drop policy if exists "portfolio_items_select_follows_freelancer" on public.portfolio_items;
create policy "portfolio_items_select_follows_freelancer"
  on public.portfolio_items for select
  using (
    exists (
      select 1 from public.freelancer_profiles fp
      where fp.id = freelancer_profile_id
        and (fp.verification_status = 'verified' or fp.profile_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "portfolio_items_manage_own" on public.portfolio_items;
create policy "portfolio_items_manage_own"
  on public.portfolio_items for all
  using (
    exists (
      select 1 from public.freelancer_profiles fp
      where fp.id = freelancer_profile_id and fp.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.freelancer_profiles fp
      where fp.id = freelancer_profile_id and fp.profile_id = auth.uid()
    )
  );
