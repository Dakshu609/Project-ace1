-- ============================================================================
-- MESSAGING: Conversations and messages for real-time chat
-- ============================================================================
-- Migrations: 080
-- Dependencies: 010 (profiles), 030 (freelancer_profiles)
-- Tables: public.conversations, public.messages
-- RLS: Yes
-- Realtime: Both tables published to supabase_realtime
-- ============================================================================

create table if not exists public.conversations (
  id                     uuid        primary key default gen_random_uuid(),
  client_id              uuid        not null references public.profiles(id) on delete cascade,
  freelancer_profile_id  uuid        references public.freelancer_profiles(id) on delete cascade,
  freelancer_user_id     uuid        references public.profiles(id) on delete cascade,
  participant_name       text,
  participant_avatar_url text,
  last_message           text        not null default '',
  unread_count           integer     not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table  public.conversations is 'Message threads between clients and freelancers';
comment on column public.conversations.last_message is 'Denormalized latest message body for preview';
comment on column public.conversations.unread_count is 'Denormalized count of unread messages';

-- --------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- --------------------------------------------------------------------------
drop trigger if exists conversations_updated_at on public.conversations;
create trigger conversations_updated_at
  before update on public.conversations
  for each row
  execute procedure public.handle_updated_at();

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.conversations enable row level security;

drop policy if exists "conversations_select_parties" on public.conversations;
create policy "conversations_select_parties"
  on public.conversations for select
  using (client_id = auth.uid() or freelancer_user_id = auth.uid() or public.is_admin());

drop policy if exists "conversations_insert_parties" on public.conversations;
create policy "conversations_insert_parties"
  on public.conversations for insert
  with check (client_id = auth.uid() or freelancer_user_id = auth.uid());

-- ============================================================================
-- MESSAGES
-- ============================================================================

create table if not exists public.messages (
  id                uuid        primary key default gen_random_uuid(),
  conversation_id   uuid        not null references public.conversations(id) on delete cascade,
  sender_id         uuid        not null references public.profiles(id) on delete cascade,
  sender_name       text,
  sender_avatar_url text,
  body              text        not null,
  read_at           timestamptz,
  created_at        timestamptz not null default now()
);

comment on table  public.messages is 'Individual messages within a conversation thread';
comment on column public.messages.read_at is 'Timestamp when the message was read; null until read';

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.messages enable row level security;

drop policy if exists "messages_select_parties" on public.messages;
create policy "messages_select_parties"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.client_id = auth.uid() or c.freelancer_user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "messages_insert_self" on public.messages;
create policy "messages_insert_self"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.client_id = auth.uid() or c.freelancer_user_id = auth.uid())
    )
  );
