-- Project Ace — Supabase marketplace schema
-- Run this in the Supabase SQL Editor for a clean project.

create extension if not exists pgcrypto;

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role text check (role in ('client', 'freelancer', 'admin')),
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    case
      when new.raw_user_meta_data ->> 'role' in ('client', 'freelancer', 'admin')
      then new.raw_user_meta_data ->> 'role'
      else null
    end,
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

comment on table  public.profiles is 'Extends auth.users with marketplace profile data';
comment on column public.profiles.role is 'User role: client, freelancer, or admin';

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create table if not exists public.categories (
  name text primary key,
  icon text default 'Code2' not null,
  created_at timestamptz default now() not null
);

alter table public.categories enable row level security;
drop policy if exists "Categories are public" on public.categories;
create policy "Categories are public" on public.categories for select using (true);

comment on table public.categories is 'Skill/service categories for job posts and freelancer listings';

create table if not exists public.freelancer_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  display_name text not null,
  title text,
  avatar_url text,
  bio text,
  hourly_rate numeric(12, 2) default 0 not null,
  rating numeric(3, 2) default 0 not null check (rating >= 0 and rating <= 5),
  review_count integer default 0 not null check (review_count >= 0),
  skills text[] default '{}' not null,
  categories text[] default '{}' not null,
  completed_jobs integer default 0 not null check (completed_jobs >= 0),
  availability text default 'away' not null check (availability in ('available', 'busy', 'away')),
  location text default 'Remote' not null,
  experience_level text default 'mid' not null check (experience_level in ('junior', 'mid', 'senior', 'expert')),
  languages text[] default '{}' not null,
  response_time text default 'within 24 hours' not null,
  verification_status text default 'pending' not null check (verification_status in ('pending', 'verified', 'rejected')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.freelancer_profiles enable row level security;
drop policy if exists "Verified freelancers are public" on public.freelancer_profiles;
create policy "Verified freelancers are public" on public.freelancer_profiles
  for select using (verification_status = 'verified' or profile_id = auth.uid() or public.is_admin());
drop policy if exists "Freelancers can manage own profile" on public.freelancer_profiles;
create policy "Freelancers can manage own profile" on public.freelancer_profiles
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
drop policy if exists "Admins can manage freelancer profiles" on public.freelancer_profiles;
create policy "Admins can manage freelancer profiles" on public.freelancer_profiles
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists freelancer_profiles_updated_at on public.freelancer_profiles;
create trigger freelancer_profiles_updated_at
  before update on public.freelancer_profiles
  for each row execute procedure public.handle_updated_at();

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  freelancer_profile_id uuid references public.freelancer_profiles(id) on delete cascade not null,
  title text not null,
  description text,
  image_url text,
  tags text[] default '{}' not null,
  url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.portfolio_items enable row level security;
drop policy if exists "Portfolio follows freelancer visibility" on public.portfolio_items;
create policy "Portfolio follows freelancer visibility" on public.portfolio_items
  for select using (
    exists (
      select 1 from public.freelancer_profiles fp
      where fp.id = freelancer_profile_id
      and (fp.verification_status = 'verified' or fp.profile_id = auth.uid() or public.is_admin())
    )
  );
drop policy if exists "Freelancers can manage portfolio" on public.portfolio_items;
create policy "Freelancers can manage portfolio" on public.portfolio_items
  for all using (
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

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  freelancer_profile_id uuid references public.freelancer_profiles(id) on delete cascade not null,
  freelancer_name text,
  freelancer_avatar_url text,
  title text not null,
  description text,
  category_name text references public.categories(name),
  price numeric(12, 2) default 0 not null,
  delivery_days integer default 7 not null,
  rating numeric(3, 2) default 0 not null,
  review_count integer default 0 not null,
  image_url text,
  tags text[] default '{}' not null,
  status text default 'draft' not null check (status in ('draft', 'active', 'paused', 'archived')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.services enable row level security;
drop policy if exists "Active services are public" on public.services;
create policy "Active services are public" on public.services for select using (status = 'active' or public.is_admin());
drop policy if exists "Freelancers manage own services" on public.services;
create policy "Freelancers manage own services" on public.services
  for all using (
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

create table if not exists public.job_posts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade not null,
  client_name text,
  title text not null,
  description text,
  category_name text references public.categories(name),
  budget_amount numeric(12, 2) default 0 not null,
  budget_type text default 'fixed' not null check (budget_type in ('fixed', 'hourly')),
  skills text[] default '{}' not null,
  status text default 'open' not null check (status in ('draft', 'open', 'active', 'completed', 'cancelled')),
  proposal_count integer default 0 not null,
  deadline date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.job_posts enable row level security;
drop policy if exists "Visible jobs are public" on public.job_posts;
create policy "Visible jobs are public" on public.job_posts for select using (status <> 'draft' or client_id = auth.uid() or public.is_admin());
drop policy if exists "Clients manage own jobs" on public.job_posts;
create policy "Clients manage own jobs" on public.job_posts
  for all using (client_id = auth.uid()) with check (client_id = auth.uid());
drop policy if exists "Admins manage jobs" on public.job_posts;
create policy "Admins manage jobs" on public.job_posts
  for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  job_post_id uuid references public.job_posts(id) on delete cascade not null,
  freelancer_profile_id uuid references public.freelancer_profiles(id) on delete cascade not null,
  job_title text,
  client_name text,
  bid_amount numeric(12, 2) default 0 not null,
  cover_letter text,
  status text default 'pending' not null check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (job_post_id, freelancer_profile_id)
);

alter table public.proposals enable row level security;
drop policy if exists "Proposal parties can read" on public.proposals;
create policy "Proposal parties can read" on public.proposals
  for select using (
    exists (select 1 from public.job_posts jp where jp.id = job_post_id and jp.client_id = auth.uid())
    or exists (select 1 from public.freelancer_profiles fp where fp.id = freelancer_profile_id and fp.profile_id = auth.uid())
    or public.is_admin()
  );
drop policy if exists "Freelancers create own proposals" on public.proposals;
create policy "Freelancers create own proposals" on public.proposals
  for insert with check (
    exists (select 1 from public.freelancer_profiles fp where fp.id = freelancer_profile_id and fp.profile_id = auth.uid())
  );

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  job_post_id uuid references public.job_posts(id) on delete set null,
  client_id uuid references public.profiles(id) on delete cascade not null,
  freelancer_profile_id uuid references public.freelancer_profiles(id) on delete cascade not null,
  project_title text,
  freelancer_name text,
  freelancer_avatar_url text,
  amount numeric(12, 2) default 0 not null,
  status text default 'pending' not null check (status in ('pending', 'active', 'completed', 'cancelled', 'disputed')),
  progress integer default 0 not null check (progress >= 0 and progress <= 100),
  due_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.contracts enable row level security;
drop policy if exists "Contract parties can read" on public.contracts;
create policy "Contract parties can read" on public.contracts
  for select using (
    client_id = auth.uid()
    or exists (select 1 from public.freelancer_profiles fp where fp.id = freelancer_profile_id and fp.profile_id = auth.uid())
    or public.is_admin()
  );

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.contracts(id) on delete set null,
  client_id uuid references public.profiles(id) on delete cascade not null,
  freelancer_profile_id uuid references public.freelancer_profiles(id) on delete cascade not null,
  project_title text,
  freelancer_name text,
  amount numeric(12, 2) default 0 not null,
  status text default 'pending' not null check (status in ('pending', 'escrow', 'completed', 'refunded', 'failed')),
  provider text,
  provider_reference text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.payments enable row level security;
drop policy if exists "Payment parties can read" on public.payments;
create policy "Payment parties can read" on public.payments
  for select using (
    client_id = auth.uid()
    or exists (select 1 from public.freelancer_profiles fp where fp.id = freelancer_profile_id and fp.profile_id = auth.uid())
    or public.is_admin()
  );

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid references public.contracts(id) on delete set null,
  freelancer_profile_id uuid references public.freelancer_profiles(id) on delete cascade not null,
  client_id uuid references public.profiles(id) on delete set null,
  client_name text,
  client_avatar_url text,
  project_title text,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  is_public boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.reviews enable row level security;
drop policy if exists "Public reviews are readable" on public.reviews;
create policy "Public reviews are readable" on public.reviews for select using (is_public or client_id = auth.uid() or public.is_admin());

create table if not exists public.saved_freelancers (
  client_id uuid references public.profiles(id) on delete cascade not null,
  freelancer_profile_id uuid references public.freelancer_profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (client_id, freelancer_profile_id)
);

alter table public.saved_freelancers enable row level security;
drop policy if exists "Clients manage saved freelancers" on public.saved_freelancers;
create policy "Clients manage saved freelancers" on public.saved_freelancers
  for all using (client_id = auth.uid()) with check (client_id = auth.uid());

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade not null,
  freelancer_profile_id uuid references public.freelancer_profiles(id) on delete cascade,
  freelancer_user_id uuid references public.profiles(id) on delete cascade,
  participant_name text,
  participant_avatar_url text,
  last_message text default '',
  unread_count integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.conversations enable row level security;
drop policy if exists "Conversation parties can read" on public.conversations;
create policy "Conversation parties can read" on public.conversations
  for select using (client_id = auth.uid() or freelancer_user_id = auth.uid() or public.is_admin());
drop policy if exists "Users can create conversations" on public.conversations;
create policy "Users can create conversations" on public.conversations
  for insert with check (client_id = auth.uid() or freelancer_user_id = auth.uid());

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  sender_name text,
  sender_avatar_url text,
  body text not null,
  read_at timestamptz,
  created_at timestamptz default now() not null
);

alter table public.messages enable row level security;
drop policy if exists "Conversation parties can read messages" on public.messages;
create policy "Conversation parties can read messages" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.client_id = auth.uid() or c.freelancer_user_id = auth.uid() or public.is_admin())
    )
  );
