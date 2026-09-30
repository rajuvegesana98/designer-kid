import { useEffect } from 'react'
import { useContent } from '../state/content'

/** Number of mounted pages that currently own the tab title (see ui.tsx, which only sets the default when this is 0). */
export const pageTitle = { active: 0 }

/** Sets the browser tab title for a page ("Lesson title — Designer Kid"); restores the default when the page closes. */
export function usePageTitle(title?: string | null) {
  const { content } = useContent()
  const brand = content.brand.name
  const tagline = content.brand.tagline
  useEffect(() => {
    if (!title) return
    pageTitle.active++
    document.title = `${title} — ${brand}`
    return () => {
      pageTitle.active--
      document.title = `${brand} — ${tagline}`
    }
  }, [title, brand, tagline])
}
