-- Designer Kid — user management (run once; safe to re-run)
-- Adds: admin editing of learner profiles, suspending accounts, managing admins.

alter table public.profiles add column if not exists blocked boolean not null default false;

-- Learners can update their own profile only while not suspended; admins can update anyone.
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid() and not blocked) with check (id = auth.uid());
drop policy if exists "profiles: admin updates" on public.profiles;
create policy "profiles: admin updates" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- Only admins can change the suspension flag.
create or replace function public.protect_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.blocked := old.blocked;
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_protect on public.profiles;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile();

-- Admins can see and manage the admin list (but can't remove themselves).
drop policy if exists "admins: admin reads" on public.admins;
create policy "admins: admin reads" on public.admins for select using (public.is_admin());
drop policy if exists "admins: admin adds" on public.admins;
create policy "admins: admin adds" on public.admins for insert with check (public.is_admin());
drop policy if exists "admins: admin removes others" on public.admins;
create policy "admins: admin removes others" on public.admins for delete using (public.is_admin() and user_id <> auth.uid());

-- Suspended accounts can't post reviews or challenge submissions.
drop policy if exists "reviews: signed-in users write own" on public.reviews;
create policy "reviews: signed-in users write own" on public.reviews
  for insert with check (
    auth.uid() is not null and user_id = auth.uid()
    and not exists (select 1 from public.profiles p where p.id = auth.uid() and p.blocked)
  );
drop policy if exists "submissions: insert own" on public.submissions;
create policy "submissions: insert own" on public.submissions
  for insert with check (
    user_id = auth.uid()
    and not exists (select 1 from public.profiles p where p.id = auth.uid() and p.blocked)
  );