drop policy if exists "Conversation parties can send messages" on public.messages;
create policy "Conversation parties can send messages" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.client_id = auth.uid() or c.freelancer_user_id = auth.uid())
    )
  );

create table if not exists public.admin_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_label text,
  action text not null,
  entity_type text,
  entity_id uuid,
  created_at timestamptz default now() not null
);

alter table public.admin_events enable row level security;
drop policy if exists "Admins read events" on public.admin_events;
create policy "Admins read events" on public.admin_events for select using (public.is_admin());
drop policy if exists "Admins create events" on public.admin_events;
create policy "Admins create events" on public.admin_events for insert with check (public.is_admin());

create or replace view public.marketplace_category_stats as
select
  c.name,
  c.icon,
  coalesce(count(fp.id), 0)::integer as freelancer_count
from public.categories c
left join public.freelancer_profiles fp
  on c.name = any(fp.categories)
  and fp.verification_status = 'verified'
group by c.name, c.icon;

create or replace view public.platform_counters as
select
  (select count(*) from public.profiles)::integer as total_users,
  (select count(*) from public.job_posts where status in ('open', 'active'))::integer as active_projects,
  (select coalesce(sum(amount), 0) from public.payments where status = 'completed' and date_trunc('month', created_at) = date_trunc('month', now()))::numeric as revenue_month,
  (select count(*) from public.contracts where status = 'disputed')::integer as open_disputes,
  (select count(*) from public.freelancer_profiles where verification_status = 'verified')::integer as verified_freelancers;

