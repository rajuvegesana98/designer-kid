import { useEffect } from 'react'
import { useContent } from '../state/content'

/** Sets the browser tab title for a page ("Lesson title — Designer Kid"). */
export function usePageTitle(title?: string | null) {
  const { content } = useContent()
  useEffect(() => {
    const brand = content.brand.name
    document.title = title ? `${title} — ${brand}` : `${brand} — ${content.brand.tagline}`
  }, [title, content.brand.name, content.brand.tagline])
}
