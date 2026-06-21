-- ============================================================================
-- PAYMENTS: Escrow payment transactions linked to contracts
-- ============================================================================
-- Migrations: 061
-- Dependencies: 010 (profiles), 030 (freelancer_profiles), 060 (contracts)
-- Table: public.payments
-- RLS: Yes
-- ============================================================================

create table if not exists public.payments (
  id                     uuid          primary key default gen_random_uuid(),
  contract_id            uuid          references public.contracts(id) on delete set null,
  client_id              uuid          not null references public.profiles(id) on delete cascade,
  freelancer_profile_id  uuid          not null references public.freelancer_profiles(id) on delete cascade,
  project_title          text,
  freelancer_name        text,
  amount                 numeric(12,2) not null default 0,
  status                 text          not null default 'pending'
                                          check (status in ('pending', 'escrow', 'completed', 'refunded', 'failed')),
  provider               text,
  provider_reference     text,
  created_at             timestamptz   not null default now(),
  updated_at             timestamptz   not null default now()
);

comment on table  public.payments is 'Payment transactions processed through Stripe escrow';
comment on column public.payments.provider is 'Payment provider name (e.g. stripe)';
comment on column public.payments.provider_reference is 'Provider transaction/reference ID (e.g. Stripe PaymentIntent ID)';

-- --------------------------------------------------------------------------
-- Trigger: auto-update updated_at
-- --------------------------------------------------------------------------
drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at
  before update on public.payments
  for each row
  execute procedure public.handle_updated_at();

-- --------------------------------------------------------------------------
-- RLS
-- --------------------------------------------------------------------------
alter table public.payments enable row level security;

drop policy if exists "payments_select_parties" on public.payments;
create policy "payments_select_parties"
  on public.payments for select
  using (
    client_id = auth.uid()
    or exists (select 1 from public.freelancer_profiles fp where fp.id = freelancer_profile_id and fp.profile_id = auth.uid())
    or public.is_admin()
  );
