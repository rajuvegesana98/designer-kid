-- Designer Kid — Supabase schema
-- Run once in Supabase → SQL Editor → New query → Run.
-- Safe to re-run: every statement is idempotent.

-- ─── Admins ──────────────────────────────────────────────────────────────
-- Admin rights live in their own table so learners can never grant them
-- to themselves by editing their profile.
create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ─── Profiles (one row per learner, progress stored as JSON) ────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  email text,
  level text check (level in ('beginner', 'intermediate', 'expert')),
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  insert into public.events (type, detail, user_id, user_name)
  values ('signup', 'Created an account', new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email));
  return new;
end;
$$;

-- ─── Site content: draft + published documents, and version history ─────
create table if not exists public.site_content (
  id text primary key check (id in ('draft', 'published')),
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "content: public reads published" on public.site_content;
create policy "content: public reads published" on public.site_content
  for select using (id = 'published' or public.is_admin());
drop policy if exists "content: admin writes draft" on public.site_content;
create policy "content: admin writes draft" on public.site_content
  for all using (public.is_admin()) with check (public.is_admin() and id = 'draft');

create table if not exists public.content_history (
  id bigint generated always as identity primary key,
  data jsonb not null,
  note text,
  author text,
  created_at timestamptz not null default now()
);
alter table public.content_history enable row level security;
drop policy if exists "history: admin reads" on public.content_history;
create policy "history: admin reads" on public.content_history
  for select using (public.is_admin());

-- Publishing is one transaction: update the live document and keep a version.
create or replace function public.publish_content(content jsonb, note text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can publish';
  end if;
  insert into public.site_content (id, data, updated_at) values ('published', content, now())
    on conflict (id) do update set data = excluded.data, updated_at = now();
  insert into public.site_content (id, data, updated_at) values ('draft', content, now())
    on conflict (id) do update set data = excluded.data, updated_at = now();
  insert into public.content_history (data, note, author)
    values (content, note, (select email from auth.users where id = auth.uid()));
  insert into public.events (type, detail, user_id, user_name)
    values ('content_published', coalesce(nullif(note, ''), 'Published changes'), auth.uid(), 'Admin');
end;
$$;

-- ─── Activity events (powers admin analytics) ────────────────────────────
create table if not exists public.events (
  id bigint generated always as identity primary key,
  type text not null check (type in ('signup','level_selected','lesson_completed','module_completed','challenge_submitted','booking_clicked','content_published')),
  detail text check (char_length(detail) <= 300),
  user_id uuid references auth.users on delete set null,
  user_name text check (char_length(user_name) <= 120),
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
drop policy if exists "events: anyone inserts own" on public.events;
create policy "events: anyone inserts own" on public.events
  for insert with check ((user_id is null or user_id = auth.uid()) and type <> 'content_published');
drop policy if exists "events: admin reads" on public.events;
create policy "events: admin reads" on public.events
  for select using (public.is_admin());

-- Trigger is created after events exists because handle_new_user writes to it.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Challenge submissions ───────────────────────────────────────────────
create table if not exists public.submissions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  user_name text,
  challenge_id text not null,
  link text check (char_length(link) <= 500),
  notes text check (char_length(notes) <= 4000),
  created_at timestamptz not null default now()
);
alter table public.submissions enable row level security;
drop policy if exists "submissions: insert own" on public.submissions;
create policy "submissions: insert own" on public.submissions
  for insert with check (user_id = auth.uid());
drop policy if exists "submissions: read own or admin" on public.submissions;
create policy "submissions: read own or admin" on public.submissions
  for select using (user_id = auth.uid() or public.is_admin());

-- ─── Media storage ───────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists "media: admin insert" on storage.objects;
create policy "media: admin insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin update" on storage.objects;
create policy "media: admin update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin delete" on storage.objects;
create policy "media: admin delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- ─── Make yourself admin ─────────────────────────────────────────────────
-- 1. Sign up on your Designer Kid site with your own email.
-- 2. Then run (replace the email):
-- insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';

-- ─── Reviews about the mentor ────────────────────────────────────────────
create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete set null,
  name text not null check (char_length(name) between 1 and 80),
  role text check (char_length(role) <= 80),
  rating smallint not null check (rating between 1 and 5),
  text text not null check (char_length(text) between 10 and 1200),
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  featured boolean not null default false,
  reply text check (char_length(reply) <= 1200),
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;

-- Learners can't choose their own status: the published "requireApproval"
-- setting decides whether a new review goes live immediately.
create or replace function public.review_defaults()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.featured := false;
  new.reply := null;
  new.status := case
    when coalesce((select (data -> 'reviews' ->> 'requireApproval')::boolean from public.site_content where id = 'published'), true)
      then 'pending' else 'approved' end;
  return new;
end;
$$;
drop trigger if exists reviews_defaults on public.reviews;
create trigger reviews_defaults before insert on public.reviews
  for each row execute function public.review_defaults();

drop policy if exists "reviews: public reads approved" on public.reviews;
create policy "reviews: public reads approved" on public.reviews
  for select using (status = 'approved' or user_id = auth.uid() or public.is_admin());
drop policy if exists "reviews: signed-in users write own" on public.reviews;
create policy "reviews: signed-in users write own" on public.reviews
  for insert with check (auth.uid() is not null and user_id = auth.uid());
drop policy if exists "reviews: admin updates" on public.reviews;
create policy "reviews: admin updates" on public.reviews
  for update using (public.is_admin());
drop policy if exists "reviews: admin deletes" on public.reviews;
create policy "reviews: admin deletes" on public.reviews
  for delete using (public.is_admin());
