import { motion } from 'motion/react'
import { ArrowRight, BookOpen, Check, Clock, Flame, Layers, PartyPopper, Target, Trophy } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { LevelSwitcher } from '../components/LevelSwitcher'
import { MentorLink, useMentor } from '../components/MentorLink'
import { formatMinutes, LevelBadge, ProgressBar, ProgressRing, Reveal } from '../components/ui'
import { CAREER_SECTIONS, getLevel, levelLessons, levelModules } from '../lib/content'
import { Icon } from '../lib/icons'
import { achievementUnlocked, careerSectionProgress, levelProgress, moduleProgress, nextLesson, streak } from '../lib/progress'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { Landing } from './Landing'
import { AppShell } from '../components/AppShell'

export function Home() {
  const { state } = useLearner()
  const { content } = useContent()
  return getLevel(content, state.level) ? (
    <AppShell>
      <Dashboard />
    </AppShell>
  ) : (
    <Landing />
  )
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export function Dashboard() {
  const { content } = useContent()
  const { state } = useLearner()
  const mentor = useMentor()
  const [switchOpen, setSwitchOpen] = useState(false)
  const level = getLevel(content, state.level)!
  const progress = levelProgress(level, state)
  const next = nextLesson(level, state)
  const modules = levelModules(level)
  const days = streak(state)
  const achievements = content.achievements.filter((a) => achievementUnlocked(a, content, state))
  const returning = Object.keys(state.completedLessons).length > 0 || !!state.lastLesson
  const upcoming = useMemo(() => {
    const lessons = levelLessons(level)
    const start = next ? lessons.findIndex((r) => r.lesson.id === next.lesson.id) + 1 : 0
    return lessons.slice(start).filter((r) => !state.completedLessons[r.lesson.id]).slice(0, 3)
  }, [level, next, state.completedLessons])
  const challenge = content.challenges.find((c) => c.level === level.id && !state.completedChallenges[c.id])
  const careerFirst = level.id === 'beginner' && progress.modulesDone < 4
  const nextModuleProgress = next ? moduleProgress(next.module, state) : null
  const announcements = content.announcements.filter((a) => a.important && (a.levels.includes('all') || a.levels.includes(level.id))).slice(0, 2)

  return (
    <div className="page" style={{ '--c-level': level.color } as CSSProperties}>
      <header className="row-between" style={{ marginBottom: 'var(--space-5)', alignItems: 'flex-end' }}>
        <div className="stack" style={{ '--gap': '8px' } as CSSProperties}>
          <span className="muted">{greeting()}</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 1.3rem + 1.8vw, 2.6rem)' }}>
            {returning ? 'Welcome back' : 'Welcome'}
            {state.name ? `, ${state.name}` : ''}
          </h1>
          <div className="row" style={{ '--gap': '8px' } as CSSProperties}>
            <span className="muted">Your level:</span>
            <LevelBadge level={level} />
            <button className="btn btn-ghost btn-sm" onClick={() => setSwitchOpen(true)}>Switch</button>
          </div>
        </div>
      </header>

      {announcements.map((a) => (
        <div key={a.id} className="callout" style={{ marginBottom: 'var(--space-4)' }} role="status">
          <Icon name="Sparkles" size={20} />
          <div>
            <strong className="callout-title">{a.title}</strong>
            <p>{a.body}</p>
          </div>
        </div>
      ))}

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'var(--space-5)' }}>
        {/* Continue learning — the single most important action on the page. */}
        <section aria-labelledby="continue-title" style={{ gridColumn: '1 / -1' }}>
          {next ? (
            <motion.div className="card tinted frame" style={{ padding: 'var(--space-6)', marginTop: 12 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <span className="frame-handles" />
              <span className="frame-label">{returning ? 'Continue learning' : 'Start here'}</span>
              <div className="row" style={{ gap: 'var(--space-5)', alignItems: 'center' }}>
                <div className="grow stack" style={{ '--gap': '10px', minWidth: 260 } as CSSProperties}>
                  <span className="eyebrow">{next.module.title} · Lesson {next.module.lessons.findIndex((l) => l.id === next.lesson.id) + 1} of {next.module.lessons.length}</span>
                  <h2 id="continue-title" style={{ fontSize: 'clamp(1.5rem, 1.2rem + 1.2vw, 2.1rem)' }}>{next.lesson.title}</h2>
                  <p className="muted" style={{ maxWidth: 620 }}>{next.lesson.summary}</p>
                  <div className="meta">
                    <span><Clock size={15} aria-hidden /> {formatMinutes(next.lesson.minutes)}</span>
                    <span>{next.lesson.difficulty}</span>
                    {nextModuleProgress && <span>{nextModuleProgress.done}/{nextModuleProgress.total} done in this module</span>}
                  </div>
                </div>
                <Link to={`/lesson/${next.lesson.id}`} className="btn btn-primary btn-lg">
                  {returning ? 'Continue lesson' : 'Start first lesson'} <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="card tinted row" style={{ padding: 'var(--space-6)', gap: 'var(--space-5)' }}>
              <span className="icon-tile" style={{ width: 56, height: 56 }}><PartyPopper size={26} aria-hidden /></span>
              <div className="grow">
                <h2 id="continue-title">You’ve completed every lesson in {level.name}</h2>
                <p className="muted">Take on a challenge, polish your career materials, or explore the next level.</p>
              </div>
              <div className="row">
                <Link to="/career" className="btn btn-primary">Open Career Centre</Link>
                <button className="btn" onClick={() => setSwitchOpen(true)}>Explore another level</button>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="progress-title" className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="row-between" style={{ marginBottom: 'var(--space-4)' }}>
            <h2 id="progress-title" style={{ fontSize: '1.2rem' }}>Your progress</h2>
            <Link to="/progress" className="btn btn-ghost btn-sm">View details <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <div className="row" style={{ gap: 'var(--space-6)', alignItems: 'center' }}>
            <ProgressRing value={progress.pct} label={`${level.name} overall progress`}>
              <strong>{Math.round(progress.pct * 100)}%</strong>
              <span className="subtle">overall</span>
            </ProgressRing>
            <div className="grid grow" style={{ '--gap': '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' } as CSSProperties}>
              <Stat icon={<BookOpen size={18} />} value={`${progress.done}/${progress.total}`} label="Lessons completed" />
              <Stat icon={<Layers size={18} />} value={`${progress.modulesDone}/${progress.modulesTotal}`} label="Modules completed" />
              <Stat icon={<Target size={18} />} value={`${progress.projectsDone}/${progress.projectsTotal}`} label="Projects completed" />
              <Stat icon={<Flame size={18} />} value={`${days} day${days === 1 ? '' : 's'}`} label="Current streak" />
              <Stat icon={<Trophy size={18} />} value={`${achievements.length}/${content.achievements.length}`} label="Achievements" />
            </div>
          </div>
        </section>

        <section aria-labelledby="roadmap-title" className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="row-between" style={{ marginBottom: 'var(--space-3)' }}>
            <h2 id="roadmap-title" style={{ fontSize: '1.2rem' }}>Your roadmap</h2>
            <Link to="/learn" className="btn btn-ghost btn-sm">Full roadmap <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <ol className="pathline" aria-label={`${level.name} roadmap`} style={{ listStyle: 'none', margin: 0 }}>
            {modules.map((m, i) => {
              const p = moduleProgress(m, state)
              const current = next?.module.id === m.id
              return (
                <li key={m.id} className="row" style={{ '--gap': '6px', flexWrap: 'nowrap' } as CSSProperties}>
                  {i > 0 && <span className="pathline-sep" aria-hidden>→</span>}
                  <Link to={`/learn/${level.id}/${m.id}`} className={`pathline-step ${p.complete ? 'done' : current ? 'current' : ''}`} aria-current={current ? 'step' : undefined}>
                    {p.complete ? <Check size={14} aria-hidden /> : null}
                    {m.stage}
                    <span className="sr-only">{p.complete ? '(complete)' : current ? '(current)' : ''}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </section>

        {upcoming.length > 0 && (
          <Reveal>
            <section aria-labelledby="upnext-title" className="card" style={{ height: '100%' }}>
              <h2 id="upnext-title" style={{ fontSize: '1.2rem', marginBottom: 'var(--space-3)' }}>Up next</h2>
              <ul className="list">
                {upcoming.map((r) => {
                  return (
                    <li key={r.lesson.id} className="list-item">
                      <span className="icon-tile icon-tile-sm" aria-hidden><BookOpen size={16} /></span>
                      <span className="grow">
                        <Link to={`/lesson/${r.lesson.id}`} style={{ fontWeight: 600, color: 'inherit', textDecoration: 'none' }}>{r.lesson.title}</Link>
                        <span className="subtle" style={{ display: 'block' }}>{r.module.title} · {formatMinutes(r.lesson.minutes)}</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
          </Reveal>
        )}

        {challenge && (
          <Reveal delay={0.05}>
            <section aria-labelledby="challenge-title" className="card stack" style={{ height: '100%', '--gap': '10px' } as CSSProperties}>
              <span className="eyebrow">Practise · {challenge.category} challenge</span>
              <h2 id="challenge-title" style={{ fontSize: '1.2rem' }}>{challenge.title}</h2>
              <p className="muted clamp-2">{challenge.brief}</p>
              <div className="meta">
                <span><Clock size={15} aria-hidden /> {formatMinutes(challenge.minutes)}</span>
                <span>{challenge.difficulty}</span>
              </div>
              <div className="row" style={{ marginTop: 'auto' }}>
                <Link to={`/challenges/${challenge.id}`} className="btn btn-soft">Open challenge</Link>
                <Link to="/challenges" className="btn btn-ghost">All challenges</Link>
              </div>
            </section>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <section aria-labelledby="career-title" className="card stack" style={{ height: '100%', '--gap': '12px' } as CSSProperties}>
            <div className="row-between">
              <h2 id="career-title" style={{ fontSize: '1.2rem' }}>Career Centre</h2>
              {careerFirst && <span className="badge">When you’re ready</span>}
            </div>
            <p className="muted small">
              {careerFirst
                ? 'Focus on the fundamentals first. Your portfolio, resume and LinkedIn guides are here whenever you want a peek.'
                : 'Keep your portfolio, resume and LinkedIn moving alongside your learning.'}
            </p>
            {CAREER_SECTIONS.slice(0, careerFirst ? 3 : 6).map((s) => {
              const p = careerSectionProgress(content, s.id, state)
              return (
                <Link key={s.id} to={`/career/${s.id}`} className="row" style={{ flexWrap: 'nowrap', color: 'inherit', textDecoration: 'none' }}>
                  <Icon name={s.icon} size={18} />
                  <span className="grow">
                    <span className="row-between small" style={{ fontWeight: 600 }}>
                      {s.title}
                      <span className="subtle">{p.done}/{p.total}</span>
                    </span>
                    <ProgressBar value={p.pct} label={`${s.title} checklist progress`} thin />
                  </span>
                </Link>
              )
            })}
          </section>
        </Reveal>

        {mentor.available && (
          <Reveal delay={0.15}>
            <section aria-labelledby="mentor-title" className="card tinted stack" style={{ height: '100%', '--gap': '12px' } as CSSProperties}>
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                {mentor.photo ? <img src={mentor.photo} alt="" className="avatar avatar-lg" /> : <span className="avatar avatar-lg">{mentor.name[0]}</span>}
                <div>
                  <h2 id="mentor-title" style={{ fontSize: '1.2rem' }}>1:1 with {mentor.name}</h2>
                  <span className="subtle">{mentor.role}</span>
                </div>
              </div>
              <p className="muted small">{mentor.bio}</p>
              <div className="chip-group" aria-label="Session topics">
                {mentor.topics.slice(0, 5).map((t) => (
                  <span key={t} className="badge">{t}</span>
                ))}
              </div>
              <div className="row" style={{ marginTop: 'auto' }}>
                <MentorLink className="btn btn-primary" />
                {content.reviews?.enabled && <Link to="/reviews" className="btn btn-ghost">Reviews</Link>}
              </div>
            </section>
          </Reveal>
        )}
      </div>

      <LevelSwitcher open={switchOpen} onClose={() => setSwitchOpen(false)} />
    </div>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="stat">
      <span className="row subtle" style={{ '--gap': '6px' } as CSSProperties} aria-hidden>{icon}</span>
      <span className="stat-value" style={{ fontSize: '1.5rem' }}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
