create type user_status as enum ('active', 'blocked', 'inactive', 'temporary');

create table public.users (
  id            uuid references auth.users,
  created_at    timestamp with time zone default timezone('utc' :: text, now()) not null,
  updated_at    timestamp with time zone default timezone('utc' :: text, now()) not null,
  full_name     text not null,
  cpf           text unique,
  address       text,
  photo_url     text not null,
  access_group  bigint references access_group default 2,
  status        user_status default 'active'::public.user_status,

  primary key (id),
  constraint name_length check (char_length(name) >= 3),
  constraint cpf_length check (char_length(cpf) = 11)
);

comment on column public.users.id is 'References the internal Supabase Auth user.';

--  Users should be able to view and update their own data.
alter table users enable row level security;
create policy "Can view own user data." on public.users for select using (auth.uid() = id);
--create policy "Can update own user data." on public.users for update using (auth.uid() = id);

alter table access_group enable row level security;
create policy "Authenticated users can view access group" 
  on public.access_group 
  for select 
  to authenticated
  using (true);

create policy "Admin users can update access group" 
  on public.access_group
  for all
  using (auth.uid() in (
    select id from public.users where access_group = 1
  ));

create policy "Admin users can update users" 
  on public.users 
  for update using (auth.uid() in (
    select id from public.users where access_group = 1
  ));

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 

create or replace function public.handle_new_user()
returns trigger as $$
  begin
    insert into public.users (id, full_name, cpf, created_at, photo_url)
    values (new.id, 'NEW_USER_INCOMPLETE', 10000000001, new.created_at, 'evilparrot.gif');
    return new;
  end;
$$ language plpgsql security definer;

-- INSERT INTO "users" (
--   "aud", "banned_until", "confirmation_sent_at", "confirmation_token", 
--   "created_at", "email", "email_change", "email_change_confirm_status", 
--   "email_change_sent_at", "email_change_token_current", "email_change_token_new", "email_confirmed_at", 
--   "encrypted_password", "id", "instance_id", "invited_at", "last_sign_in_at", "phone", "phone_change", 
--   "phone_change_sent_at", "phone_change_token", "phone_confirmed_at", "raw_app_meta_data", "raw_user_meta_data", 
--   "reauthentication_sent_at", "reauthentication_token", "recovery_sent_at", "recovery_token", "role", 
--   "updated_at") 
--   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
