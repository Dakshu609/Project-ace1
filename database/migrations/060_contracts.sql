-- ============================================================================
-- CONTRACTS: Work agreements between clients and freelancers
-- ============================================================================
-- Migrations: 060
-- Dependencies: 010 (profiles), 030 (freelancer_profiles), 050 (job_posts)
-- Table: public.contracts
-- RLS: Yes
-- ============================================================================

create table if not exists public.contracts (
  id                     uuid          primary key default gen_random_uuid(),
  job_post_id            uuid          references public.job_posts(id) on delete set null,
  client_id              uuid          not null references public.profiles(id) on delete cascade,
  freelancer_profile_id  uuid          not null references public.freelancer_profiles(id) on delete cascade,
  project_title          text,
  freelancer_name        text,
  freelancer_avatar_url  text,
  amount                 numeric(12,2) not null default 0,
  status                 text          not null default 'pending'
                                          check (status in ('pending', 'active', 'completed', 'cancelled', 'disputed')),
  progress               integer       not null default 0 check (progress >= 0 and progress <= 100),
  due_date               date,
  created_at             timestamptz   not null default now(),
  updated_at             timestamptz   not null default now()
);

comment on table public.contracts is 'Work contracts linking clients and freelancers after proposal acceptance';

-- --------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- --------------------------------------------------------------------------
drop trigger if exists contracts_updated_at on public.contracts;
create trigger contracts_updated_at
  before update on public.contracts
  for each row
  execute procedure public.handle_updated_at();

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.contracts enable row level security;

drop policy if exists "contracts_select_parties" on public.contracts;
create policy "contracts_select_parties"
  on public.contracts for select
  using (
    client_id = auth.uid()
    or exists (select 1 from public.freelancer_profiles fp where fp.id = freelancer_profile_id and fp.profile_id = auth.uid())
    or public.is_admin()
  );
