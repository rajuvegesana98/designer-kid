import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Course, Lesson, Level, LevelId, Module, SiteContent } from '../content/types'
import { store, type ContentVersion } from '../data'
import { loadSeed, PREVIEW_KEY, useContent, withDefaults } from '../state/content'

type SaveState = 'saved' | 'saving' | 'unsaved' | 'error'

interface AdminCtx {
  draft: SiteContent
  published: SiteContent
  /** Draft differs from what students currently see. */
  hasUnpublished: boolean
  changedSections: string[]
  saveState: SaveState
  savedAt: string | null
  update(recipe: (d: SiteContent) => void): void
  replaceDraft(next: SiteContent): void
  saveNow(): Promise<void>
  publish(note: string): Promise<void>
  discard(): void
  openPreview(path?: string): void
  listVersions(): Promise<ContentVersion[]>
  loadVersion(id: string): Promise<SiteContent>
}

const Ctx = createContext<AdminCtx | null>(null)

const SECTION_LABELS: Record<string, string> = {
  brand: 'Brand',
  theme: 'Theme',
  home: 'Homepage',
  navigation: 'Navigation',
  footer: 'Footer',
  mentor: '1:1 Connect',
  reviews: 'Reviews settings',
  notifications: 'Notification settings',
  levels: 'Levels & courses',
  challenges: 'Challenges',
  resources: 'Resources',
  careerGuides: 'Career guides',
  announcements: 'Announcements',
  achievements: 'Achievements',
}

export function diffSections(a: SiteContent, b: SiteContent): string[] {
  return (Object.keys(SECTION_LABELS) as (keyof SiteContent)[])
    .filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]))
    .map((k) => SECTION_LABELS[k])
}

function writePreview(content: SiteContent) {
  try {
    localStorage.setItem(PREVIEW_KEY, JSON.stringify(content))
  } catch {
    /* preview falls back to published content */
  }
}

export function AdminProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { raw, reload } = useContent()
  const [draft, setDraft] = useState<SiteContent | null>(null)
  const [published, setPublished] = useState<SiteContent>(raw)
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [neverPublished, setNeverPublished] = useState(false)
  const draftRef = useRef<SiteContent | null>(null)
  const dirty = useRef(false)
  const saveTimer = useRef<number | undefined>(undefined)
  const previewTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const live = await withDefaults(await store.loadPublished())
      const pub = live ?? (await loadSeed())
      if (alive) setNeverPublished(!live)
      const savedRaw = await store.loadDraft()
      const saved = savedRaw ? { ...savedRaw, content: (await withDefaults(savedRaw.content))! } : null
      if (!alive) return
      setPublished(pub)
      setDraft(saved?.content ?? structuredClone(pub))
      setSavedAt(saved?.updatedAt ?? null)
    })().catch((err) => {
      console.error(err)
      if (alive) setDraft(structuredClone(raw))
    })
    return () => {
      alive = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  draftRef.current = draft

  const persist = useCallback(async () => {
    const d = draftRef.current
    if (!d || !dirty.current) return
    setSaveState('saving')
    try {
      const at = await store.saveDraft(d)
      dirty.current = false
      setSavedAt(at)
      setSaveState('saved')
    } catch (err) {
      console.error(err)
      setSaveState('error')
    }
  }, [])

  const schedule = useCallback(
    (next: SiteContent) => {
      dirty.current = true
      setSaveState('unsaved')
      window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => void persist(), 1200)
      window.clearTimeout(previewTimer.current)
      previewTimer.current = window.setTimeout(() => writePreview(next), 250)
    },
    [persist],
  )

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    const onUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault()
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])

  const value = useMemo<AdminCtx | null>(() => {
    if (!draft) return null
    const changed = diffSections(published, draft)
    if (neverPublished && !changed.length) changed.push('Initial publish of starter content')
    return {
      draft,
      published,
      hasUnpublished: changed.length > 0,
      changedSections: changed,
      saveState,
      savedAt,
      update(recipe) {
        setDraft((prev) => {
          if (!prev) return prev
          const next = structuredClone(prev)
          recipe(next)
          schedule(next)
          return next
        })
      },
      replaceDraft(next) {
        setDraft(next)
        schedule(next)
      },
      saveNow: persist,
      async publish(note) {
        window.clearTimeout(saveTimer.current)
        await store.publish(draft, note)
        dirty.current = false
        setNeverPublished(false)
        setPublished(structuredClone(draft))
        setSaveState('saved')
        setSavedAt(new Date().toISOString())
        await reload()
      },
      discard() {
        const next = structuredClone(published)
        setDraft(next)
        schedule(next)
      },
      openPreview(path = '/') {
        writePreview(draft)
        const base = import.meta.env.BASE_URL.replace(/\/$/, '')
        const [p, hash] = path.split('#')
        window.open(`${base}${p}${p.includes('?') ? '&' : '?'}preview=1${hash ? `#${hash}` : ''}`, 'dk-preview')
      },
      listVersions: () => store.listVersions(),
      loadVersion: (id) => store.loadVersion(id),
    }
  }, [draft, published, saveState, savedAt, schedule, persist, reload, neverPublished])

  if (!value) return <>{fallback}</>
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAdmin() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}

/* ─── Tree helpers used inside update() recipes ────────────────────────── */

export function lvl(d: SiteContent, levelId: LevelId): Level {
  const l = d.levels.find((x) => x.id === levelId)
  if (!l) throw new Error(`Level ${levelId} not found`)
  return l
}
export function course(d: SiteContent, levelId: LevelId, courseId: string): Course {
  const c = lvl(d, levelId).courses.find((x) => x.id === courseId)
  if (!c) throw new Error(`Course ${courseId} not found`)
  return c
}
export function mod(d: SiteContent, levelId: LevelId, courseId: string, moduleId: string): Module {
  const m = course(d, levelId, courseId).modules.find((x) => x.id === moduleId)
  if (!m) throw new Error(`Module ${moduleId} not found`)
  return m
}
export function lesson(d: SiteContent, levelId: LevelId, courseId: string, moduleId: string, lessonId: string): Lesson {
  const l = mod(d, levelId, courseId, moduleId).lessons.find((x) => x.id === lessonId)
  if (!l) throw new Error(`Lesson ${lessonId} not found`)
  return l
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

/** Unique id with a readable prefix, e.g. "lesson-colour-basics-x7k2". */
export function newId(prefix: string, title = '') {
  const rand = Math.random().toString(36).slice(2, 6)
  const slug = slugify(title)
  return `${prefix}-${slug ? slug + '-' : ''}${rand}`
}

export function moveItem<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return
  const [item] = arr.splice(from, 1)
  arr.splice(to, 0, item)
}
