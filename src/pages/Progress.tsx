import { motion } from 'motion/react'
import { Lock } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router'
import { BookmarkButton } from '../components/BookmarkButton'
import { EmptyState, formatDate, LevelBadge, PageHeader, ProgressBar, ProgressRing, Tabs, timeAgo } from '../components/ui'
import type { BookmarkKind } from '../data'
import { CAREER_SECTIONS, findLesson, getLevel, levelModules } from '../lib/content'
import { Icon } from '../lib/icons'
import { achievementUnlocked, careerSectionProgress, levelProgress, longestStreak, moduleProgress, streak } from '../lib/progress'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'

type Tab = 'overview' | 'achievements' | 'bookmarks' | 'notes'

export function ProgressPage() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'overview'
  return (
    <div className="page">
      <PageHeader eyebrow="My Progress" title="How you’re doing">
        Your progress, achievements, bookmarks and private notes in one place.
      </PageHeader>
      <Tabs<Tab>
        id="progress"
        label="Progress sections"
        value={tab}
        onChange={(v) => setParams(v === 'overview' ? {} : { tab: v }, { replace: true })}
        tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'achievements', label: 'Achievements' },
          { value: 'bookmarks', label: 'My Bookmarks' },
          { value: 'notes', label: 'My Notes' },
        ]}
      />
      <div id="progress-panel" role="tabpanel" aria-labelledby={`progress-tab-${tab}`} style={{ marginTop: 'var(--space-5)' }}>
        {tab === 'overview' && <Overview />}
        {tab === 'achievements' && <Achievements />}
        {tab === 'bookmarks' && <Bookmarks />}
        {tab === 'notes' && <Notes />}
      </div>
    </div>
  )
}

