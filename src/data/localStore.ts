/**
 * Browser-only data store, used when Supabase is not configured.
 * Everything lives in this browser's localStorage, so it is ideal for local
 * development and demos, but nothing is shared between people or devices.
 */
import type { SiteContent } from '../content/types'
import type {
  ActivityEvent,
  AppUser,
  ContentVersion,
  DataStore,
  EventType,
  LearnerRow,
  LearnerState,
  MediaItem,
  Review,
  Submission,
} from './types'

const KEYS = {
  published: 'dk.content.published',
  draft: 'dk.content.draft',
  versions: 'dk.content.versions',
  admin: 'dk.demoAdmin',
  events: 'dk.events',
  submissions: 'dk.submissions',
  media: 'dk.media',
  reviews: 'dk.reviews',
  learner: (id: string) => `dk.learner.${id}`,
}

const DEMO_ADMIN: AppUser = { id: 'demo-admin', email: 'admin@local', name: 'Admin (this browser)', isAdmin: true }
const MAX_VERSIONS = 5
const MAX_MEDIA_BYTES = 1_500_000

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    throw new Error('This browser ran out of local storage space. Remove some media or old versions and try again.', { cause: err })
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

type StoredVersion = ContentVersion & { content: SiteContent }

export function createLocalStore(): DataStore {
  const listeners = new Set<(u: AppUser | null) => void>()
  const emit = (u: AppUser | null) => listeners.forEach((cb) => cb(u))

  return {
    mode: 'local',

    async currentUser() {
      return read<boolean>(KEYS.admin, false) ? DEMO_ADMIN : null
    },
    onAuthChange(cb) {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    async signUp() {
      throw new Error('Accounts need Supabase. Until it is connected, your progress is saved in this browser.')
    },
    async signIn() {
      throw new Error('Accounts need Supabase. Until it is connected, use “Open admin for this browser”.')
    },
    async signOut() {
      localStorage.removeItem(KEYS.admin)
      emit(null)
    },
    async requestPasswordReset() {
      throw new Error('Password reset needs Supabase to be connected.')
    },
    async updatePassword() {
      throw new Error('Passwords need Supabase to be connected.')
    },
    async enterDemoAdmin() {
      write(KEYS.admin, true)
      emit(DEMO_ADMIN)
      return DEMO_ADMIN
    },

    async loadPublished() {
      return read<SiteContent | null>(KEYS.published, null)
    },
    async loadDraft() {
      return read<{ content: SiteContent; updatedAt: string } | null>(KEYS.draft, null)
    },
    async saveDraft(content) {
      const updatedAt = new Date().toISOString()
      write(KEYS.draft, { content, updatedAt })
      return updatedAt
    },
    async publish(content, note) {
      // Browsers allow ~5 MB, and each version is a full copy of the site,
      // so keep as many recent versions as fit and never let history block publishing.
      const versions = read<StoredVersion[]>(KEYS.versions, [])
      versions.unshift({ id: crypto.randomUUID(), note, createdAt: new Date().toISOString(), author: DEMO_ADMIN.name, content })
      localStorage.removeItem(KEYS.versions)
      write(KEYS.published, content)
      for (let keep = Math.min(MAX_VERSIONS, versions.length); keep > 0; keep--) {
        try {
          write(KEYS.versions, versions.slice(0, keep))
          return
        } catch {
          /* too big — try fewer versions */
        }
      }
    },
    async listVersions() {
      return read<StoredVersion[]>(KEYS.versions, []).map(({ content: _content, ...v }) => v)
    },
    async loadVersion(id) {
      const found = read<StoredVersion[]>(KEYS.versions, []).find((v) => v.id === id)
      if (!found) throw new Error('That version no longer exists.')
      return found.content
    },

    async loadLearner(userId) {
      return read<LearnerState | null>(KEYS.learner(userId), null)
    },
    async saveLearner(userId, state) {
      write(KEYS.learner(userId), state)
    },

    async track(type: EventType, detail: string, user) {
      const events = read<ActivityEvent[]>(KEYS.events, [])
      events.unshift({ id: crypto.randomUUID(), type, detail, userName: user?.name || 'Guest (this browser)', createdAt: new Date().toISOString() })
      write(KEYS.events, events.slice(0, 200))
    },
    async submitChallenge(user, challengeId, link, notes) {
      const subs = read<Submission[]>(KEYS.submissions, [])
      subs.unshift({ id: crypto.randomUUID(), userId: user.id, userName: user.name, challengeId, link, notes, createdAt: new Date().toISOString() })
      write(KEYS.submissions, subs)
    },

    async listLearners(): Promise<LearnerRow[]> {
      // In local mode the only learner we can see is the guest in this browser.
      const state = read<LearnerState | null>(KEYS.learner('guest'), null)
      if (!state) return []
      return [
        {
          id: 'guest',
          name: state.name || 'Guest (this browser)',
          email: '—',
          level: state.level,
          state,
          createdAt: state.activeDays[0] ?? state.updatedAt,
          lastActiveAt: state.updatedAt,
          blocked: false,
          isAdmin: false,
        },
      ]
    },
    async updateLearnerProfile(id, patch) {
      const state = read<LearnerState | null>(KEYS.learner(id), null)
      if (!state) return
      write(KEYS.learner(id), { ...state, ...(patch.name !== undefined ? { name: patch.name } : {}), ...(patch.level !== undefined ? { level: patch.level } : {}) })
    },
    async resetLearnerProgress(id) {
      const state = read<LearnerState | null>(KEYS.learner(id), null)
      if (!state) return
      write(KEYS.learner(id), { ...state, completedLessons: {}, completedChallenges: {}, careerChecks: {}, bookmarks: [], notes: {}, activeDays: [], challengeWork: {}, lastLesson: undefined })
    },
    async setAdmin() {
      throw new Error('Managing admins needs Supabase to be connected.')
    },
    async listEvents(limit) {
      return read<ActivityEvent[]>(KEYS.events, []).slice(0, limit)
    },
    async listSubmissions() {
      return read<Submission[]>(KEYS.submissions, [])
    },

    async listReviews(all) {
      const list = read<Review[]>(KEYS.reviews, [])
      return all ? list : list.filter((r) => r.status === 'approved')
    },
    async submitReview(review, user, autoApprove) {
      const r: Review = {
        ...review,
        id: crypto.randomUUID(),
        userId: user?.id ?? null,
        status: autoApprove ? 'approved' : 'pending',
        featured: false,
        reply: '',
        createdAt: new Date().toISOString(),
      }
      write(KEYS.reviews, [r, ...read<Review[]>(KEYS.reviews, [])])
      return r
    },
    async updateReview(id, patch) {
      write(KEYS.reviews, read<Review[]>(KEYS.reviews, []).map((r) => (r.id === id ? { ...r, ...patch } : r)))
    },
    async deleteReview(id) {
      write(KEYS.reviews, read<Review[]>(KEYS.reviews, []).filter((r) => r.id !== id))
    },

    async listMedia() {
      return read<MediaItem[]>(KEYS.media, [])
    },
    async uploadMedia(file, folder) {
      if (file.size > MAX_MEDIA_BYTES) {
        throw new Error('In browser-only mode files must be under 1.5 MB. Connect Supabase Storage for larger files (up to 50 MB).')
      }
      const item: MediaItem = {
        id: crypto.randomUUID(),
        name: file.name,
        url: await fileToDataUrl(file),
        size: file.size,
        mimeType: file.type,
        folder,
        createdAt: new Date().toISOString(),
      }
      write(KEYS.media, [item, ...read<MediaItem[]>(KEYS.media, [])])
      return item
    },
    async replaceMedia(item, file) {
      if (file.size > MAX_MEDIA_BYTES) throw new Error('In browser-only mode files must be under 1.5 MB.')
      const next: MediaItem = { ...item, name: file.name, size: file.size, mimeType: file.type, url: await fileToDataUrl(file), createdAt: new Date().toISOString() }
      write(KEYS.media, read<MediaItem[]>(KEYS.media, []).map((m) => (m.id === item.id ? next : m)))
      return next
    },
    async deleteMedia(item) {
      write(KEYS.media, read<MediaItem[]>(KEYS.media, []).filter((m) => m.id !== item.id))
    },
  }
}
