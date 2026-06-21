-- ============================================================================
-- STORAGE: Supabase Storage buckets and access policies
-- ============================================================================
-- Migrations: 130
-- Dependencies: none (standalone)
-- Buckets: avatars, portfolio, service-images
-- ============================================================================
-- File upload paths use the pattern: {bucket}/{userId}/{filename}
-- RLS policies enforce user-level isolation by matching auth.uid()
-- against the first path segment.
-- ============================================================================

-- --------------------------------------------------------------------------
-- Buckets
-- --------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('avatars',        'avatars',        true),
  ('portfolio',      'portfolio',      true),
  ('service-images', 'service-images', true)
on conflict (id) do nothing;

-- --------------------------------------------------------------------------
-- avatars bucket policies
-- --------------------------------------------------------------------------
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

-- --------------------------------------------------------------------------
-- portfolio bucket policies
-- --------------------------------------------------------------------------
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

-- --------------------------------------------------------------------------
-- service-images bucket policies
-- --------------------------------------------------------------------------
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
