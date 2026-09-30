import { ArrowRight, BookOpen, CircleAlert, MessagesSquare, Target, TrendingUp, Users } from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router'
import { EmptyState, PageHeader, Spinner, Tabs, timeAgo } from '../../components/ui'
import type { SiteContent } from '../../content/types'
import { store, type ActivityEvent, type LearnerRow, type Submission } from '../../data'
import { levelLessons } from '../../lib/content'
import { levelProgress } from '../../lib/progress'
import { useAdmin } from '../state'

export interface Analytics {
  learners: LearnerRow[]
  events: ActivityEvent[]
  submissions: Submission[]
}

export function useAnalytics() {
  const [data, setData] = useState<Analytics | null>(null)
  const [error, setError] = useState('')
  const [tick, setTick] = useState(0)
  useEffect(() => {
    Promise.all([store.listLearners(), store.listEvents(1000), store.listSubmissions()])
      .then(([learners, events, submissions]) => setData({ learners, events, submissions }))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }, [tick])
  return { data, error, reload: () => setTick((t) => t + 1) }
}

const DAY = 86_400_000

export function computeStats(content: SiteContent, a: Analytics) {
  const byLevel = Object.fromEntries(content.levels.map((l) => [l.id, 0])) as Record<string, number>
  let coursesDone = 0
  let enrolments = 0
  let lessonsDone = 0
  const now = Date.now()
  const active = a.learners.filter((l) => now - new Date(l.lastActiveAt).getTime() < 7 * DAY).length
  for (const l of a.learners) {
    if (l.level) byLevel[l.level] = (byLevel[l.level] ?? 0) + 1
    const level = content.levels.find((x) => x.id === l.level)
    if (!level || !l.state?.completedLessons) continue
    const p = levelProgress(level, l.state)
    coursesDone += p.coursesDone
    enrolments += p.coursesTotal
    lessonsDone += Object.keys(l.state.completedLessons).length
  }
  const since30 = (t: string) => now - new Date(t).getTime() < 30 * DAY
  return {
    total: a.learners.length,
    byLevel,
    active,
    coursesDone,
    completionRate: enrolments ? coursesDone / enrolments : 0,
    lessonsDone,
    submissions: a.submissions.length || a.events.filter((e) => e.type === 'challenge_submitted').length,
    bookings30: a.events.filter((e) => e.type === 'booking_clicked' && since30(e.createdAt)).length,
    lessons30: a.events.filter((e) => e.type === 'lesson_completed' && since30(e.createdAt)).length,
  }
}

function StatCard({ label, value, hint, icon, to }: { label: string; value: ReactNode; hint?: string; icon: ReactNode; to?: string }) {
  const inner = (
    <>
      <span className="icon-tile icon-tile-sm" aria-hidden>{icon}</span>
      <span className="stat" style={{ marginTop: 10 }}>
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {hint && <span className="subtle" style={{ fontSize: '0.8rem' }}>{hint}</span>}
      </span>
    </>
  )
  return to ? <Link to={to} className="card card-link card-tight">{inner}</Link> : <div className="card card-tight">{inner}</div>
}

const EVENT_LABEL: Record<ActivityEvent['type'], string> = {
  signup: 'joined Designer Kid',
  level_selected: 'chose a level',
  lesson_completed: 'completed a lesson',
  module_completed: 'completed a module',
  challenge_submitted: 'submitted a challenge',
  booking_clicked: 'opened the 1:1 booking page',
  content_published: 'published content',
}

