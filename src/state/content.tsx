import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SiteContent } from '../content/types'
import { store } from '../data'
import { studentView } from '../lib/content'

export const PREVIEW_KEY = 'dk.preview.content'

interface ContentCtx {
  /** What students see: published (or previewed) content with unpublished items removed. */
  content: SiteContent
  /** Unfiltered published content. */
  raw: SiteContent
  isPreview: boolean
  reload(): Promise<void>
}

const Ctx = createContext<ContentCtx | null>(null)

export async function loadSeed(): Promise<SiteContent> {
  const mod = await import('../content/seed')
  return structuredClone(mod.seedContent)
}

/** Older saved content may predate newer settings; fill any missing top-level sections from the defaults. */
export async function withDefaults(content: SiteContent | null): Promise<SiteContent | null> {
  if (!content) return null
  const keys: (keyof SiteContent)[] = ['brand', 'theme', 'home', 'navigation', 'footer', 'mentor', 'reviews', 'notifications', 'levels', 'challenges', 'resources', 'careerGuides', 'announcements', 'achievements']
  const missing = keys.filter((k) => content[k] === undefined)
  if (!missing.length) return content
  const seed = await loadSeed()
  const merged = { ...content } as Record<string, unknown>
  for (const k of missing) merged[k] = seed[k]
  return merged as unknown as SiteContent
}

function readPreview(): SiteContent | null {
  try {
    const raw = localStorage.getItem(PREVIEW_KEY)
    return raw ? (JSON.parse(raw) as SiteContent) : null
  } catch {
    return null
  }
}

export function isPreviewUrl() {
  return new URLSearchParams(window.location.search).has('preview')
}

export function ContentProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [raw, setRaw] = useState<SiteContent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPreview] = useState(isPreviewUrl)

  const reload = useCallback(async () => {
    try {
      if (isPreview) {
        setRaw((await withDefaults(readPreview() ?? (await store.loadPublished()))) ?? (await loadSeed()))
        return
      }
      setRaw((await withDefaults(await store.loadPublished())) ?? (await loadSeed()))
    } catch (err) {
      // If the backend is unreachable, fall back to the bundled content rather than a blank page.
      console.error(err)
      setError(err instanceof Error ? err.message : String(err))
      setRaw(await loadSeed())
    }
  }, [isPreview])

  useEffect(() => {
    void reload()
  }, [reload])

  // Live preview: the admin editor writes the draft to localStorage on every change.
  useEffect(() => {
    if (!isPreview) return
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREVIEW_KEY) {
        const next = readPreview()
        if (next) void withDefaults(next).then((c) => c && setRaw(c))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [isPreview])

  const value = useMemo(() => (raw ? { raw, content: studentView(raw), isPreview, reload } : null), [raw, isPreview, reload])

  if (!value) return <>{fallback}</>
  if (error) console.warn('Showing bundled content because the live content could not be loaded:', error)
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useContent() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useContent must be used inside ContentProvider')
  return ctx
}
