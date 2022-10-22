-- Set up Storage!
insert into storage.buckets (id, name)
  values ('profile', 'profile');

create policy "User photos are publicly accessible." on storage.objects
  for select using (bucket_id = 'profile');

create policy "user can update their own photo" on storage.objects
  for update with check (bucket_id = 'profile' and auth.uid() = owner);

create policy "admin users can update user photo" on storage.objects
  for update with check (
    bucket_id = 'profile' and auth.uid() in (select id from public.users where access_group = 1)
  );