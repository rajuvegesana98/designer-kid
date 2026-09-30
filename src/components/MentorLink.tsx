import { ExternalLink } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { store } from '../data'
import { useAuth } from '../state/auth'
import { useContent } from '../state/content'

export function useMentor() {
  const { content } = useContent()
  const m = content.mentor
  return { ...m, available: m.enabled && /^https?:\/\//.test(m.bookingUrl) }
}

/** Opens the admin-configured booking tool (Calendly, Cal.com, Topmate…) in a new tab. */
export function MentorLink({ className = 'btn btn-primary', children, style, onClick }: { className?: string; children?: ReactNode; style?: CSSProperties; onClick?: () => void }) {
  const mentor = useMentor()
  const { user } = useAuth()
  if (!mentor.available) return null
  return (
    <a
      href={mentor.bookingUrl}
      target="_blank"
      rel="noreferrer"
      className={className}
      style={style}
      onClick={() => {
        onClick?.()
        void store.track('booking_clicked', 'Opened 1:1 booking page', user ? { id: user.id, name: user.name } : null).catch(() => {})
      }}
    >
      {children ?? mentor.ctaLabel}
      <ExternalLink size={16} aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
