-- Designer Kid — open learning (run once; safe to re-run)
-- Learners use the site without accounts, so:
--  1. Anyone can submit a review (the reviews trigger still decides pending/approved).
--  2. The Blog is added to the published menu if it's missing.

drop policy if exists "reviews: signed-in users write own" on public.reviews;
drop policy if exists "reviews: anyone submits" on public.reviews;
create policy "reviews: anyone submits" on public.reviews
  for insert with check (
    (user_id is null or user_id = auth.uid())
    and not exists (select 1 from public.profiles p where p.id = auth.uid() and p.blocked)
  );

-- Add "Blog" to the site menu (published and draft) if it isn't there yet.
update public.site_content
set data = jsonb_set(
  data,
  '{navigation}',
  (data -> 'navigation') || '[{"id":"blog","label":"Blog","path":"/blog","visible":true}]'::jsonb
)
where data ? 'navigation'
  and not exists (select 1 from jsonb_array_elements(data -> 'navigation') n where n ->> 'path' = '/blog');
