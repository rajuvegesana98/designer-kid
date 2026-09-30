import { ExternalLink, Mail } from 'lucide-react'
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

/** Full 1:1 panel: always visible when 1:1 is enabled, with a sensible fallback before a booking link exists. */
export function MentorSection({ id = 'mentor', compact }: { id?: string; compact?: boolean }) {
  const mentor = useMentor()
  const { content } = useContent()
  if (!mentor.enabled) return null
  const email = content.footer?.email
  return (
    <div id={id} className="card tinted mentor-panel" style={{ padding: compact ? 'var(--space-5)' : 'var(--space-6)', scrollMarginTop: 90 }}>
      <div className="mentor-panel-grid">
        {mentor.photo ? (
          <img src={mentor.photo} alt={mentor.name} className="avatar" style={{ width: 96, height: 96 }} />
        ) : (
          <span className="avatar" style={{ width: 96, height: 96, fontSize: '2.2rem' }}>{mentor.name[0]}</span>
        )}
        <div className="stack" style={{ '--gap': '10px' } as React.CSSProperties}>
          <span className="eyebrow">1:1 Connect</span>
          <h2 id={`${id}-title`}>Get a human eye on your work</h2>
          <p className="muted"><strong style={{ color: 'var(--c-text)' }}>{mentor.name}</strong>{mentor.role ? ` · ${mentor.role}` : ''}</p>
          <p className="muted">{mentor.bio}</p>
          <div className="chip-group" aria-label="What you can book a session for">
            {mentor.topics.map((t) => <span key={t} className="badge">{t}</span>)}
          </div>
          <div className="row" style={{ marginTop: 6 }}>
            {mentor.available ? (
              <MentorLink className="btn btn-primary btn-lg" />
            ) : email ? (
              <a className="btn btn-primary btn-lg" href={`mailto:${email}?subject=${encodeURIComponent('1:1 session request')}`}>
                <Mail size={18} aria-hidden /> {mentor.ctaLabel}
              </a>
            ) : (
              <span className="badge badge-warning">Booking opens soon</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