-- freelancer_profiles
create index if not exists idx_freelancer_profiles_profile_id on public.freelancer_profiles (profile_id);
create index if not exists idx_freelancer_profiles_verification_status on public.freelancer_profiles (verification_status);
create index if not exists idx_freelancer_profiles_rating on public.freelancer_profiles (rating desc);
create index if not exists idx_freelancer_profiles_skills on public.freelancer_profiles using gin (skills);
create index if not exists idx_freelancer_profiles_categories on public.freelancer_profiles using gin (categories);

-- portfolio_items
create index if not exists idx_portfolio_items_freelancer on public.portfolio_items (freelancer_profile_id);

-- services
create index if not exists idx_services_freelancer on public.services (freelancer_profile_id);
create index if not exists idx_services_category on public.services (category_name);
create index if not exists idx_services_status_created on public.services (status, created_at desc);

-- job_posts
create index if not exists idx_job_posts_client_id on public.job_posts (client_id);
create index if not exists idx_job_posts_category on public.job_posts (category_name);
create index if not exists idx_job_posts_status_created on public.job_posts (status, created_at desc);

-- proposals
create index if not exists idx_proposals_job_post on public.proposals (job_post_id);
create index if not exists idx_proposals_freelancer on public.proposals (freelancer_profile_id);
create index if not exists idx_proposals_status on public.proposals (status);

