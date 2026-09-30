import { AnimatePresence, motion } from 'motion/react'
import { Bell } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { SiteContent } from '../content/types'
import type { LearnerState } from '../data'
import { findLesson, getLevel } from '../lib/content'
import { Icon } from '../lib/icons'
import { moduleProgress } from '../lib/progress'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { timeAgo } from './ui'

interface Note {
  id: string
  icon: string
  title: string
  body: string
  date: string
  to?: string
  important?: boolean
}

const RECENT_DAYS = 30

export function buildNotifications(content: SiteContent, state: LearnerState): Note[] {
  const settings = content.notifications
  const cutoff = Date.now() - RECENT_DAYS * 86_400_000
  const recent = (d?: string) => !!d && new Date(d).getTime() >= cutoff
  const level = getLevel(content, state.level)
  const notes: Note[] = []

  for (const a of content.announcements) {
    if (!a.levels.includes('all') && !(state.level && a.levels.includes(state.level))) continue
    if (a.kind === 'career' && !settings.careerUpdates) continue
    if (a.kind !== 'career' && !settings.announcements) continue
    notes.push({ id: `a-${a.id}`, icon: a.kind === 'career' ? 'Briefcase' : 'Sparkles', title: a.title, body: a.body, date: a.date, important: a.important })
  }
  if (level && settings.newLesson) {
    for (const c of level.courses)
      for (const m of c.modules)
        for (const l of m.lessons)
          if (recent(l.addedAt) && !state.completedLessons[l.id])
            notes.push({ id: `l-${l.id}`, icon: 'BookOpen', title: `New lesson: ${l.title}`, body: m.title, date: l.addedAt!, to: `/lesson/${l.id}` })
  }
  if (settings.newChallenge) {
    for (const ch of content.challenges)
      if (recent(ch.addedAt) && (!state.level || ch.level === state.level))
        notes.push({ id: `c-${ch.id}`, icon: 'Target', title: `New challenge: ${ch.title}`, body: ch.category, date: ch.addedAt!, to: `/challenges/${ch.id}` })
  }
  if (level && settings.courseCompletion) {
    for (const c of level.courses) {
      const complete = c.modules.length > 0 && c.modules.every((m) => moduleProgress(m, state).complete)
      if (!complete) continue
      const dates = c.modules.flatMap((m) => m.lessons.map((l) => state.completedLessons[l.id])).filter(Boolean).sort()
      notes.push({ id: `done-${c.id}`, icon: 'Trophy', title: `You completed ${c.title}`, body: 'Great work. Your next course is ready on the roadmap.', date: dates[dates.length - 1] ?? new Date().toISOString(), to: '/learn', important: true })
    }
  }
  return notes.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20)
}

/** Groups "new lesson" notifications per module so a big release doesn't flood the list. */
function collapse(notes: Note[], content: SiteContent): Note[] {
  const out: Note[] = []
  const byModule = new Map<string, Note[]>()
  for (const n of notes) {
    if (n.id.startsWith('l-')) {
      const ref = findLesson(content, n.id.slice(2))
      const key = ref?.module.id ?? n.id
      byModule.set(key, [...(byModule.get(key) ?? []), n])
    } else out.push(n)
  }
  for (const [moduleId, group] of byModule) {
    if (group.length === 1) out.push(group[0])
    else out.push({ id: `mod-${moduleId}`, icon: 'BookOpen', title: `${group.length} new lessons in ${group[0].body}`, body: 'Open the module to see what’s new.', date: group[0].date, to: group[0].to })
  }
  return out.sort((a, b) => b.date.localeCompare(a.date))
}

export function NotificationsButton() {
  const { content } = useContent()
  const { state, markNotificationsSeen } = useLearner()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const notes = useMemo(() => collapse(buildNotifications(content, state), content), [content, state])
  const seen = state.notificationsSeenAt ?? ''
  const unread = notes.filter((n) => n.date > seen).length

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={wrap} style={{ position: 'relative' }}>
      <button
        className="btn btn-ghost btn-icon"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o)
          if (!open && unread) markNotificationsSeen()
        }}
      >
        <Bell size={20} />
        {unread > 0 && <span className="icon-dot" aria-hidden />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="popover" initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.15 }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--c-line)' }}>
              <h2 style={{ fontSize: '1.05rem' }}>Notifications</h2>
            </div>
            <ul className="list" style={{ maxHeight: 420, overflowY: 'auto', padding: 6 }}>
              {!notes.length && <li className="muted" style={{ padding: 16 }}>You’re all caught up.</li>}
              {notes.map((n) => {
                const inner = (
                  <>
                    <span className="icon-tile icon-tile-sm" style={n.important ? ({ '--tile': 'var(--c-secondary)' } as React.CSSProperties) : undefined} aria-hidden>
                      <Icon name={n.icon} size={16} />
                    </span>
                    <span className="grow">
                      <strong style={{ display: 'block', fontSize: '0.93rem' }}>{n.title}</strong>
                      <span className="small muted clamp-2" style={{ display: '-webkit-box' }}>{n.body}</span>
                      <span className="subtle" style={{ fontSize: '0.78rem' }}>{timeAgo(n.date)}</span>
                    </span>
                    {n.date > seen && <span className="badge badge-primary">New</span>}
                  </>
                )
                return (
                  <li key={n.id}>
                    {n.to ? (
                      <Link to={n.to} className="result-item" onClick={() => setOpen(false)}>{inner}</Link>
                    ) : (
                      <div className="result-item" style={{ cursor: 'default' }}>{inner}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
