-- ============================================================================
-- REALTIME: Supabase Realtime subscriptions for live updates
-- ============================================================================
-- Migrations: 120
-- Dependencies: 080 (conversations, messages)
-- ============================================================================
-- Only tables that need real-time change data capture (CDC) are added.
-- Conversations: INSERT/UPDATE/DELETE for live inbox updates.
-- Messages: INSERT for real-time message delivery.
-- ============================================================================

alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;