function Overview() {
  const { content } = useContent()
  const { state } = useLearner()
  const level = getLevel(content, state.level)
  if (!level)
    return <EmptyState icon="Compass" title="Choose a level to start tracking" action={<Link className="btn btn-primary" to="/start">Choose your level</Link>} />
  const p = levelProgress(level, state)
  const cur = streak(state)
  const best = longestStreak(state)
  return (
    <div className="stack" style={{ '--gap': 'var(--space-5)', '--c-level': level.color } as CSSProperties}>
      <div className="card row" style={{ gap: 'var(--space-6)' }}>
        <ProgressRing value={p.pct} size={132} label="Overall progress">
          <strong>{Math.round(p.pct * 100)}%</strong>
          <span className="subtle">{level.name}</span>
        </ProgressRing>
        <div className="grid grid-4 grow">
          {[
            ['Lessons', `${p.done}/${p.total}`],
            ['Courses', `${p.coursesDone}/${p.coursesTotal}`],
            ['Projects', `${p.projectsDone}/${p.projectsTotal}`],
            ['Challenges', `${Object.keys(state.completedChallenges).length}`],
            ['Current streak', `${cur} day${cur === 1 ? '' : 's'}`],
            ['Best streak', `${best} day${best === 1 ? '' : 's'}`],
          ].map(([label, value]) => (
            <div key={label} className="stat">
              <span className="stat-value" style={{ fontSize: '1.45rem' }}>{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <StreakCalendar days={state.activeDays} />

      <section className="card" aria-labelledby="modules-h">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <h2 id="modules-h" style={{ fontSize: '1.2rem' }}>Module progress</h2>
          <LevelBadge level={level} />
        </div>
        <ul className="list">
          {levelModules(level).map((m) => {
            const mp = moduleProgress(m, state)
            return (
              <li key={m.id} className="list-item" style={{ flexWrap: 'wrap' }}>
                <Link to={`/learn/${level.id}/${m.id}`} className="grow" style={{ fontWeight: 600, color: 'inherit', minWidth: 180 }}>{m.title}</Link>
                <div style={{ width: 'min(260px, 100%)' }}>
                  <ProgressBar value={mp.pct} label={`${m.title} progress`} thin />
                </div>
                <span className="subtle nowrap" style={{ width: 70, textAlign: 'right' }}>{mp.done}/{mp.total}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="card" aria-labelledby="career-h">
        <h2 id="career-h" style={{ fontSize: '1.2rem', marginBottom: 12 }}>Career readiness</h2>
        <div className="grid grid-3">
          {CAREER_SECTIONS.map((s) => {
            const cp = careerSectionProgress(content, s.id, state)
            return (
              <Link key={s.id} to={`/career/${s.id}`} className="stack" style={{ '--gap': '6px', color: 'inherit', textDecoration: 'none' } as CSSProperties}>
                <span className="row-between small" style={{ fontWeight: 600 }}>
                  <span className="row" style={{ '--gap': '6px' } as CSSProperties}><Icon name={s.icon} size={16} /> {s.title}</span>
                  <span className="subtle">{cp.done}/{cp.total}</span>
                </span>
                <ProgressBar value={cp.pct} label={`${s.title} progress`} thin />
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function StreakCalendar({ days }: { days: string[] }) {
  const set = new Set(days)
  const cells: { d: string; on: boolean }[] = []
  const now = new Date()
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    cells.push({ d: key, on: set.has(key) })
  }
  const active = cells.filter((c) => c.on).length
  return (
    <section className="card" aria-labelledby="activity-h">
      <div className="row-between" style={{ marginBottom: 12 }}>
        <h2 id="activity-h" style={{ fontSize: '1.2rem' }}>Learning activity</h2>
        <span className="subtle">{active} active day{active === 1 ? '' : 's'} in the last 12 weeks</span>
      </div>
      <div role="img" aria-label={`${active} active days in the last 12 weeks`} style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoFlow: 'row', gap: 4 }}>
        {Array.from({ length: 12 }, (_, w) => (
          <div key={w} style={{ display: 'grid', gap: 4 }}>
            {cells.slice(w * 7, w * 7 + 7).map((c) => (
              <span key={c.d} title={c.d} style={{ aspectRatio: '1', borderRadius: 4, maxHeight: 18, background: c.on ? 'var(--c-level)' : 'var(--c-surface-3)' }} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function Achievements() {
  const { content } = useContent()
  const { state } = useLearner()
  const list = content.achievements.map((a) => ({ a, unlocked: achievementUnlocked(a, content, state) }))
  const count = list.filter((x) => x.unlocked).length
  return (
    <>
      <p className="muted" style={{ marginBottom: 'var(--space-4)' }}>{count} of {list.length} unlocked. Each one marks a real milestone in your learning.</p>
      <div className="grid grid-3">
        {list.map(({ a, unlocked }, i) => (
          <motion.div
            key={a.id}
            className="card row"
            style={{ flexWrap: 'nowrap', opacity: unlocked ? 1 : 0.72, background: unlocked ? undefined : 'var(--c-surface-2)', boxShadow: unlocked ? undefined : 'none' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: unlocked ? 1 : 0.72, y: 0, transition: { delay: i * 0.03 } }}
          >
            <span className="icon-tile" style={{ width: 52, height: 52, '--tile': unlocked ? 'var(--c-secondary)' : 'var(--c-text-3)' } as CSSProperties}>
              {unlocked ? <Icon name={a.icon} size={24} /> : <Lock size={20} aria-hidden />}
            </span>
            <div>
              <strong style={{ display: 'block' }}>{a.title}</strong>
              <span className="small muted">{a.description}</span>
              <span className="sr-only">{unlocked ? '(unlocked)' : '(locked)'}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

function useBookmarkItems() {
  const { content } = useContent()
  const { state } = useLearner()
  return state.bookmarks
    .map((b) => {
      const base = { kind: b.kind, id: b.id, at: b.at }
      if (b.kind === 'lesson') {
        const r = findLesson(content, b.id)
        return r && { ...base, title: r.lesson.title, sub: `${r.level.name} · ${r.module.title}`, to: `/lesson/${b.id}`, external: false }
      }
      if (b.kind === 'challenge') {
        const c = content.challenges.find((x) => x.id === b.id)
        return c && { ...base, title: c.title, sub: `${c.category} challenge`, to: `/challenges/${b.id}`, external: false }
      }
      if (b.kind === 'resource') {
        const r = content.resources.find((x) => x.id === b.id)
        return r && { ...base, title: r.title, sub: `${r.type} resource`, to: r.url, external: true }
      }
      const g = content.careerGuides.find((x) => x.id === b.id)
      return g && { ...base, title: g.title, sub: `Career guide`, to: `/career/${g.section}#${g.id}`, external: false }
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
}

const KIND_LABEL: Record<BookmarkKind, string> = { lesson: 'Lessons', challenge: 'Challenges', resource: 'Resources', guide: 'Career guides' }
const KIND_ICON: Record<BookmarkKind, string> = { lesson: 'BookOpen', challenge: 'Target', resource: 'Bookmark', guide: 'Briefcase' }

function Bookmarks() {
  const items = useBookmarkItems()
  if (!items.length)
    return (
      <EmptyState icon="Bookmark" title="No bookmarks yet" action={<Link to="/learn" className="btn btn-primary">Browse lessons</Link>}>
        Use the bookmark button on any lesson, challenge, resource or career guide to save it here.
      </EmptyState>
    )
  return (
    <div className="stack" style={{ '--gap': 'var(--space-5)' } as CSSProperties}>
      {(Object.keys(KIND_LABEL) as BookmarkKind[]).map((kind) => {
        const group = items.filter((i) => i.kind === kind)
        if (!group.length) return null
        return (
          <section key={kind} aria-labelledby={`bm-${kind}`}>
            <h2 id={`bm-${kind}`} style={{ fontSize: '1.1rem', marginBottom: 10 }}>{KIND_LABEL[kind]} <span className="subtle">({group.length})</span></h2>
            <div className="stack" style={{ '--gap': '8px' } as CSSProperties}>
              {group.map((i) => (
                <div key={i.id} className="card card-tight row" style={{ flexWrap: 'nowrap' }}>
                  <span className="icon-tile icon-tile-sm"><Icon name={KIND_ICON[kind]} size={16} /></span>
                  <span className="grow">
                    {i.external ? (
                      <a href={i.to} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: 'inherit' }}>{i.title}</a>
                    ) : (
                      <Link to={i.to} style={{ fontWeight: 600, color: 'inherit' }}>{i.title}</Link>
                    )}
                    <span className="subtle" style={{ display: 'block' }}>{i.sub} · saved {timeAgo(i.at)}</span>
                  </span>
                  <BookmarkButton kind={kind} id={i.id} title={i.title} compact />
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function Notes() {
  const { content } = useContent()
  const { state } = useLearner()
  const notes = Object.entries(state.notes)
    .map(([lessonId, n]) => ({ lessonId, ...n, ref: findLesson(content, lessonId) }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  if (!notes.length)
    return (
      <EmptyState icon="StickyNote" title="No notes yet">
        Open any lesson and use “My notes” to jot down what you want to remember. Notes are private to you.
      </EmptyState>
    )
  return (
    <div className="grid grid-2">
      {notes.map((n) => (
        <article key={n.lessonId} className="card stack" style={{ '--gap': '8px' } as CSSProperties}>
          <div className="row-between">
            <Link to={`/lesson/${n.lessonId}`} style={{ fontWeight: 700, color: 'inherit' }}>{n.ref?.lesson.title ?? 'Lesson no longer available'}</Link>
            <span className="subtle">{formatDate(n.updatedAt)}</span>
          </div>
          {n.ref && <span className="subtle">{n.ref.level.name} · {n.ref.module.title}</span>}
          <p style={{ whiteSpace: 'pre-wrap' }}>{n.text}</p>
        </article>
      ))}
    </div>
  )
}
