import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { LevelId } from '../content/types'
import { store, type BookmarkKind, type ChallengeWork, type LearnerState } from '../data'
import { emptyLearner, mergeLearner, today } from '../lib/progress'
import { useAuth } from './auth'

const GUEST_KEY = 'dk.learner.guest'

function readGuest(): LearnerState {
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    return raw ? { ...emptyLearner(), ...(JSON.parse(raw) as LearnerState) } : emptyLearner()
  } catch {
    return emptyLearner()
  }
}

function writeGuest(state: LearnerState) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(state))
  } catch {
    /* storage full or blocked — progress still lives in memory for this session */
  }
}

interface LearnerCtx {
  state: LearnerState
  /** True once remote progress (if any) has been merged in. */
  synced: boolean
  setLevel(level: LevelId): void
  setName(name: string): void
  completeLesson(lessonId: string, title: string): void
  uncompleteLesson(lessonId: string): void
  visitLesson(lessonId: string): void
  toggleBookmark(kind: BookmarkKind, id: string): void
  isBookmarked(kind: BookmarkKind, id: string): boolean
  setNote(lessonId: string, text: string): void
  toggleCareerCheck(key: string): void
  saveChallengeWork(challengeId: string, work: Omit<ChallengeWork, 'updatedAt'>): void
  completeChallenge(challengeId: string, title: string, link: string, notes: string): Promise<void>
  markNotificationsSeen(): void
  resetProgress(): void
  /** Replace progress with a backup file's contents. */
  importState(next: LearnerState): void
}

const Ctx = createContext<LearnerCtx | null>(null)

export function LearnerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, setState] = useState<LearnerState>(readGuest)
  const [synced, setSynced] = useState(store.mode === 'local')
  const userRef = useRef(user)
  userRef.current = user
  const saveTimer = useRef<number | undefined>(undefined)

  // When a learner signs in, merge this browser's progress into their account.
  useEffect(() => {
    if (!user || user.isAdmin && store.mode === 'local') {
      setSynced(true)
      return
    }
    let alive = true
    setSynced(false)
    store
      .loadLearner(user.id)
      .then((remote) => {
        if (!alive) return
        setState((local) => {
          const merged = remote ? mergeLearner(local, remote) : { ...local, name: local.name || user.name }
          void store.saveLearner(user.id, merged).catch(console.error)
          return merged
        })
      })
      .catch(console.error)
      .finally(() => alive && setSynced(true))
    return () => {
      alive = false
    }
  }, [user])

  // Persist: always locally, and debounced to the account when signed in.
  useEffect(() => {
    writeGuest(state)
    const u = userRef.current
    if (!u || !synced || store.mode === 'local') return
    window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => void store.saveLearner(u.id, state).catch(console.error), 800)
  }, [state, synced])

  const update = useCallback((fn: (s: LearnerState) => LearnerState, active = false) => {
    setState((s) => {
      const next = fn(s)
      const day = today()
      return {
        ...next,
        activeDays: active && !next.activeDays.includes(day) ? [...next.activeDays, day] : next.activeDays,
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const trackUser = () => (userRef.current ? { id: userRef.current.id, name: userRef.current.name } : null)

  const value = useMemo<LearnerCtx>(
    () => ({
      state,
      synced,
      setLevel(level) {
        update((s) => ({ ...s, level }))
        void store.track('level_selected', level, trackUser()).catch(() => {})
      },
      setName(name) {
        update((s) => ({ ...s, name }))
      },
      completeLesson(lessonId, title) {
        update((s) => ({ ...s, completedLessons: { ...s.completedLessons, [lessonId]: new Date().toISOString() } }), true)
        void store.track('lesson_completed', title, trackUser()).catch(() => {})
      },
      uncompleteLesson(lessonId) {
        update((s) => {
          const completedLessons = { ...s.completedLessons }
          delete completedLessons[lessonId]
          return { ...s, completedLessons }
        })
      },
      visitLesson(lessonId) {
        update((s) => (s.lastLesson?.id === lessonId ? s : { ...s, lastLesson: { id: lessonId, at: new Date().toISOString() } }), true)
      },
      toggleBookmark(kind, id) {
        update((s) => {
          const exists = s.bookmarks.some((b) => b.kind === kind && b.id === id)
          return {
            ...s,
            bookmarks: exists ? s.bookmarks.filter((b) => !(b.kind === kind && b.id === id)) : [{ kind, id, at: new Date().toISOString() }, ...s.bookmarks],
          }
        })
      },
      isBookmarked(kind, id) {
        return state.bookmarks.some((b) => b.kind === kind && b.id === id)
      },
      setNote(lessonId, text) {
        update((s) => {
          const notes = { ...s.notes }
          if (text.trim()) notes[lessonId] = { text, updatedAt: new Date().toISOString() }
          else delete notes[lessonId]
          return { ...s, notes }
        })
      },
      toggleCareerCheck(key) {
        update((s) => ({ ...s, careerChecks: { ...s.careerChecks, [key]: !s.careerChecks[key] } }), true)
      },
      saveChallengeWork(challengeId, work) {
        update((s) => ({
          ...s,
          challengeWork: { ...s.challengeWork, [challengeId]: { ...s.challengeWork[challengeId], ...work, updatedAt: new Date().toISOString() } },
        }))
      },
      async completeChallenge(challengeId, title, link, notes) {
        const u = userRef.current
        if (u && store.mode === 'supabase') await store.submitChallenge(u, challengeId, link, notes)
        else await store.track('challenge_submitted', title, trackUser()).catch(() => {})
        const at = new Date().toISOString()
        update(
          (s) => ({
            ...s,
            completedChallenges: { ...s.completedChallenges, [challengeId]: at },
            challengeWork: { ...s.challengeWork, [challengeId]: { ...s.challengeWork[challengeId], checks: s.challengeWork[challengeId]?.checks ?? [], link, notes, submittedAt: at, updatedAt: at } },
          }),
          true,
        )
        if (u && store.mode === 'supabase') void store.track('challenge_submitted', title, trackUser()).catch(() => {})
      },
      markNotificationsSeen() {
        update((s) => ({ ...s, notificationsSeenAt: new Date().toISOString() }))
      },
      resetProgress() {
        update((s) => ({ ...emptyLearner(), name: s.name, level: s.level }))
      },
      importState(next) {
        update((s) => mergeLearner({ ...emptyLearner(), ...next }, s))
      },
    }),
    [state, synced, update],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLearner() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLearner must be used inside LearnerProvider')
  return ctx
}
