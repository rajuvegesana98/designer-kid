import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Clock, Download, Gauge, Lightbulb, RotateCcw, StickyNote } from 'lucide-react'
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router'
import { Blocks, FileCard } from '../components/Blocks'
import { Illustration } from '../components/illustrationLibrary'
import { coverFor } from '../lib/covers'
import { BookmarkButton } from '../components/BookmarkButton'
import { MentorLink, useMentor } from '../components/MentorLink'
import { CheckItem, EmptyState, formatMinutes } from '../components/ui'
import { findLesson, levelLessons } from '../lib/content'
import { inline } from '../lib/markdown'
import { moduleLock, moduleProgress } from '../lib/progress'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { useToast } from '../state/ui'

const SECTIONS = [
  { id: 'learn', label: 'Learn' },
  { id: 'example', label: 'Example' },
  { id: 'practice', label: 'Practice' },
  { id: 'challenge', label: 'Challenge' },
] as const
const SECTION_IDS = SECTIONS.map((s) => s.id)

function useActiveSection(ids: readonly string[], key: string) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [ids, key])
  return active
}

function NotesPanel({ lessonId }: { lessonId: string }) {
  const { state, setNote } = useLearner()
  const saved = state.notes[lessonId]?.text ?? ''
  const [text, setText] = useState(saved)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const timer = useRef<number | undefined>(undefined)
  const id = useId()

  useEffect(() => setText(state.notes[lessonId]?.text ?? ''), [lessonId]) // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (v: string) => {
    setText(v)
    setStatus('saving')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setNote(lessonId, v)
      setStatus('saved')
    }, 500)
  }

  return (
    <div className="card card-tight stack" style={{ '--gap': '8px' } as CSSProperties}>
      <div className="row-between">
        <label htmlFor={id} className="row" style={{ '--gap': '8px', fontWeight: 700 } as CSSProperties}>
          <StickyNote size={18} aria-hidden /> My notes
        </label>
        <span className="subtle" aria-live="polite">{status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Private to you'}</span>
      </div>
      <textarea id={id} className="textarea" value={text} onChange={(e) => onChange(e.target.value)} placeholder="e.g. Remember to use an 8px spacing system." rows={5} />
      <Link to="/progress?tab=notes" className="small">View all my notes</Link>
    </div>
  )
}

