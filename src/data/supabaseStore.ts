/**
 * Supabase-backed data store. Schema and security policies live in
 * supabase/schema.sql — run that once in the Supabase SQL editor.
 */
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { LevelId, SiteContent } from '../content/types'
import type { AppUser, DataStore, LearnerRow, LearnerState, MediaItem, Review } from './types'

const BUCKET = 'media'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toReview(r: any): Review {
  return {
    id: String(r.id),
    userId: r.user_id ?? null,
    name: r.name ?? '',
    role: r.role ?? '',
    rating: r.rating ?? 5,
    text: r.text ?? '',
    status: r.status,
    featured: !!r.featured,
    reply: r.reply ?? '',
    createdAt: r.created_at,
  }
}

function fail(error: { message: string } | null): void {
  if (error) throw new Error(error.message)
}

export function createSupabaseStore(url: string, anonKey: string): DataStore {
  // Implicit flow so email links (confirm, password reset) work even when opened on another device.
  const sb: SupabaseClient = createClient(url, anonKey, { auth: { flowType: 'implicit', persistSession: true, detectSessionInUrl: true } })
  const siteUrl = () => window.location.origin + import.meta.env.BASE_URL

  async function toAppUser(user: User | null | undefined): Promise<AppUser | null> {
    if (!user) return null
    const { data: isAdmin } = await sb.rpc('is_admin')
    const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle()
    return {
      id: user.id,
      email: user.email ?? '',
      name: profile?.name || (user.user_metadata?.name as string) || user.email?.split('@')[0] || 'Learner',
      isAdmin: Boolean(isAdmin),
      blocked: Boolean(profile?.blocked),
    }
  }

  function mediaItem(path: string, size: number, mimeType: string, createdAt: string): MediaItem {
    const [folder, ...rest] = path.split('/')
    return {
      id: path,
      name: rest.join('/') || folder,
      url: sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
      size,
      mimeType,
      folder: rest.length ? folder : 'general',
      createdAt,
    }
  }

  function safeName(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, '-')
  }

  return {
    mode: 'supabase',

    async currentUser() {
      const { data } = await sb.auth.getSession()
      return toAppUser(data.session?.user)
    },
    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange((event, session) => {
        // Defer: calling Supabase inside this callback can deadlock the auth lock.
        setTimeout(() => void toAppUser(session?.user).then((u) => cb(u, event)), 0)
      })
      return () => data.subscription.unsubscribe()
    },
    async signUp(name, email, password) {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { name }, emailRedirectTo: siteUrl() },
      })
      fail(error)
      if (!data.session) return { needsConfirmation: true }
      const user = await toAppUser(data.user)
      return { user: user! }
    },
    async signIn(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password })
      fail(error)
      return (await toAppUser(data.user))!
    },
    async signOut() {
      await sb.auth.signOut()
    },
    async requestPasswordReset(email) {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl()}reset-password` })
      fail(error)
    },
    async updatePassword(password) {
      const { error } = await sb.auth.updateUser({ password })
      fail(error)
    },

    async loadPublished() {
      const { data, error } = await sb.from('site_content').select('data').eq('id', 'published').maybeSingle()
      fail(error)
      return (data?.data as SiteContent) ?? null
    },
    async loadDraft() {
      const { data, error } = await sb.from('site_content').select('data, updated_at').eq('id', 'draft').maybeSingle()
      fail(error)
      return data ? { content: data.data as SiteContent, updatedAt: data.updated_at as string } : null
    },
    async saveDraft(content) {
      const updatedAt = new Date().toISOString()
      const { error } = await sb.from('site_content').upsert({ id: 'draft', data: content, updated_at: updatedAt })
      fail(error)
      return updatedAt
    },
    async publish(content, note) {
      const { error } = await sb.rpc('publish_content', { content, note })
      fail(error)
    },
    async listVersions() {
      const { data, error } = await sb
        .from('content_history')
        .select('id, note, created_at, author')
        .order('created_at', { ascending: false })
        .limit(30)
      fail(error)
      return (data ?? []).map((v) => ({ id: String(v.id), note: v.note ?? '', createdAt: v.created_at, author: v.author ?? '' }))
    },
    async loadVersion(id) {
      const { data, error } = await sb.from('content_history').select('data').eq('id', id).single()
      fail(error)
      if (!data) throw new Error('That version no longer exists.')
      return data.data as SiteContent
    },

    async loadLearner(userId) {
      const { data, error } = await sb.from('profiles').select('state').eq('id', userId).maybeSingle()
      fail(error)
      const state = data?.state as LearnerState | undefined
      return state && Object.keys(state).length ? state : null
    },
    async saveLearner(userId, state) {
      const { error } = await sb
        .from('profiles')
        .update({ state, level: state.level, name: state.name || undefined, last_active_at: new Date().toISOString() })
        .eq('id', userId)
      fail(error)
    },

    async track(type, detail, user) {
      // Analytics must never break the learning experience.
      await sb.from('events').insert({ type, detail, user_id: user?.id ?? null, user_name: user?.name ?? 'Guest' })
    },
    async submitChallenge(user, challengeId, link, notes) {
      const { error } = await sb.from('submissions').insert({ user_id: user.id, user_name: user.name, challenge_id: challengeId, link, notes })
      fail(error)
    },

    async listLearners(): Promise<LearnerRow[]> {
      const { data, error } = await sb
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      fail(error)
      const { data: admins } = await sb.from('admins').select('user_id')
      const adminIds = new Set((admins ?? []).map((a) => a.user_id as string))
      return (data ?? []).map((p) => ({
        id: p.id,
        name: p.name ?? '',
        email: p.email ?? '',
        level: (p.level as LevelId) ?? null,
        state: p.state as LearnerState,
        createdAt: p.created_at,
        lastActiveAt: p.last_active_at,
        blocked: Boolean(p.blocked),
        isAdmin: adminIds.has(p.id),
      }))
    },
    async updateLearnerProfile(id, patch) {
      const row: Record<string, unknown> = { ...patch }
      if (patch.name !== undefined || patch.level !== undefined) {
        // The learner's saved state also carries name and level; keep both in step.
        const { data } = await sb.from('profiles').select('state').eq('id', id).single()
        const state = { ...(data?.state ?? {}) } as Record<string, unknown>
        if (patch.name !== undefined) state.name = patch.name
        if (patch.level !== undefined) state.level = patch.level
        row.state = state
      }
      const { error } = await sb.from('profiles').update(row).eq('id', id)
      fail(error)
    },
    async resetLearnerProgress(id) {
      const { data } = await sb.from('profiles').select('state').eq('id', id).single()
      const s = (data?.state ?? {}) as Partial<LearnerState>
      const state = { ...s, completedLessons: {}, completedChallenges: {}, careerChecks: {}, bookmarks: [], notes: {}, activeDays: [], challengeWork: {}, lastLesson: null, updatedAt: new Date().toISOString() }
      const { error } = await sb.from('profiles').update({ state }).eq('id', id)
      fail(error)
    },
    async setAdmin(id, admin) {
      const { error } = admin ? await sb.from('admins').insert({ user_id: id }) : await sb.from('admins').delete().eq('user_id', id)
      fail(error)
    },
    async listEvents(limit) {
      const { data, error } = await sb.from('events').select('*').order('created_at', { ascending: false }).limit(limit)
      fail(error)
      return (data ?? []).map((e) => ({ id: String(e.id), type: e.type, detail: e.detail ?? '', userName: e.user_name ?? 'Guest', createdAt: e.created_at }))
    },
    async listSubmissions() {
      const { data, error } = await sb.from('submissions').select('*').order('created_at', { ascending: false })
      fail(error)
      return (data ?? []).map((s) => ({
        id: String(s.id),
        userId: s.user_id,
        userName: s.user_name ?? '',
        challengeId: s.challenge_id,
        link: s.link ?? '',
        notes: s.notes ?? '',
        createdAt: s.created_at,
      }))
    },

    async listReviews(all) {
      let q = sb.from('reviews').select('*').order('featured', { ascending: false }).order('created_at', { ascending: false })
      if (!all) q = q.eq('status', 'approved')
      const { data, error } = await q
      fail(error)
      return (data ?? []).map(toReview)
    },
    async submitReview(review, user, autoApprove) {
      // Status is decided by the database (see the reviews trigger in schema.sql), not the browser.
      const { error } = await sb.from('reviews').insert({ user_id: user?.id ?? null, name: review.name, role: review.role, rating: review.rating, text: review.text })
      fail(error)
      // Visitors can't read pending reviews back, so report the status the database will apply.
      return { ...review, id: '', userId: user?.id ?? null, status: autoApprove ? 'approved' : 'pending', featured: false, reply: '', createdAt: new Date().toISOString() }
    },
    async updateReview(id, patch) {
      const { error } = await sb.from('reviews').update(patch).eq('id', id)
      fail(error)
    },
    async deleteReview(id) {
      const { error } = await sb.from('reviews').delete().eq('id', id)
      fail(error)
    },

    async listMedia() {
      const folders = ['documents', 'general', 'thumbnails', 'illustrations', 'profiles', 'courses', 'brand']
      const results = await Promise.all(
        folders.map(async (folder) => {
          const { data } = await sb.storage.from(BUCKET).list(folder, { limit: 500, sortBy: { column: 'created_at', order: 'desc' } })
          return (data ?? [])
            .filter((f) => f.id)
            .map((f) => mediaItem(`${folder}/${f.name}`, f.metadata?.size ?? 0, f.metadata?.mimetype ?? '', f.created_at ?? ''))
        }),
      )
      return results.flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    async uploadMedia(file, folder) {
      const path = `${folder}/${Date.now()}-${safeName(file.name)}`
      const { error } = await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: '31536000' })
      fail(error)
      return mediaItem(path, file.size, file.type, new Date().toISOString())
    },
    async replaceMedia(item, file) {
      // Same path, so every page that uses this image picks up the new file.
      const { error } = await sb.storage.from(BUCKET).update(item.id, file, { contentType: file.type, cacheControl: '60', upsert: true })
      fail(error)
      return { ...item, size: file.size, mimeType: file.type, url: `${item.url.split('?')[0]}?v=${Date.now()}` }
    },
    async deleteMedia(item) {
      const { error } = await sb.storage.from(BUCKET).remove([item.id])
      fail(error)
    },
  }
}
