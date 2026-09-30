-- Designer Kid — hardening (run once after 002 and 003; safe to re-run)
-- 1. Published content can only change through publish_content(); nobody can delete content rows via the API.
-- 2. Anonymous analytics events: only learner event types, no impersonation, rate-limited per connection.
-- 3. Reviews: rate-limited per connection and overall (spam protection for anonymous reviews).
-- Connections are identified by a one-way hash of the client IP (the IP itself is never stored).

-- ─── 1. site_content: admins may only insert/update the draft; no deletes ─────
drop policy if exists "content: admin writes draft" on public.site_content;
drop policy if exists "content: admin inserts draft" on public.site_content;
create policy "content: admin inserts draft" on public.site_content
  for insert with check (public.is_admin() and id = 'draft');
drop policy if exists "content: admin updates draft" on public.site_content;
create policy "content: admin updates draft" on public.site_content
  for update using (public.is_admin() and id = 'draft') with check (public.is_admin() and id = 'draft');
-- (No delete policy: rows can't be deleted through the API. publish_content() is security definer.)

-- ─── Helper: hashed client IP from the PostgREST request headers ──────────────
create or replace function public.client_hash()
returns text language sql stable as $$
  select md5(coalesce(
    nullif(split_part(coalesce(nullif(current_setting('request.headers', true), '')::json ->> 'x-forwarded-for', ''), ',', 1), ''),
    'unknown'
  ) || ':designer-kid');
$$;

-- ─── 2. events ────────────────────────────────────────────────────────────────
alter table public.events add column if not exists client_hash text;
create index if not exists events_client_recent on public.events (client_hash, created_at desc);

drop policy if exists "events: anyone inserts own" on public.events;
create policy "events: anyone inserts own" on public.events
  for insert with check (
    type in ('level_selected', 'lesson_completed', 'module_completed', 'challenge_submitted', 'booking_clicked')
    and (
      (user_id is null and coalesce(user_name, 'Guest') = 'Guest')
      or user_id = auth.uid()
    )
  );

create or replace function public.events_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Events written by trusted functions (sign-up, publish) have no request context: skip limits.
  if nullif(current_setting('request.headers', true), '') is null then
    return new;
  end if;
  new.client_hash := public.client_hash();
  if (select count(*) from public.events
      where client_hash = new.client_hash and created_at > now() - interval '1 minute') >= 60 then
    raise exception 'Too many requests. Please slow down.' using errcode = '53400';
  end if;
  return new;
end;
$$;
drop trigger if exists events_guard on public.events;
create trigger events_guard before insert on public.events
  for each row execute function public.events_guard();

-- ─── 3. reviews ───────────────────────────────────────────────────────────────
alter table public.reviews add column if not exists client_hash text;
create index if not exists reviews_client_recent on public.reviews (client_hash, created_at desc);

create or replace function public.reviews_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin() then
    return new;
  end if;
  new.client_hash := public.client_hash();
  if (select count(*) from public.reviews
      where client_hash = new.client_hash and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'You have sent several reviews recently. Please try again later.' using errcode = '53400';
  end if;
  if (select count(*) from public.reviews where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'We are receiving a lot of reviews right now. Please try again later.' using errcode = '53400';
  end if;
  return new;
end;
$$;
drop trigger if exists reviews_rate_limit on public.reviews;
create trigger reviews_rate_limit before insert on public.reviews
  for each row execute function public.reviews_rate_limit();