-- contracts
create index if not exists idx_contracts_client on public.contracts (client_id);
create index if not exists idx_contracts_freelancer on public.contracts (freelancer_profile_id);
create index if not exists idx_contracts_job_post on public.contracts (job_post_id);
create index if not exists idx_contracts_status on public.contracts (status);

-- payments
create index if not exists idx_payments_client on public.payments (client_id);
create index if not exists idx_payments_freelancer on public.payments (freelancer_profile_id);
create index if not exists idx_payments_contract on public.payments (contract_id);
create index if not exists idx_payments_provider_reference on public.payments (provider_reference);
create index if not exists idx_payments_status_created on public.payments (status, created_at desc);

-- reviews
create index if not exists idx_reviews_freelancer on public.reviews (freelancer_profile_id);
create index if not exists idx_reviews_freelancer_public on public.reviews (freelancer_profile_id, is_public, created_at desc);

-- saved_freelancers
create index if not exists idx_saved_freelancers_client on public.saved_freelancers (client_id);

-- conversations
create index if not exists idx_conversations_parties on public.conversations (client_id, freelancer_user_id);
create index if not exists idx_conversations_updated on public.conversations (updated_at desc);

-- messages
create index if not exists idx_messages_conversation_created on public.messages (conversation_id, created_at);
create index if not exists idx_messages_sender_conversation on public.messages (sender_id, conversation_id);

-- admin_events
create index if not exists idx_admin_events_created on public.admin_events (created_at desc);
create index if not exists idx_admin_events_actor on public.admin_events (actor_id);

alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;

insert into public.categories (name, icon) values
  ('Web Development', 'Globe'),
  ('App Development', 'Smartphone'),
  ('Backend', 'Server'),
  ('Frontend', 'Layout'),
  ('UI/UX', 'Palette'),
  ('Python', 'Code2'),
  ('Java', 'Coffee'),
  ('MERN Stack', 'Layers'),
  ('WordPress', 'FileCode'),
  ('DevOps', 'Server'),
  ('AI/ML', 'Code2'),
  ('Blockchain', 'Layers')
on conflict (name) do update set icon = excluded.icon;

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('portfolio', 'portfolio', true),
  ('service-images', 'service-images', true)
on conflict (id) do nothing;

-- avatars bucket
drop policy if exists "avatars_select_public" on storage.objects;
create policy "avatars_select_public"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- portfolio bucket
drop policy if exists "portfolio_select_public" on storage.objects;
create policy "portfolio_select_public"
  on storage.objects for select
  using (bucket_id = 'portfolio');

drop policy if exists "portfolio_insert_own" on storage.objects;
create policy "portfolio_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "portfolio_delete_own" on storage.objects;
create policy "portfolio_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- service-images bucket
drop policy if exists "service_images_select_public" on storage.objects;
create policy "service_images_select_public"
  on storage.objects for select
  using (bucket_id = 'service-images');

drop policy if exists "service_images_insert_own" on storage.objects;
create policy "service_images_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'service-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "service_images_delete_own" on storage.objects;
create policy "service_images_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'service-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
