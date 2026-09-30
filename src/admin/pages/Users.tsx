import { Download, ExternalLink, Search } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router'
import { EmptyState, formatDate, Modal, PageHeader, ProgressBar, Spinner, Tabs, timeAgo } from '../../components/ui'
import type { LevelId } from '../../content/types'
import { store, type LearnerRow } from '../../data'
import { levelProgress } from '../../lib/progress'
import { useAdmin } from '../state'
import { useAnalytics } from './Dashboard'

type Tab = 'learners' | 'submissions'
type Sort = 'recent' | 'progress' | 'name' | 'joined'

export function UsersPage() {
  const { draft } = useAdmin()
  const { data, error } = useAnalytics()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'learners'
  const [q, setQ] = useState('')
  const [level, setLevel] = useState<LevelId | 'any'>('any')
  const [activity, setActivity] = useState<'any' | 'active' | 'inactive'>('any')
  const [sort, setSort] = useState<Sort>('recent')
  const [open, setOpen] = useState<LearnerRow | null>(null)

  const bookingByUser = useMemo(() => {
    const m = new Map<string, number>()
    for (const e of data?.events ?? []) if (e.type === 'booking_clicked') m.set(e.userName, (m.get(e.userName) ?? 0) + 1)
    return m
  }, [data])

  const rows = useMemo(() => {
    if (!data) return []
    const now = Date.now()
    return data.learners
      .map((l) => {
        const lv = draft.levels.find((x) => x.id === l.level)
        const p = lv && l.state?.completedLessons ? levelProgress(lv, l.state) : null
        return { l, p, lv, active: now - new Date(l.lastActiveAt).getTime() < 7 * 86_400_000 }
      })
      .filter(({ l, active }) => {
        const text = `${l.name} ${l.email}`.toLowerCase()
        return text.includes(q.toLowerCase()) && (level === 'any' || l.level === level) && (activity === 'any' || (activity === 'active') === active)
      })
      .sort((a, b) =>
        sort === 'name' ? a.l.name.localeCompare(b.l.name) : sort === 'progress' ? (b.p?.pct ?? 0) - (a.p?.pct ?? 0) : sort === 'joined' ? b.l.createdAt.localeCompare(a.l.createdAt) : b.l.lastActiveAt.localeCompare(a.l.lastActiveAt),
      )
  }, [data, draft, q, level, activity, sort])

  const exportCsv = () => {
    const header = ['Name', 'Email', 'Level', 'Progress %', 'Lessons', 'Projects', 'Challenges', 'Registered', 'Last active']
    const lines = rows.map(({ l, p, lv }) => [l.name, l.email, lv?.name ?? '', p ? Math.round(p.pct * 100) : 0, p?.done ?? 0, p?.projectsDone ?? 0, Object.keys(l.state?.completedChallenges ?? {}).length, l.createdAt.slice(0, 10), l.lastActiveAt.slice(0, 10)])
    const csv = [header, ...lines].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `designer-kid-learners-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <>
      <PageHeader title="Users" eyebrow="People" actions={tab === 'learners' && rows.length > 0 && <button className="btn" onClick={exportCsv}><Download size={16} aria-hidden /> Export CSV</button>}>
        {store.mode === 'local' ? 'Browser-only mode shows just the learner in this browser. Connect Supabase to see everyone who signs up.' : 'Everyone with a Designer Kid account.'}
      </PageHeader>
      <Tabs<Tab> id="users" label="Users view" value={tab} onChange={(v) => setParams({ tab: v }, { replace: true })} tabs={[{ value: 'learners', label: 'Learners' }, { value: 'submissions', label: `Challenge submissions${data ? ` (${data.submissions.length})` : ''}` }]} />
      <div id="users-panel" role="tabpanel" style={{ marginTop: 'var(--space-5)' }}>
        {error && <p className="callout callout-warning">{error}</p>}
        {!data ? (
          !error && <Spinner />
        ) : tab === 'learners' ? (
          <>
            <div className="row" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="row grow" style={{ flexWrap: 'nowrap', minWidth: 220, '--gap': '6px' } as CSSProperties}>
                <Search size={16} aria-hidden className="subtle" />
                <input className="input" aria-label="Search by name or email" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <select className="select" style={{ width: 'auto' }} aria-label="Filter by level" value={level} onChange={(e) => setLevel(e.target.value as LevelId | 'any')}>
                <option value="any">All levels</option>
                {draft.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
              <select className="select" style={{ width: 'auto' }} aria-label="Filter by activity" value={activity} onChange={(e) => setActivity(e.target.value as typeof activity)}>
                <option value="any">Any activity</option>
                <option value="active">Active (7 days)</option>
                <option value="inactive">Inactive</option>
              </select>
              <select className="select" style={{ width: 'auto' }} aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="recent">Recently active</option>
                <option value="joined">Newest</option>
                <option value="progress">Most progress</option>
                <option value="name">Name</option>
              </select>
            </div>
            {rows.length === 0 ? (
              <EmptyState icon="Users" title="No learners found">{data.learners.length ? 'Try clearing the filters.' : 'Learners appear here after they create an account.'}</EmptyState>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <caption className="sr-only">Learners</caption>
                  <thead>
                    <tr>
                      <th scope="col">Learner</th>
                      <th scope="col">Level</th>
                      <th scope="col">Progress</th>
                      <th scope="col">Lessons</th>
                      <th scope="col">Projects</th>
                      <th scope="col">Challenges</th>
                      <th scope="col">1:1 clicks</th>
                      <th scope="col">Registered</th>
                      <th scope="col">Last active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ l, p, lv, active }) => (
                      <tr key={l.id}>
                        <td>
                          <button className="btn btn-ghost btn-sm" style={{ padding: 0, height: 'auto', minHeight: 0, textAlign: 'left', display: 'block' }} onClick={() => setOpen(l)}>
                            <strong style={{ display: 'block' }}>{l.name || '—'}</strong>
                            <span className="subtle" style={{ fontWeight: 400 }}>{l.email}</span>
                          </button>
                        </td>
                        <td>{lv?.name ?? '—'}</td>
                        <td style={{ minWidth: 120 }}>
                          <ProgressBar value={p?.pct ?? 0} label={`${l.name} progress`} thin />
                          <span className="subtle">{Math.round((p?.pct ?? 0) * 100)}%</span>
                        </td>
                        <td>{p?.done ?? 0}</td>
                        <td>{p?.projectsDone ?? 0}</td>
                        <td>{Object.keys(l.state?.completedChallenges ?? {}).length}</td>
                        <td>{bookingByUser.get(l.name) ?? 0}</td>
                        <td className="nowrap">{formatDate(l.createdAt)}</td>
                        <td className="nowrap">{active ? <span className="badge badge-success">{timeAgo(l.lastActiveAt)}</span> : timeAgo(l.lastActiveAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : data.submissions.length === 0 ? (
          <EmptyState icon="Target" title="No submissions yet">{store.mode === 'local' ? 'Submissions are sent to you once Supabase is connected and students are signed in.' : 'Signed-in students’ challenge submissions appear here.'}</EmptyState>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th scope="col">Student</th><th scope="col">Challenge</th><th scope="col">Work</th><th scope="col">Notes</th><th scope="col">Submitted</th></tr></thead>
              <tbody>
                {data.submissions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.userName}</td>
                    <td>{draft.challenges.find((c) => c.id === s.challengeId)?.title ?? s.challengeId}</td>
                    <td>{/^https?:\/\//.test(s.link) ? <a href={s.link} target="_blank" rel="noreferrer">Open <ExternalLink size={13} aria-hidden /></a> : '—'}</td>
                    <td style={{ maxWidth: 360 }}><span className="clamp-2" style={{ display: '-webkit-box' }}>{s.notes || '—'}</span></td>
                    <td className="nowrap">{formatDate(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name || 'Learner'} description={open?.email} wide>
        {open && <LearnerDetail learner={open} bookings={bookingByUser.get(open.name) ?? 0} />}
      </Modal>
    </>
  )
}

function LearnerDetail({ learner, bookings }: { learner: LearnerRow; bookings: number }) {
  const { draft } = useAdmin()
  const s = learner.state
  const lv = draft.levels.find((l) => l.id === learner.level)
  const p = lv && s?.completedLessons ? levelProgress(lv, s) : null
  return (
    <div className="stack">
      <div className="grid grid-4">
        {[
          ['Level', lv?.name ?? '—'],
          ['Progress', `${Math.round((p?.pct ?? 0) * 100)}%`],
          ['Lessons', String(p?.done ?? 0)],
          ['Projects', String(p?.projectsDone ?? 0)],
          ['Challenges', String(Object.keys(s?.completedChallenges ?? {}).length)],
          ['1:1 clicks', String(bookings)],
          ['Registered', formatDate(learner.createdAt)],
          ['Last active', timeAgo(learner.lastActiveAt)],
        ].map(([k, v]) => (
          <div key={k} className="stat">
            <span className="stat-value" style={{ fontSize: '1.2rem' }}>{v}</span>
            <span className="stat-label">{k}</span>
          </div>
        ))}
      </div>
      {lv && (
        <div>
          <strong className="small">Modules</strong>
          <ul className="list">
            {lv.courses.flatMap((c) => c.modules).map((m) => {
              const done = m.lessons.filter((x) => s.completedLessons[x.id]).length
              return (
                <li key={m.id} className="list-item small">
                  <span className="grow">{m.title}</span>
                  <span style={{ width: 120 }}><ProgressBar value={m.lessons.length ? done / m.lessons.length : 0} label={m.title} thin /></span>
                  <span className="subtle">{done}/{m.lessons.length}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
