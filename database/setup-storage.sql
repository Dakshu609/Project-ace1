-- Setup Supabase Storage Buckets
-- Run this in Supabase SQL Editor after creating the main schema

-- Create storage buckets
insert into storage.buckets (id, name, public)
values 
  ('avatars', 'avatars', true),
  ('portfolio', 'portfolio', true),
  ('service-images', 'service-images', true)
on conflict (id) do nothing;

-- Set up storage policies for avatars
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Set up storage policies for portfolio
create policy "Portfolio images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'portfolio' );

create policy "Users can upload portfolio images"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their portfolio images"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Set up storage policies for service images
create policy "Service images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'service-images' );

create policy "Users can upload service images"
  on storage.objects for insert
  with check (
    bucket_id = 'service-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their service images"
  on storage.objects for delete
  using (
    bucket_id = 'service-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
