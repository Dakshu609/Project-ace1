-- ============================================================================
-- SERVICES: Fixed-price service listings by freelancers
-- ============================================================================
-- Migrations: 040
-- Dependencies: 020 (categories), 030 (freelancer_profiles)
-- Table: public.services
-- RLS: Yes
-- ============================================================================

create table if not exists public.services (
  id                     uuid          primary key default gen_random_uuid(),
  freelancer_profile_id  uuid          not null references public.freelancer_profiles(id) on delete cascade,
  freelancer_name        text,
  freelancer_avatar_url  text,
  title                  text          not null,
  description            text,
  category_name          text          references public.categories(name),
  price                  numeric(12,2) not null default 0,
  delivery_days          integer       not null default 7,
  rating                 numeric(3,2)  not null default 0,
  review_count           integer       not null default 0,
  image_url              text,
  tags                   text[]        not null default '{}',
  status                 text          not null default 'draft'
                                          check (status in ('draft', 'active', 'paused', 'archived')),
  created_at             timestamptz   not null default now(),
  updated_at             timestamptz   not null default now()
);

comment on table public.services is 'Fixed-price services offered by freelancers';

-- --------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- --------------------------------------------------------------------------
drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at
  before update on public.services
  for each row
  execute procedure public.handle_updated_at();

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.services enable row level security;

drop policy if exists "services_select_active" on public.services;
create policy "services_select_active"
  on public.services for select
  using (status = 'active' or public.is_admin());

drop policy if exists "services_manage_own" on public.services;
create policy "services_manage_own"
  on public.services for all
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
