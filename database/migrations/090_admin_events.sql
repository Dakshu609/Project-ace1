-- ============================================================================
-- ADMIN EVENTS: Audit log for administrative actions
-- ============================================================================
-- Migrations: 090
-- Dependencies: 010 (profiles)
-- Table: public.admin_events
-- RLS: Yes — admin-only access
-- ============================================================================

create table if not exists public.admin_events (
  id          uuid        primary key default gen_random_uuid(),
  actor_id    uuid        references public.profiles(id) on delete set null,
  actor_label text,
  action      text        not null,
  entity_type text,
  entity_id   uuid,
  created_at  timestamptz not null default now()
);

comment on table  public.admin_events is 'Immutable audit log of all administrative actions';
comment on column public.admin_events.actor_label is 'Denormalized actor display name (survives profile deletion)';
comment on column public.admin_events.action is 'Description of the action taken';
comment on column public.admin_events.entity_type is 'Type of entity affected (e.g. freelancer_profile)';
comment on column public.admin_events.entity_id is 'UUID of the affected entity';

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.admin_events enable row level security;

drop policy if exists "admin_events_select_admin" on public.admin_events;
create policy "admin_events_select_admin"
  on public.admin_events for select
  using (public.is_admin());

drop policy if exists "admin_events_insert_admin" on public.admin_events;
create policy "admin_events_insert_admin"
  on public.admin_events for insert
  with check (public.is_admin());
