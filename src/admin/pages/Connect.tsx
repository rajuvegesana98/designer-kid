import { ExternalLink } from 'lucide-react'
import type { CSSProperties } from 'react'
import { PageHeader, timeAgo } from '../../components/ui'
import { FormSection, ImageField, LinesField, TextArea, TextField, Toggle } from '../fields'
import { useAdmin } from '../state'
import { useAnalytics } from './Dashboard'

export function ConnectAdmin() {
  const { draft, update, openPreview } = useAdmin()
  const { data } = useAnalytics()
  const m = draft.mentor
  const set = (fn: (x: typeof m) => void) => update((d) => fn(d.mentor))
  const validUrl = /^https?:\/\/\S+\.\S+/.test(m.bookingUrl)
  const clicks = (data?.events ?? []).filter((e) => e.type === 'booking_clicked')

  return (
    <>
      <PageHeader title="1:1 Connect" eyebrow="People">
        Students book sessions through your own scheduling tool. Paste its link here and every “Connect 1:1” button on the site opens it.
      </PageHeader>
      <div className="grid admin-split">
        <div className="stack" style={{ '--gap': 'var(--space-4)', gridColumn: '1 / -1' } as CSSProperties}>
          <FormSection title="Booking link">
            <Toggle label="Show 1:1 Connect to students" checked={m.enabled} onChange={(v) => set((x) => { x.enabled = v })} />
            <TextField
              label="Booking page URL"
              type="url"
              placeholder="https://calendly.com/your-name/30min"
              value={m.bookingUrl}
              onChange={(v) => set((x) => { x.bookingUrl = v.trim() })}
              hint="Calendly, Cal.com, Topmate, Google Calendar appointment pages, Zcal… Session length, available days, time slots, approvals, rescheduling and reminders are managed in that tool."
            />
            {!validUrl && m.bookingUrl && <p className="error" role="alert" style={{ color: 'var(--c-danger)' }}>Enter a full link starting with https://</p>}
            {!m.bookingUrl && <p className="callout callout-warning small">No link yet — 1:1 buttons are hidden from students until you add one.</p>}
            {validUrl && (
              <a className="btn btn-sm" style={{ width: 'fit-content' }} href={m.bookingUrl} target="_blank" rel="noreferrer">
                Test link <ExternalLink size={14} aria-hidden />
              </a>
            )}
            <TextField label="Button label" value={m.ctaLabel} onChange={(v) => set((x) => { x.ctaLabel = v })} />
          </FormSection>
          <FormSection title="Mentor profile" actions={<button className="btn btn-sm" onClick={() => openPreview('/')}>Preview dashboard</button>}>
            <div className="grid grid-2">
              <TextField label="Name" value={m.name} onChange={(v) => set((x) => { x.name = v })} />
              <TextField label="Role" value={m.role} onChange={(v) => set((x) => { x.role = v })} />
            </div>
            <TextArea label="Short bio" rows={3} value={m.bio} onChange={(v) => set((x) => { x.bio = v })} />
            <ImageField label="Photo" folder="profiles" value={m.photo} onChange={(v) => set((x) => { x.photo = v })} />
            <LinesField label="Session topics shown to students" value={m.topics} onChange={(v) => set((x) => { x.topics = v })} />
          </FormSection>
          <FormSection title="Booking activity" description="How often students open your booking page. Confirmed bookings live in your scheduling tool.">
            {clicks.length === 0 ? (
              <p className="muted small">No clicks recorded yet.</p>
            ) : (
              <ul className="list">
                {clicks.slice(0, 15).map((e) => (
                  <li key={e.id} className="list-item small">
                    <span className="grow"><strong>{e.userName}</strong> opened the booking page</span>
                    <span className="subtle">{timeAgo(e.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </FormSection>
        </div>
      </div>
    </>
  )
}
