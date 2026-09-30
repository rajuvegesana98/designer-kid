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

/**
 * Older saved content may predate newer settings; fill any missing top-level
 * sections. Small sections come from lightweight defaults and the blog from its
 * own chunk, so a live site doesn't download the whole starter content just to
 * backfill them. Also puts "Blog" in the menu if the menu has no /blog item
 * (admins can hide it with the menu item's Visible switch).
 */
export async function withDefaults(content: SiteContent | null): Promise<SiteContent | null> {
  if (!content) return null
  const merged = { ...content } as SiteContent
  const small = await import('../content/defaults')
  if (merged.reviews === undefined) merged.reviews = structuredClone(small.defaultReviews)
  if (merged.notifications === undefined) merged.notifications = structuredClone(small.defaultNotifications)
  if (merged.promos === undefined) merged.promos = structuredClone(small.defaultPromos)
  if (merged.blog === undefined) {
    const [a, b] = await Promise.all([import('../content/seed/blog'), import('../content/seed/blogDesign')])
    merged.blog = structuredClone([...a.blogPosts, ...b.designPosts])
  }
  const heavy: (keyof SiteContent)[] = ['brand', 'theme', 'home', 'navigation', 'footer', 'mentor', 'levels', 'challenges', 'resources', 'careerGuides', 'announcements', 'achievements']
  const missing = heavy.filter((k) => merged[k] === undefined)
  if (missing.length) {
    const seed = await loadSeed()
    for (const k of missing) (merged as unknown as Record<string, unknown>)[k] = seed[k]
  }
  if (merged.blog.length && Array.isArray(merged.navigation) && !merged.navigation.some((n) => n.path === '/blog')) {
    const i = merged.navigation.findIndex((n) => n.id === 'reviews')
    const item = { id: 'blog', label: 'Blog', path: '/blog', visible: true }
    merged.navigation = i >= 0 ? [...merged.navigation.slice(0, i), item, ...merged.navigation.slice(i)] : [...merged.navigation, item]
  }
  return merged
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
