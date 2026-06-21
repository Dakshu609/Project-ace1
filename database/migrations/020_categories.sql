-- ============================================================================
-- CATEGORIES: Skill/service categories lookup table
-- ============================================================================
-- Migrations: 020
-- Dependencies: none (standalone)
-- Table: public.categories
-- RLS: Yes — public read
-- ============================================================================

create table if not exists public.categories (
  name       text        primary key,
  icon       text        not null default 'Code2',
  created_at timestamptz not null default now()
);

comment on table  public.categories is 'Skill/service categories used across freelancer_profiles, services, and job_posts';

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.categories enable row level security;

drop policy if exists "Categories are public" on public.categories;
create policy "Categories are public"
  on public.categories for select
  using (true);

-- --------------------------------------------------------------------------
-- Seed data
-- --------------------------------------------------------------------------
insert into public.categories (name, icon) values
  ('Web Development', 'Globe'),
  ('App Development', 'Smartphone'),
  ('Backend',         'Server'),
  ('Frontend',        'Layout'),
  ('UI/UX',           'Palette'),
  ('Python',          'Code2'),
  ('Java',            'Coffee'),
  ('MERN Stack',      'Layers'),
  ('WordPress',       'FileCode'),
  ('DevOps',          'Server'),
  ('AI/ML',           'Code2'),
  ('Blockchain',      'Layers')
on conflict (name) do update set
  icon = excluded.icon;