export function AdminDashboard() {
  const { draft, hasUnpublished, changedSections } = useAdmin()
  const { data, error } = useAnalytics()
  const stats = useMemo(() => (data ? computeStats(draft, data) : null), [data, draft])
  const lessonCount = draft.levels.reduce((s, l) => s + levelLessons(l).length, 0)
  const noBooking = !/^https?:\/\//.test(draft.mentor.bookingUrl)
  const [pendingReviews, setPendingReviews] = useState(0)
  useEffect(() => {
    store.listReviews(true).then((r) => setPendingReviews(r.filter((x) => x.status === 'pending').length)).catch(() => {})
  }, [])

  return (
    <>
      <PageHeader title="Dashboard" eyebrow="Overview">What’s happening on Designer Kid, and what needs your attention.</PageHeader>

      {(hasUnpublished || noBooking || pendingReviews > 0 || store.mode === 'local') && (
        <section className="stack" style={{ marginBottom: 'var(--space-5)', '--gap': '10px' } as CSSProperties} aria-label="Needs attention">
          {hasUnpublished && (
            <div className="callout callout-warning row-between">
              <span><strong>You have unpublished changes</strong> in {changedSections.join(', ')}. Preview and publish from the top bar.</span>
            </div>
          )}
          {pendingReviews > 0 && (
            <div className="callout row-between">
              <span><strong>{pendingReviews} review{pendingReviews === 1 ? '' : 's'} waiting for approval.</strong></span>
              <Link to="/admin/reviews" className="btn btn-sm">Review now</Link>
            </div>
          )}
          {noBooking && (
            <div className="callout callout-warning row-between">
              <span><strong>1:1 booking link is missing.</strong> Students won’t see “Connect 1:1” until you add it.</span>
              <Link to="/admin/connect" className="btn btn-sm">Add booking link</Link>
            </div>
          )}
          {store.mode === 'local' && (
            <div className="callout row-between">
              <span><CircleAlert size={16} aria-hidden style={{ verticalAlign: '-3px' }} /> Browser-only mode: learner numbers below only include this browser. Connect Supabase to see every learner.</span>
            </div>
          )}
        </section>
      )}

      {error && <p className="callout callout-warning">Couldn’t load analytics: {error}</p>}
      {!stats ? (
        !error && <Spinner />
      ) : (
        <>
          <div className="grid grid-4">
            <StatCard icon={<Users size={17} />} label="Total learners" value={stats.total} to="/admin/users" />
            {draft.levels.map((l) => (
              <StatCard key={l.id} icon={<span style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />} label={`${l.name} learners`} value={stats.byLevel[l.id] ?? 0} hint={stats.total ? `${Math.round(((stats.byLevel[l.id] ?? 0) / stats.total) * 100)}% of learners` : undefined} />
            ))}
            <StatCard icon={<TrendingUp size={17} />} label="Active learners" value={stats.active} hint="Active in the last 7 days" />
            <StatCard icon={<BookOpen size={17} />} label="Completed courses" value={stats.coursesDone} hint={`${Math.round(stats.completionRate * 100)}% course completion rate`} />
            <StatCard icon={<Target size={17} />} label="Challenge submissions" value={stats.submissions} to="/admin/users?tab=submissions" />
            <StatCard icon={<MessagesSquare size={17} />} label="1:1 booking clicks" value={stats.bookings30} hint="Last 30 days" to="/admin/connect" />
          </div>

          <div className="grid grid-2" style={{ marginTop: 'var(--space-5)' }}>
            <section className="card" aria-labelledby="recent">
              <div className="row-between" style={{ marginBottom: 8 }}>
                <h2 id="recent" style={{ fontSize: '1.1rem' }}>Recent activity</h2>
                <Link to="/admin/analytics" className="btn btn-ghost btn-sm">Analytics <ArrowRight size={15} aria-hidden /></Link>
              </div>
              {data!.events.length === 0 ? (
                <p className="muted small">No activity yet. It appears here as learners sign up, complete lessons and submit challenges.</p>
              ) : (
                <ul className="list">
                  {data!.events.slice(0, 10).map((e) => (
                    <li key={e.id} className="list-item" style={{ alignItems: 'flex-start' }}>
                      <span className="grow small">
                        <strong>{e.userName}</strong> {EVENT_LABEL[e.type]}
                        {e.detail && e.type !== 'level_selected' && <span className="muted">: {e.detail}</span>}
                        {e.type === 'level_selected' && <span className="muted"> ({e.detail})</span>}
                      </span>
                      <span className="subtle nowrap">{timeAgo(e.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="card stack" aria-labelledby="content-h">
              <h2 id="content-h" style={{ fontSize: '1.1rem' }}>Content at a glance</h2>
              <ul className="list">
                {draft.levels.map((l) => (
                  <li key={l.id} className="list-item">
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} aria-hidden />
                    <span className="grow"><strong>{l.name}</strong> {!l.enabled && <span className="badge">Disabled</span>}</span>
                    <span className="subtle">{l.courses.length} courses · {levelLessons(l).length} lessons</span>
                  </li>
                ))}
                <li className="list-item"><span className="grow">Challenges</span><span className="subtle">{draft.challenges.length}</span></li>
                <li className="list-item"><span className="grow">Resources</span><span className="subtle">{draft.resources.length}</span></li>
                <li className="list-item"><span className="grow">Career guides</span><span className="subtle">{draft.careerGuides.length}</span></li>
              </ul>
              <p className="subtle">{lessonCount} lessons in total.</p>
              <div className="row">
                <Link to="/admin/courses" className="btn btn-soft btn-sm">Manage courses</Link>
                <Link to="/admin/content" className="btn btn-ghost btn-sm">Content library</Link>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  )
}

/* ─── Analytics ────────────────────────────────────────────────────────── */

function BarList({ rows, label, total }: { rows: { key: string; label: string; value: number; swatch?: string }[]; label: string; total?: number }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <ul className="list" aria-label={label}>
      {rows.map((r) => (
        <li key={r.key} className="stack" style={{ '--gap': '4px', padding: '8px 0' } as CSSProperties} title={`${r.label}: ${r.value}`}>
          <span className="row-between small">
            <span className="row" style={{ '--gap': '8px', minWidth: 0 } as CSSProperties}>
              {r.swatch && <span aria-hidden style={{ width: 10, height: 10, borderRadius: 3, background: r.swatch, flexShrink: 0 }} />}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</span>
            </span>
            <strong>{r.value}{total ? <span className="subtle" style={{ fontWeight: 400 }}> · {Math.round((r.value / total) * 100)}%</span> : null}</strong>
          </span>
          <span aria-hidden style={{ height: 8, borderRadius: 4, background: 'var(--c-surface-3)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: `${(r.value / max) * 100}%`, background: 'var(--c-primary)', borderRadius: 4 }} />
          </span>
        </li>
      ))}
    </ul>
  )
}

function DailyChart({ events }: { events: ActivityEvent[] }) {
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const [hover, setHover] = useState<number | null>(null)
  const days = useMemo(() => {
    const out: { date: string; label: string; value: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * DAY)
      const key = d.toISOString().slice(0, 10)
      out.push({ date: key, label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), value: 0 })
    }
    for (const e of events) {
      if (e.type !== 'lesson_completed') continue
      const day = out.find((x) => x.date === e.createdAt.slice(0, 10))
      if (day) day.value++
    }
    return out
  }, [events])
  const max = Math.max(1, ...days.map((d) => d.value))
  const total = days.reduce((s, d) => s + d.value, 0)
  return (
    <section className="card" aria-labelledby="daily-h">
      <div className="row-between" style={{ marginBottom: 12 }}>
        <div>
          <h2 id="daily-h" style={{ fontSize: '1.1rem' }}>Lessons completed per day</h2>
          <span className="subtle">Last 30 days · {total} total</span>
        </div>
        <Tabs id="daily" label="Chart or table" value={view} onChange={setView} tabs={[{ value: 'chart', label: 'Chart' }, { value: 'table', label: 'Table' }]} />
      </div>
      {view === 'chart' ? (
        <div style={{ position: 'relative' }}>
          <div role="img" aria-label={`Bar chart of lessons completed per day over the last 30 days, ${total} in total. Switch to Table for exact values.`} style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', alignItems: 'end', gap: 2, height: 160, borderBottom: '1px solid var(--c-line-strong)' }}>
            {days.map((d, i) => (
              <div key={d.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ height: '100%', display: 'flex', alignItems: 'flex-end', cursor: 'default' }}>
                <div style={{ width: '100%', height: `${(d.value / max) * 100}%`, minHeight: d.value ? 3 : 0, background: hover === i ? 'var(--c-primary-text)' : 'var(--c-primary)', borderRadius: '4px 4px 0 0' }} />
              </div>
            ))}
          </div>
          {hover !== null && (
            <div className="card card-tight" style={{ position: 'absolute', top: -8, left: `min(${(hover / 30) * 100}%, calc(100% - 150px))`, padding: '6px 10px', pointerEvents: 'none', boxShadow: 'var(--shadow-2)' }}>
              <strong>{days[hover].value}</strong> <span className="subtle">on {days[hover].label}</span>
            </div>
          )}
          <div className="row-between subtle" style={{ marginTop: 6, fontSize: '0.78rem' }}>
            <span>{days[0].label}</span>
            <span>Today</span>
          </div>
        </div>
      ) : (
        <div className="table-wrap" style={{ maxHeight: 260, overflowY: 'auto' }}>
          <table className="table">
            <thead><tr><th scope="col">Date</th><th scope="col">Lessons completed</th></tr></thead>
            <tbody>
              {[...days].reverse().map((d) => <tr key={d.date}><td>{d.label}</td><td>{d.value}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export function AnalyticsPage() {
  const { draft } = useAdmin()
  const { data, error } = useAnalytics()
  if (error) return <p className="callout callout-warning">Couldn’t load analytics: {error}</p>
  if (!data) return <Spinner />
  const stats = computeStats(draft, data)
  const lessonTitles = new Map(draft.levels.flatMap((l) => levelLessons(l).map((r) => [r.lesson.id, `${r.lesson.title} (${l.name})`] as const)))
  const lessonCounts = new Map<string, number>()
  for (const l of data.learners) for (const id of Object.keys(l.state?.completedLessons ?? {})) lessonCounts.set(id, (lessonCounts.get(id) ?? 0) + 1)
  const topLessons = [...lessonCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([id, v]) => ({ key: id, label: lessonTitles.get(id) ?? id, value: v }))
  const challengeCounts = new Map<string, number>()
  for (const l of data.learners) for (const id of Object.keys(l.state?.completedChallenges ?? {})) challengeCounts.set(id, (challengeCounts.get(id) ?? 0) + 1)
  const topChallenges = [...challengeCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([id, v]) => ({ key: id, label: draft.challenges.find((c) => c.id === id)?.title ?? id, value: v }))

  return (
    <>
      <PageHeader title="Analytics" eyebrow="Overview">Where learners are, how far they get, and what they use.</PageHeader>
      {data.learners.length === 0 && data.events.length === 0 ? (
        <EmptyState icon="TrendingUp" title="No learner data yet">Analytics fill in as learners sign up and complete lessons.</EmptyState>
      ) : (
        <div className="stack" style={{ '--gap': 'var(--space-5)' } as CSSProperties}>
          <DailyChart events={data.events} />
          <div className="grid grid-2">
            <section className="card" aria-labelledby="lvl-h">
              <h2 id="lvl-h" style={{ fontSize: '1.1rem' }}>Learners by level</h2>
              <BarList label="Learners by level" total={stats.total} rows={draft.levels.map((l) => ({ key: l.id, label: l.name, value: stats.byLevel[l.id] ?? 0, swatch: l.color }))} />
            </section>
            <section className="card" aria-labelledby="funnel-h">
              <h2 id="funnel-h" style={{ fontSize: '1.1rem' }}>Where learners get to</h2>
              <p className="subtle">Learners who completed each module, per level. Big drops show where people get stuck.</p>
              {draft.levels.map((level) => {
                const learners = data.learners.filter((l) => l.level === level.id && l.state?.completedLessons)
                if (!learners.length) return null
                const rows = level.courses.flatMap((c) => c.modules).map((m) => ({
                  key: m.id,
                  label: m.title,
                  value: learners.filter((l) => m.lessons.length > 0 && m.lessons.every((x) => l.state.completedLessons[x.id])).length,
                }))
                return (
                  <details key={level.id} className="faq" open={level.id === 'beginner'} style={{ marginTop: 10 }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{level.name} ({learners.length} learners)</summary>
                    <BarList label={`${level.name} module completion`} rows={rows} total={learners.length} />
                  </details>
                )
              })}
            </section>
            <section className="card" aria-labelledby="top-l">
              <h2 id="top-l" style={{ fontSize: '1.1rem' }}>Most completed lessons</h2>
              {topLessons.length ? <BarList label="Most completed lessons" rows={topLessons} /> : <p className="muted small">No completions yet.</p>}
            </section>
            <section className="card" aria-labelledby="top-c">
              <h2 id="top-c" style={{ fontSize: '1.1rem' }}>Most attempted challenges</h2>
              {topChallenges.length ? <BarList label="Most attempted challenges" rows={topChallenges} /> : <p className="muted small">No submissions yet.</p>}
            </section>
          </div>
          <div className="grid grid-4">
            <StatCard icon={<BookOpen size={17} />} label="Lessons completed (30 days)" value={stats.lessons30} />
            <StatCard icon={<TrendingUp size={17} />} label="Course completion rate" value={`${Math.round(stats.completionRate * 100)}%`} hint="Completed courses ÷ courses in each learner’s level" />
            <StatCard icon={<MessagesSquare size={17} />} label="1:1 booking clicks (30 days)" value={stats.bookings30} />
            <StatCard icon={<Target size={17} />} label="Challenge submissions" value={stats.submissions} />
          </div>
        </div>
      )}
    </>
  )
}
