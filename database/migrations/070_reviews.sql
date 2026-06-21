-- ============================================================================
-- REVIEWS: Freelancer reviews by clients after contract completion
-- ============================================================================
-- Migrations: 070
-- Dependencies: 010 (profiles), 030 (freelancer_profiles), 060 (contracts)
-- Tables: public.reviews, public.saved_freelancers
-- RLS: Yes
-- ============================================================================

create table if not exists public.reviews (
  id                     uuid        primary key default gen_random_uuid(),
  contract_id            uuid        references public.contracts(id) on delete set null,
  freelancer_profile_id  uuid        not null references public.freelancer_profiles(id) on delete cascade,
  client_id              uuid        references public.profiles(id) on delete set null,
  client_name            text,
  client_avatar_url      text,
  project_title          text,
  rating                 integer     not null check (rating >= 1 and rating <= 5),
  comment                text,
  is_public              boolean     not null default true,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table  public.reviews is 'Client reviews and ratings for freelancers';
comment on column public.reviews.is_public is 'Visibility flag; private reviews visible only to parties and admins';

-- --------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- --------------------------------------------------------------------------
drop trigger if exists reviews_updated_at on public.reviews;
create trigger reviews_updated_at
  before update on public.reviews
  for each row
  execute procedure public.handle_updated_at();

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.reviews enable row level security;

drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_public"
  on public.reviews for select
  using (is_public or client_id = auth.uid() or public.is_admin());

-- ============================================================================
-- SAVED FREELANCERS: Client bookmarks (many-to-many)
-- ============================================================================

create table if not exists public.saved_freelancers (
  client_id              uuid        not null references public.profiles(id) on delete cascade,
  freelancer_profile_id  uuid        not null references public.freelancer_profiles(id) on delete cascade,
  created_at             timestamptz not null default now(),
  primary key (client_id, freelancer_profile_id)
);

comment on table public.saved_freelancers is 'Client bookmarks/favorites of freelancer profiles';

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.saved_freelancers enable row level security;

drop policy if exists "saved_freelancers_manage_own" on public.saved_freelancers;
create policy "saved_freelancers_manage_own"
  on public.saved_freelancers for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());