export function LessonPage() {
  const { lessonId } = useParams()
  const { content } = useContent()
  const { state, completeLesson, uncompleteLesson, visitLesson } = useLearner()
  const toast = useToast()
  const mentor = useMentor()
  const ref = findLesson(content, lessonId ?? '')
  const active = useActiveSection(SECTION_IDS, lessonId ?? '')
  const [practiceChecks, setPracticeChecks] = useState<Record<number, boolean>>({})
  const [justCompleted, setJustCompleted] = useState(false)

  const lock = ref ? moduleLock(ref.level, ref.module.id, state) : undefined
  useEffect(() => {
    if (ref) visitLesson(ref.lesson.id)
    setPracticeChecks({})
    setJustCompleted(false)
  }, [ref?.lesson.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!ref)
    return (
      <div className="page">
        <EmptyState icon="BookOpen" title="Lesson not found" action={<Link to="/learn" className="btn btn-primary">Back to Learn</Link>}>
          It may have been moved or unpublished.
        </EmptyState>
      </div>
    )

  const { level, module, lesson } = ref
  const lessons = levelLessons(level)
  const prev = lessons[ref.index - 1]
  const next = lessons[ref.index + 1]
  const done = !!state.completedLessons[lesson.id]
  const posInModule = module.lessons.findIndex((l) => l.id === lesson.id) + 1
  const mp = moduleProgress(module, state)

  const complete = () => {
    completeLesson(lesson.id, lesson.title)
    setJustCompleted(true)
    const willFinishModule = mp.done + 1 === mp.total
    toast(willFinishModule ? `Module complete: ${module.title}` : 'Lesson complete')
  }

  return (
    <div className="page" style={{ '--c-level': level.color, maxWidth: 1240 } as CSSProperties}>
      <nav aria-label="Breadcrumb" className="row small muted" style={{ '--gap': '6px', marginBottom: 'var(--space-4)' } as CSSProperties}>
        <Link to={`/learn/${level.id}`} className="muted">{level.name}</Link>
        <span aria-hidden>/</span>
        <Link to={`/learn/${level.id}/${module.id}`} className="muted">{module.title}</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">Lesson {posInModule}</span>
      </nav>

      <div className="grid lesson-layout">
        <article className="lesson-main" aria-labelledby="lesson-title">
          <header className="stack" style={{ '--gap': '14px', marginBottom: 'var(--space-5)' } as CSSProperties}>
            <div className="lesson-cover">
              <Illustration name={coverFor(lesson.title, module.id, lesson.cover)} title="" />
            </div>
            <span className="eyebrow">{module.title} · Lesson {posInModule} of {module.lessons.length}</span>
            <h1 id="lesson-title" style={{ fontSize: 'clamp(1.9rem, 1.4rem + 2vw, 2.8rem)' }}>{lesson.title}</h1>
            <p className="lead">{lesson.summary}</p>
            <div className="row-between">
              <div className="meta">
                <span><Clock size={15} aria-hidden /> {formatMinutes(lesson.minutes)}</span>
                <span><Gauge size={15} aria-hidden /> {lesson.difficulty}</span>
                {done && <span className="badge badge-success"><Check size={13} aria-hidden /> Completed</span>}
              </div>
              <div className="row" style={{ '--gap': '8px' } as CSSProperties}>
                <Link to={`/print/lesson/${lesson.id}`} className="btn btn-sm">
                  <Download size={16} aria-hidden /> Download PDF
                </Link>
                <BookmarkButton kind="lesson" id={lesson.id} title={lesson.title} />
              </div>
            </div>
            {lock?.suggestedAfter && !done && (
              <p className="callout callout-tip small">
                <Lightbulb size={16} aria-hidden /> <span>Suggested order: this builds on <Link to={`/learn/${level.id}/${lock.suggestedAfter.id}`}>{lock.suggestedAfter.title}</Link>. You can still open it any time.</span>
              </p>
            )}
            {!!lesson.attachments?.length && (
              <div className="card card-tight stack" style={{ '--gap': '8px' } as CSSProperties}>
                <strong className="small">Downloads for this lesson</strong>
                {lesson.attachments.map((f) => <FileCard key={f.url} file={f} />)}
              </div>
            )}
          </header>

          <nav className="lesson-steps glass" aria-label="Lesson sections">
            {SECTIONS.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className={`lesson-step ${active === s.id ? 'active' : ''}`} aria-current={active === s.id ? 'true' : undefined}>
                <span className="lesson-step-num" aria-hidden>{i + 1}</span>
                {s.label}
              </a>
            ))}
          </nav>

          <section id="learn" className="lesson-section" aria-labelledby="h-learn">
            <h2 id="h-learn" className="lesson-section-title"><span>1</span> Learn</h2>
            <Blocks blocks={lesson.learn} />
          </section>

          <section id="example" className="lesson-section" aria-labelledby="h-example">
            <h2 id="h-example" className="lesson-section-title"><span>2</span> Example</h2>
            <Blocks blocks={lesson.example} />
          </section>

          <section id="practice" className="lesson-section" aria-labelledby="h-practice">
            <h2 id="h-practice" className="lesson-section-title"><span>3</span> Practice</h2>
            <div className="card prose" style={{ maxWidth: 'var(--reading-max)' }}>
              <p style={{ fontWeight: 600, fontSize: '1.08rem' }}>{inline(lesson.practice.task)}</p>
              <div className="stack" style={{ '--gap': '2px', marginTop: 12 } as CSSProperties}>
                {lesson.practice.steps.map((s, i) => (
                  <CheckItem key={i} checked={!!practiceChecks[i]} onChange={() => setPracticeChecks((c) => ({ ...c, [i]: !c[i] }))}>
                    {inline(s)}
                  </CheckItem>
                ))}
              </div>
              <p className="small muted" style={{ marginTop: 12 }}>
                <strong>Deliverable:</strong> {inline(lesson.practice.deliverable)}
              </p>
            </div>
          </section>

          <section id="challenge" className="lesson-section" aria-labelledby="h-challenge">
            <h2 id="h-challenge" className="lesson-section-title"><span>4</span> Challenge</h2>
            <div className="card tinted prose" style={{ maxWidth: 'var(--reading-max)' }}>
              <p style={{ fontWeight: 600, fontSize: '1.08rem' }}>{inline(lesson.challenge.task)}</p>
              <h3 style={{ fontSize: '1rem', marginTop: 16 }}>You’ve nailed it when…</h3>
              <ul>
                {lesson.challenge.successCriteria.map((c, i) => (
                  <li key={i}>{inline(c)}</li>
                ))}
              </ul>
              {mentor.available && (
                <p className="small muted" style={{ marginTop: 16 }}>
                  Want feedback on your solution? <MentorLink className="">Book a 1:1 with {mentor.name}</MentorLink>
                </p>
              )}
            </div>
          </section>

          <div className="show-sm" style={{ marginTop: 'var(--space-5)' }}>
            <NotesPanel lessonId={lesson.id} />
          </div>

          <section aria-label="Lesson completion" className="card lesson-complete" style={{ marginTop: 'var(--space-6)', maxWidth: 'var(--reading-max)' }}>
            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="stack" style={{ '--gap': '14px' } as CSSProperties}>
                  <div className="row" style={{ flexWrap: 'nowrap' }}>
                    <motion.span
                      className="icon-tile"
                      style={{ '--tile': 'var(--c-accent)' } as CSSProperties}
                      initial={justCompleted ? { scale: 0.4, rotate: -20 } : false}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    >
                      <CheckCircle2 size={24} aria-hidden />
                    </motion.span>
                    <div className="grow">
                      <strong style={{ fontSize: '1.1rem' }}>Lesson complete</strong>
                      <p className="small muted">{mp.complete ? `You’ve finished ${module.title}.` : `${mp.done} of ${mp.total} lessons done in ${module.title}.`}</p>
                    </div>
                  </div>
                  <div className="row">
                    {next ? (
                      <Link to={`/lesson/${next.lesson.id}`} className="btn btn-primary btn-lg">
                        Next lesson: {next.lesson.title.length > 34 ? next.lesson.title.slice(0, 32) + '…' : next.lesson.title} <ArrowRight size={18} aria-hidden />
                      </Link>
                    ) : (
                      <Link to={`/learn/${level.id}`} className="btn btn-primary btn-lg">
                        Back to roadmap <ArrowRight size={18} aria-hidden />
                      </Link>
                    )}
                    <button className="btn btn-ghost" onClick={() => uncompleteLesson(lesson.id)}>
                      <RotateCcw size={16} aria-hidden /> Mark as not complete
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="todo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="row-between">
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>Finished the lesson?</strong>
                    <p className="small muted">Mark it complete to track your progress and earn achievements.</p>
                  </div>
                  <motion.button className="btn btn-primary btn-lg" onClick={complete} whileTap={{ scale: 0.95 }}>
                    <Check size={18} aria-hidden /> Mark as complete
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <nav className="row-between" aria-label="Lesson navigation" style={{ marginTop: 'var(--space-5)', maxWidth: 'var(--reading-max)' }}>
            {prev ? (
              <Link to={`/lesson/${prev.lesson.id}`} className="btn btn-ghost">
                <ArrowLeft size={16} aria-hidden /> <span className="hide-sm">Previous:</span> {prev.lesson.title.length > 26 ? 'Previous lesson' : prev.lesson.title}
              </Link>
            ) : <span />}
            {next && !done && (
              <Link to={`/lesson/${next.lesson.id}`} className="btn btn-ghost">
                Skip to next <ArrowRight size={16} aria-hidden />
              </Link>
            )}
          </nav>
        </article>

        <aside className="lesson-aside hide-sm" aria-label="Module outline and notes">
          <div className="stack" style={{ position: 'sticky', top: 'calc(var(--topbar-h) + 16px)', '--gap': '16px' } as CSSProperties}>
            <div className="card card-tight">
              <div className="row-between" style={{ marginBottom: 8 }}>
                <strong className="small">{module.title}</strong>
                <span className="subtle">{mp.done}/{mp.total}</span>
              </div>
              <ol className="list" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                {module.lessons.map((l) => {
                  const d = !!state.completedLessons[l.id]
                  const cur = l.id === lesson.id
                  return (
                    <li key={l.id}>
                      <Link
                        to={`/lesson/${l.id}`}
                        className="row small"
                        aria-current={cur ? 'page' : undefined}
                        style={{ flexWrap: 'nowrap', padding: '7px 8px', borderRadius: 10, textDecoration: 'none', color: cur ? 'var(--c-text)' : 'var(--c-text-2)', fontWeight: cur ? 700 : 500, background: cur ? 'var(--c-surface-3)' : undefined, '--gap': '8px' } as CSSProperties}
                      >
                        {d ? <CheckCircle2 size={16} style={{ color: 'var(--c-accent)', flexShrink: 0 }} aria-hidden /> : <Circle size={16} style={{ flexShrink: 0 }} aria-hidden />}
                        <span className="grow" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                        {d && <span className="sr-only">(completed)</span>}
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </div>
            <NotesPanel lessonId={lesson.id} />
          </div>
        </aside>
      </div>
    </div>
  )
}
