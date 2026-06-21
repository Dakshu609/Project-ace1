-- ============================================================================
-- VIEWS: Aggregated data views for performance and convenience
-- ============================================================================
-- Migrations: 100
-- Dependencies: All tables (010–090)
-- Views: marketplace_category_stats, platform_counters
-- ============================================================================

-- --------------------------------------------------------------------------
-- marketplace_category_stats: Freelancer count per category
-- --------------------------------------------------------------------------
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

comment on view public.marketplace_category_stats is 'Live count of verified freelancers per category';

-- --------------------------------------------------------------------------
-- platform_counters: Global platform statistics
-- --------------------------------------------------------------------------
create or replace view public.platform_counters as
select
  (select count(*) from public.profiles)::integer as total_users,
  (select count(*) from public.job_posts where status in ('open', 'active'))::integer as active_projects,
  (
    select coalesce(sum(amount), 0)
    from public.payments
    where status = 'completed'
      and date_trunc('month', created_at) = date_trunc('month', now())
  )::numeric as revenue_month,
  (select count(*) from public.contracts where status = 'disputed')::integer as open_disputes,
  (select count(*) from public.freelancer_profiles where verification_status = 'verified')::integer as verified_freelancers;

comment on view public.platform_counters is 'Aggregated platform metrics for homepage and admin dashboard';
