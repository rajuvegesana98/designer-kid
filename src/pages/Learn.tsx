import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Clock, Download, PlayCircle } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { EmptyState, formatMinutes, LevelBadge, PageHeader, ProgressBar, Reveal } from '../components/ui'
import type { LevelId } from '../content/types'
import { findModule, getLevel, levelModules } from '../lib/content'
import { Icon } from '../lib/icons'
import { levelProgress, moduleLock, moduleProgress, nextLesson } from '../lib/progress'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { usePageTitle } from '../lib/usePageTitle'

export function LearnIndex() {
  const { state } = useLearner()
  const { content } = useContent()
  if (state.level && getLevel(content, state.level)) return <Navigate to={`/learn/${state.level}`} replace />
  return (
    <div className="page">
      <PageHeader title="Learning paths" eyebrow="Learn">Choose a level to see its roadmap.</PageHeader>
      <div className="grid grid-3">
        {content.levels.map((l) => (
          <Link key={l.id} to={`/learn/${l.id}`} className="card card-link stack" style={{ '--gap': '10px' } as CSSProperties}>
            <span className="icon-tile" style={{ '--tile': l.color } as CSSProperties}><Icon name={l.icon} size={22} /></span>
            <h2 style={{ fontSize: '1.25rem' }}>{l.name}</h2>
            <p className="muted">{l.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function LevelRoadmap() {
  const { levelId } = useParams()
  const { content } = useContent()
  const { state } = useLearner()
  const level = getLevel(content, levelId as LevelId)
  usePageTitle(level ? `${level.name} roadmap` : 'Learn')
  if (!level) return <NotFoundLevel />
  const isMine = state.level === level.id
  const progress = levelProgress(level, state)
  const next = nextLesson(level, state)
  const modules = levelModules(level)

  return (
    <div className="page" style={{ '--c-level': level.color } as CSSProperties}>
      <PageHeader
        eyebrow={<span className="row" style={{ '--gap': '8px' } as CSSProperties}><LevelBadge level={level} /> {isMine ? 'Your path' : 'Exploring'}</span>}
        title={`${level.name} roadmap`}
        actions={next && <Link to={`/lesson/${next.lesson.id}`} className="btn btn-primary">{progress.done ? 'Continue' : 'Start'}: {next.lesson.title.length > 28 ? 'next lesson' : next.lesson.title} <ArrowRight size={16} aria-hidden /></Link>}
      >
        {level.description}
      </PageHeader>

      <div className="card row" style={{ marginBottom: 'var(--space-6)', gap: 'var(--space-5)' }}>
        <div className="grow" style={{ minWidth: 220 }}>
          <div className="row-between small" style={{ marginBottom: 8 }}>
            <strong>Overall progress</strong>
            <span className="muted">{progress.done} of {progress.total} lessons</span>
          </div>
          <ProgressBar value={progress.pct} label={`${level.name} progress`} />
        </div>
        <div className="row" style={{ gap: 'var(--space-5)' }}>
          <span className="small"><strong>{progress.modulesDone}/{progress.modulesTotal}</strong> <span className="muted">modules</span></span>
          <span className="small"><strong>{progress.projectsDone}/{progress.projectsTotal}</strong> <span className="muted">projects</span></span>
        </div>
      </div>

      {!isMine && (
        <div className="callout" style={{ marginBottom: 'var(--space-5)' }}>
          <Icon name="Compass" size={20} />
          <div>
            <strong className="callout-title">You’re browsing the {level.name} path</strong>
            <p>Your dashboard follows your chosen level. Switch level from the sidebar or your profile if this path suits you better.</p>
          </div>
        </div>
      )}

      {level.courses.map((course) => (
        <section key={course.id} className="section" style={{ marginTop: 'var(--space-5)' }} aria-labelledby={`course-${course.id}`}>
          <div className="stack" style={{ '--gap': '4px', marginBottom: 'var(--space-4)' } as CSSProperties}>
            <span className="eyebrow">Course</span>
            <h2 id={`course-${course.id}`} style={{ fontSize: '1.4rem' }}>{course.title}</h2>
            <p className="muted">{course.description}</p>
          </div>
          <ol className="roadmap" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {course.modules.map((m) => {
              const p = moduleProgress(m, state)
              const lock = moduleLock(level, m.id, state)
              const current = next?.module.id === m.id
              const index = modules.findIndex((x) => x.id === m.id) + 1
              const status = p.complete ? 'done' : current ? 'current' : ''
              return (
                <li key={m.id} className={`roadmap-step ${status}`}>
                  <div className="roadmap-node" aria-hidden>
                    {p.complete ? <Check size={22} strokeWidth={3} /> : String(index).padStart(2, '0')}
                  </div>
                  <div className="roadmap-body">
                    <Reveal>
                      <Link to={`/learn/${level.id}/${m.id}`} className="card card-link" style={{ padding: 'var(--space-4) var(--space-5)' }}>
                        <div className="row-between">
                          <span className="eyebrow">Module {String(index).padStart(2, '0')} · {m.stage}{m.kind === 'project' ? ' · Projects' : ''}</span>
                          {p.complete ? (
                            <span className="badge badge-success"><Check size={13} aria-hidden /> Complete</span>
                          ) : current ? (
                            <span className="badge badge-primary">In progress</span>
                          ) : null}
                        </div>
                        <h3 style={{ margin: '6px 0 4px' }}>{m.title}</h3>
                        <p className="muted small">{m.summary}</p>
                        <div className="row" style={{ marginTop: 12, flexWrap: 'nowrap' }}>
                          <div className="grow"><ProgressBar value={p.pct} label={`${m.title} progress`} thin /></div>
                          <span className="subtle nowrap">{p.done}/{p.total} lessons</span>
                        </div>
                        {lock.suggestedAfter && !p.done && <p className="subtle" style={{ marginTop: 6 }}>Suggested after {lock.suggestedAfter.title} — open any time.</p>}
                      </Link>
                    </Reveal>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}

export function ModulePage() {
  const { levelId, moduleId } = useParams()
  const { content } = useContent()
  const { state } = useLearner()
  const found = findModule(content, moduleId ?? '')
  if (!found || found.level.id !== levelId) return <NotFoundLevel />
  const { level, module } = found
  const p = moduleProgress(module, state)
  const nextInModule = module.lessons.find((l) => !state.completedLessons[l.id])
  const totalMinutes = module.lessons.reduce((s, l) => s + l.minutes, 0)

  return (
    <div className="page page-narrow" style={{ '--c-level': level.color } as CSSProperties}>
      <Link to={`/learn/${level.id}`} className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-4)', marginLeft: -12 }}>
        <ArrowLeft size={16} aria-hidden /> {level.name} roadmap
      </Link>
      <PageHeader eyebrow={`${module.stage} · ${module.lessons.length} ${module.kind === 'project' ? 'projects' : 'lessons'} · ${formatMinutes(totalMinutes)}`} title={module.title}>
        {module.summary}
      </PageHeader>

      <div className="callout callout-tip" style={{ marginBottom: 'var(--space-5)' }}>
        <Icon name="Target" size={20} />
        <div>
          <strong className="callout-title">What you’ll be able to do</strong>
          <p>{module.outcome}</p>
        </div>
      </div>

      {(
        <div className="card row" style={{ marginBottom: 'var(--space-5)', gap: 'var(--space-4)' }}>
          <div className="grow" style={{ minWidth: 200 }}>
            <div className="row-between small" style={{ marginBottom: 8 }}>
              <strong>{p.complete ? 'Module complete' : 'Module progress'}</strong>
              <span className="muted">{p.done} of {p.total}</span>
            </div>
            <ProgressBar value={p.pct} label={`${module.title} progress`} />
          </div>
          <Link to={`/print/module/${level.id}/${module.id}`} className="btn">
            <Download size={16} aria-hidden /> Download module PDF
          </Link>
          {nextInModule && (
            <Link to={`/lesson/${nextInModule.id}`} className="btn btn-primary">
              {p.done ? 'Continue' : 'Start module'} <ArrowRight size={16} aria-hidden />
            </Link>
          )}
        </div>
      )}

      <ol className="stack" style={{ listStyle: 'none', padding: 0, margin: 0, '--gap': '10px' } as CSSProperties}>
        {module.lessons.map((l, i) => {
          const done = !!state.completedLessons[l.id]
          const isNext = nextInModule?.id === l.id
          const inner = (
            <div className="row" style={{ flexWrap: 'nowrap', gap: 'var(--space-4)' }}>
              <span aria-hidden style={{ color: done ? 'var(--c-accent)' : isNext ? 'var(--c-level-text)' : 'var(--c-text-3)', flexShrink: 0 }}>
                {done ? <CheckCircle2 size={24} /> : isNext ? <PlayCircle size={24} /> : <Circle size={24} />}
              </span>
              <span className="grow">
                <span className="subtle">{module.kind === 'project' ? 'Project' : 'Lesson'} {i + 1}</span>
                <strong style={{ display: 'block' }}>{l.title}</strong>
                <span className="small muted clamp-2" style={{ display: '-webkit-box' }}>{l.summary}</span>
              </span>
              <span className="meta hide-sm" style={{ flexShrink: 0 }}>
                <span><Clock size={14} aria-hidden /> {formatMinutes(l.minutes)}</span>
              </span>
              <span className="sr-only">{done ? 'Completed' : isNext ? 'Up next' : 'Not started'}</span>
            </div>
          )
          return (
            <li key={l.id}>
              <Link to={`/lesson/${l.id}`} className="card card-tight card-link" style={isNext ? { borderColor: 'var(--c-level)' } : undefined}>
                {inner}
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function NotFoundLevel() {
  return (
    <div className="page">
      <EmptyState icon="Map" title="We couldn’t find that path" action={<Link to="/learn" className="btn btn-primary">Back to Learn</Link>}>
        It may have been renamed or unpublished.
      </EmptyState>
    </div>
  )
}
