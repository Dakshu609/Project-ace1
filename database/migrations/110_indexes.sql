-- ============================================================================
-- INDEXES: Performance indexes for query patterns
-- ============================================================================
-- Migrations: 110
-- Dependencies: All tables (010–090)
-- ============================================================================
-- Index naming convention: idx_{table}_{column(s)}
-- ============================================================================

-- --------------------------------------------------------------------------
-- freelancer_profiles
-- --------------------------------------------------------------------------
create index if not exists idx_freelancer_profiles_profile_id
  on public.freelancer_profiles (profile_id);

create index if not exists idx_freelancer_profiles_verification_status
  on public.freelancer_profiles (verification_status);

create index if not exists idx_freelancer_profiles_rating
  on public.freelancer_profiles (rating desc);

create index if not exists idx_freelancer_profiles_skills
  on public.freelancer_profiles using gin (skills);

create index if not exists idx_freelancer_profiles_categories
  on public.freelancer_profiles using gin (categories);

-- --------------------------------------------------------------------------
-- portfolio_items
-- --------------------------------------------------------------------------
create index if not exists idx_portfolio_items_freelancer
  on public.portfolio_items (freelancer_profile_id);

-- --------------------------------------------------------------------------
-- services
-- --------------------------------------------------------------------------
create index if not exists idx_services_freelancer
  on public.services (freelancer_profile_id);

create index if not exists idx_services_category
  on public.services (category_name);

create index if not exists idx_services_status_created
  on public.services (status, created_at desc);

-- --------------------------------------------------------------------------
-- job_posts
-- --------------------------------------------------------------------------
create index if not exists idx_job_posts_client_id
  on public.job_posts (client_id);

create index if not exists idx_job_posts_category
  on public.job_posts (category_name);

create index if not exists idx_job_posts_status_created
  on public.job_posts (status, created_at desc);

-- --------------------------------------------------------------------------
-- proposals
-- --------------------------------------------------------------------------
create index if not exists idx_proposals_job_post
  on public.proposals (job_post_id);

create index if not exists idx_proposals_freelancer
  on public.proposals (freelancer_profile_id);

create index if not exists idx_proposals_status
  on public.proposals (status);

-- --------------------------------------------------------------------------
-- contracts
-- --------------------------------------------------------------------------
create index if not exists idx_contracts_client
  on public.contracts (client_id);

create index if not exists idx_contracts_freelancer
  on public.contracts (freelancer_profile_id);

create index if not exists idx_contracts_job_post
  on public.contracts (job_post_id);

create index if not exists idx_contracts_status
  on public.contracts (status);

-- --------------------------------------------------------------------------
-- payments
-- --------------------------------------------------------------------------
create index if not exists idx_payments_client
  on public.payments (client_id);

create index if not exists idx_payments_freelancer
  on public.payments (freelancer_profile_id);

create index if not exists idx_payments_contract
  on public.payments (contract_id);

create index if not exists idx_payments_provider_reference
  on public.payments (provider_reference);

create index if not exists idx_payments_status_created
  on public.payments (status, created_at desc);

-- --------------------------------------------------------------------------
-- reviews
-- --------------------------------------------------------------------------
create index if not exists idx_reviews_freelancer
  on public.reviews (freelancer_profile_id);

create index if not exists idx_reviews_freelancer_public
  on public.reviews (freelancer_profile_id, is_public, created_at desc);

-- --------------------------------------------------------------------------
-- saved_freelancers
-- --------------------------------------------------------------------------
create index if not exists idx_saved_freelancers_client
  on public.saved_freelancers (client_id);

-- --------------------------------------------------------------------------
-- conversations
-- --------------------------------------------------------------------------
create index if not exists idx_conversations_parties
  on public.conversations (client_id, freelancer_user_id);

create index if not exists idx_conversations_updated
  on public.conversations (updated_at desc);

-- --------------------------------------------------------------------------
-- messages
-- --------------------------------------------------------------------------
create index if not exists idx_messages_conversation_created
  on public.messages (conversation_id, created_at);

create index if not exists idx_messages_sender_conversation
  on public.messages (sender_id, conversation_id);

-- --------------------------------------------------------------------------
-- admin_events
-- --------------------------------------------------------------------------
create index if not exists idx_admin_events_created
  on public.admin_events (created_at desc);

create index if not exists idx_admin_events_actor
  on public.admin_events (actor_id);
