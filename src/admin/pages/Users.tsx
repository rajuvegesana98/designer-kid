import { Ban, Download, ExternalLink, Mail, RotateCcw, Search, ShieldCheck, UserCheck } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router'
import { ConfirmDialog, EmptyState, formatDate, Modal, PageHeader, ProgressBar, Spinner, Tabs, timeAgo } from '../../components/ui'
import { useAuth } from '../../state/auth'
import { useToast } from '../../state/ui'
import type { LevelId } from '../../content/types'
import { store, type LearnerRow } from '../../data'
import { levelProgress } from '../../lib/progress'
import { useAdmin } from '../state'
import { useAnalytics } from './Dashboard'

type Tab = 'learners' | 'submissions'
type Sort = 'recent' | 'progress' | 'name' | 'joined'

export function UsersPage() {
  const { draft } = useAdmin()
  const { data, error, reload } = useAnalytics()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'learners'
  const [q, setQ] = useState('')
  const [level, setLevel] = useState<LevelId | 'any'>('any')
  const [activity, setActivity] = useState<'any' | 'active' | 'inactive' | 'suspended' | 'admins'>('any')
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
        const actOk = activity === 'any' ? true : activity === 'suspended' ? l.blocked : activity === 'admins' ? l.isAdmin : (activity === 'active') === active
        return text.includes(q.toLowerCase()) && (level === 'any' || l.level === level) && actOk
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
                <option value="suspended">Suspended</option>
                <option value="admins">Admins</option>
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
                            <strong style={{ display: 'block' }}>{l.name || '—'} {l.isAdmin && <span className="badge badge-primary">Admin</span>} {l.blocked && <span className="badge badge-danger">Suspended</span>}</strong>
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
        {open && (
          <LearnerDetail
            learner={open}
            bookings={bookingByUser.get(open.name) ?? 0}
            onChanged={(patch) => {
              setOpen((o) => (o ? { ...o, ...patch } : o))
              reload()
            }}
          />
        )}
      </Modal>
    </>
  )
}

function LearnerDetail({ learner, bookings, onChanged }: { learner: LearnerRow; bookings: number; onChanged: (patch: Partial<LearnerRow>) => void }) {
  const { draft } = useAdmin()
  const { user } = useAuth()
  const toast = useToast()
  const [name, setName] = useState(learner.name)
  const [confirm, setConfirm] = useState<null | 'reset' | 'suspend' | 'admin'>(null)
  const [busy, setBusy] = useState(false)
  const run = async (fn: () => Promise<void>, msg: string, patch: Partial<LearnerRow> = {}) => {
    setBusy(true)
    try {
      await fn()
      toast(msg)
      onChanged(patch)
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Action failed', 'error')
    } finally {
      setBusy(false)
      setConfirm(null)
    }
  }
  const isSelf = user?.id === learner.id
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
      <section className="card card-flat stack" aria-label="Manage learner">
        <strong>Manage</strong>
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor="learner-name">Name</label>
            <div className="row" style={{ flexWrap: 'nowrap' }}>
              <input id="learner-name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
              <button className="btn btn-sm" disabled={busy || name.trim() === learner.name} onClick={() => run(() => store.updateLearnerProfile(learner.id, { name: name.trim() }), 'Name updated', { name: name.trim() })}>Save</button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="learner-level">Level</label>
            <select id="learner-level" className="select" value={learner.level ?? ''} disabled={busy} onChange={(e) => run(() => store.updateLearnerProfile(learner.id, { level: (e.target.value || null) as LevelId | null }), 'Level updated', { level: (e.target.value || null) as LevelId | null })}>
              <option value="">Not chosen</option>
              {draft.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        </div>
        <div className="row">
          {store.mode === 'supabase' && learner.email.includes('@') && (
            <button className="btn btn-sm" disabled={busy} onClick={() => run(() => store.requestPasswordReset(learner.email), `Password reset email sent to ${learner.email}`)}>
              <Mail size={15} aria-hidden /> Send password reset
            </button>
          )}
          <button className="btn btn-sm" disabled={busy} onClick={() => setConfirm('reset')}><RotateCcw size={15} aria-hidden /> Reset progress</button>
          {!isSelf && (
            <button className="btn btn-sm" disabled={busy} onClick={() => setConfirm('suspend')} style={{ color: learner.blocked ? undefined : 'var(--c-danger)' }}>
              {learner.blocked ? <><UserCheck size={15} aria-hidden /> Restore account</> : <><Ban size={15} aria-hidden /> Suspend account</>}
            </button>
          )}
          {store.mode === 'supabase' && !isSelf && (
            <button className="btn btn-sm" disabled={busy} onClick={() => setConfirm('admin')}>
              <ShieldCheck size={15} aria-hidden /> {learner.isAdmin ? 'Remove admin' : 'Make admin'}
            </button>
          )}
        </div>
        {store.mode === 'supabase' && (
          <p className="subtle">To permanently delete an account and its login, use Supabase → Authentication → Users. Suspending keeps their data but blocks sign-in.</p>
        )}
      </section>
      <ConfirmDialog
        open={!!confirm}
        danger={confirm !== 'admin' || learner.isAdmin}
        title={confirm === 'reset' ? 'Reset this learner’s progress?' : confirm === 'suspend' ? (learner.blocked ? 'Restore this account?' : 'Suspend this account?') : learner.isAdmin ? 'Remove admin access?' : 'Give admin access?'}
        body={
          confirm === 'reset'
            ? 'Completed lessons, challenges, checklists, notes and bookmarks will be cleared. This can’t be undone.'
            : confirm === 'suspend'
              ? learner.blocked
                ? 'They’ll be able to sign in and learn again.'
                : 'They’ll be signed out and unable to sign in, write reviews or submit challenges. Their data is kept.'
              : learner.isAdmin
                ? 'They will no longer be able to open the admin dashboard.'
                : 'They will be able to edit and publish everything on Designer Kid. Only do this for people you trust.'
        }
        confirmLabel={confirm === 'reset' ? 'Reset progress' : confirm === 'suspend' ? (learner.blocked ? 'Restore' : 'Suspend') : learner.isAdmin ? 'Remove admin' : 'Make admin'}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm === 'reset') void run(() => store.resetLearnerProgress(learner.id), 'Progress reset')
          else if (confirm === 'suspend') void run(() => store.updateLearnerProfile(learner.id, { blocked: !learner.blocked }), learner.blocked ? 'Account restored' : 'Account suspended', { blocked: !learner.blocked })
          else void run(() => store.setAdmin(learner.id, !learner.isAdmin), learner.isAdmin ? 'Admin access removed' : 'Admin access granted', { isAdmin: !learner.isAdmin })
        }}
      />
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
