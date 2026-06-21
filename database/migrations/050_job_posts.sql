-- ============================================================================
-- JOB POSTS: Client project postings / job listings
-- ============================================================================
-- Migrations: 050
-- Dependencies: 010 (profiles), 020 (categories)
-- Table: public.job_posts
-- RLS: Yes
-- ============================================================================

create table if not exists public.job_posts (
  id             uuid          primary key default gen_random_uuid(),
  client_id      uuid          not null references public.profiles(id) on delete cascade,
  client_name    text,
  title          text          not null,
  description    text,
  category_name  text          references public.categories(name),
  budget_amount  numeric(12,2) not null default 0,
  budget_type    text          not null default 'fixed'
                                  check (budget_type in ('fixed', 'hourly')),
  skills         text[]        not null default '{}',
  status         text          not null default 'open'
                                  check (status in ('draft', 'open', 'active', 'completed', 'cancelled')),
  proposal_count integer       not null default 0,
  deadline       date,
  created_at     timestamptz   not null default now(),
  updated_at     timestamptz   not null default now()
);

comment on table  public.job_posts is 'Job/project postings created by clients';
comment on column public.job_posts.proposal_count is 'Denormalized count of proposals received (updated by triggers)';

-- --------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- --------------------------------------------------------------------------
drop trigger if exists job_posts_updated_at on public.job_posts;
create trigger job_posts_updated_at
  before update on public.job_posts
  for each row
  execute procedure public.handle_updated_at();

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.job_posts enable row level security;

drop policy if exists "job_posts_select_visible" on public.job_posts;
create policy "job_posts_select_visible"
  on public.job_posts for select
  using (status <> 'draft' or client_id = auth.uid() or public.is_admin());

drop policy if exists "job_posts_manage_own" on public.job_posts;
create policy "job_posts_manage_own"
  on public.job_posts for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

drop policy if exists "job_posts_admin_all" on public.job_posts;
create policy "job_posts_admin_all"
  on public.job_posts for all
  using (public.is_admin())
  with check (public.is_admin());
