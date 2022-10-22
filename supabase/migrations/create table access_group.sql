create table public.access_group (
  id          bigint generated always as identity primary key,
  name        text not null,
  created_at  timestamp with time zone default timezone('utc' :: text, now()) not null,
  updated_at  timestamp with time zone default timezone('utc' :: text, now()) not null
);

insert into public.access_group (name) values ('admin') returning id;
insert into public.access_group (name) values ('guest') returning id;
