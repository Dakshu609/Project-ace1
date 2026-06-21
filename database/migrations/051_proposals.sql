-- ============================================================================
-- PROPOSALS: Freelancer bids on job posts
-- ============================================================================
-- Migrations: 051
-- Dependencies: 030 (freelancer_profiles), 050 (job_posts)
-- Table: public.proposals
-- RLS: Yes
-- ============================================================================

create table if not exists public.proposals (
  id                     uuid          primary key default gen_random_uuid(),
  job_post_id            uuid          not null references public.job_posts(id) on delete cascade,
  freelancer_profile_id  uuid          not null references public.freelancer_profiles(id) on delete cascade,
  job_title              text,
  client_name            text,
  bid_amount             numeric(12,2) not null default 0,
  cover_letter           text,
  status                 text          not null default 'pending'
                                          check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at             timestamptz   not null default now(),
  updated_at             timestamptz   not null default now(),
  unique (job_post_id, freelancer_profile_id)
);

comment on table public.proposals is 'Freelancer proposals/bids on client job posts';

-- --------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- --------------------------------------------------------------------------
drop trigger if exists proposals_updated_at on public.proposals;
create trigger proposals_updated_at
  before update on public.proposals
  for each row
  execute procedure public.handle_updated_at();

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.proposals enable row level security;

drop policy if exists "proposals_select_parties" on public.proposals;
create policy "proposals_select_parties"
  on public.proposals for select
  using (
    exists (select 1 from public.job_posts jp where jp.id = job_post_id and jp.client_id = auth.uid())
    or exists (select 1 from public.freelancer_profiles fp where fp.id = freelancer_profile_id and fp.profile_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists "proposals_insert_freelancer" on public.proposals;
create policy "proposals_insert_freelancer"
  on public.proposals for insert
  with check (
    exists (select 1 from public.freelancer_profiles fp where fp.id = freelancer_profile_id and fp.profile_id = auth.uid())
  );
