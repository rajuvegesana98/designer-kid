import { ArrowLeft, Clock, Download, Gauge, Square } from 'lucide-react'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { Blocks, FileCard, PrintMode } from '../components/Blocks'
import { BrandMark } from '../components/Brand'
import { Illustration } from '../components/illustrationLibrary'
import { EmptyState, formatMinutes } from '../components/ui'
import type { CareerGuide, Lesson, Level, Module } from '../content/types'
import { CAREER_SECTIONS, findLesson, findModule } from '../lib/content'
import { coverFor } from '../lib/covers'
import { inline } from '../lib/markdown'
import { themeVars } from '../lib/theme'
import { useContent } from '../state/content'

/**
 * Printable document view. "Download PDF" opens this page and the browser's
 * print dialog, where learners choose "Save as PDF" — this keeps text sharp and
 * selectable, with the same illustrations and theme as the site.
 */
function PrintShell({ title, back, children }: { title: string; back: string; children: ReactNode }) {
  const { content } = useContent()
  const [params] = useSearchParams()
  const printed = useRef(false)
  const vars = themeVars(content.theme, 'light') as CSSProperties

  useEffect(() => {
    document.title = `${title} — ${content.brand.name}`
    if (params.get('auto') === '0' || printed.current) return
    printed.current = true
    // Wait for web fonts so the PDF uses the brand typography.
    document.fonts.ready.then(() => window.setTimeout(() => window.print(), 350))
  }, [title, content.brand.name, params])

  return (
    <PrintMode.Provider value={true}>
      <div data-mode="light" style={{ ...vars, background: 'var(--c-bg)', color: 'var(--c-text)', minHeight: '100dvh', fontFamily: 'var(--font-body)' } as CSSProperties}>
        <div className="print-toolbar">
          <Link to={back} className="btn btn-ghost btn-sm"><ArrowLeft size={16} aria-hidden /> Back</Link>
          <span className="small muted">In the print dialog choose <strong>“Save as PDF”</strong> as the destination.</span>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}><Download size={16} aria-hidden /> Download PDF</button>
        </div>
        <main className="print-doc">{children}</main>
      </div>
    </PrintMode.Provider>
  )
}

function DocFooter() {
  const { content } = useContent()
  return (
    <footer className="row small muted" style={{ marginTop: 48, paddingTop: 16, borderTop: '1px solid var(--c-line)' }}>
      <BrandMark size={24} /> {content.brand.name} · {content.brand.tagline}
    </footer>
  )
}

function LessonDoc({ level, module, lesson, index }: { level: Level; module: Module; lesson: Lesson; index: number }) {
  return (
    <article className="print-lesson">
      <header className="print-cover">
        <div className="lesson-cover" style={{ maxWidth: 520 }}>
          <Illustration name={coverFor(lesson.title, module.id, lesson.cover)} title="" />
        </div>
        <span className="eyebrow">{level.name} · {module.title} · Lesson {index} of {module.lessons.length}</span>
        <h1 style={{ fontSize: '2.2rem' }}>{lesson.title}</h1>
        <p className="lead">{lesson.summary}</p>
        <div className="meta">
          <span><Clock size={15} aria-hidden /> {formatMinutes(lesson.minutes)}</span>
          <span><Gauge size={15} aria-hidden /> {lesson.difficulty}</span>
        </div>
      </header>
      <section className="print-section"><h2>1 · Learn</h2><Blocks blocks={lesson.learn} /></section>
      {lesson.example.length > 0 && <section className="print-section"><h2>2 · Example</h2><Blocks blocks={lesson.example} /></section>}
      <section className="print-section">
        <h2>3 · Practice</h2>
        <div className="card card-flat">
          <p style={{ fontWeight: 600 }}>{inline(lesson.practice.task)}</p>
          <ul className="list" style={{ marginTop: 10 }}>
            {lesson.practice.steps.map((s, i) => (
              <li key={i} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', padding: '5px 0' }}>
                <Square size={16} aria-hidden style={{ flexShrink: 0, marginTop: 4 }} /> <span>{inline(s)}</span>
              </li>
            ))}
          </ul>
          <p className="small muted" style={{ marginTop: 10 }}><strong>Deliverable:</strong> {inline(lesson.practice.deliverable)}</p>
        </div>
      </section>
      <section className="print-section">
        <h2>4 · Challenge</h2>
        <div className="card card-flat tinted prose">
          <p style={{ fontWeight: 600 }}>{inline(lesson.challenge.task)}</p>
          <ul>{lesson.challenge.successCriteria.map((c, i) => <li key={i}>{inline(c)}</li>)}</ul>
        </div>
      </section>
      {!!lesson.attachments?.length && (
        <section className="print-section">
          <h2>Downloads</h2>
          <div className="stack">{lesson.attachments.map((f) => <FileCard key={f.url} file={f} />)}</div>
        </section>
      )}
    </article>
  )
}

export function PrintLesson() {
  const { lessonId } = useParams()
  const { content } = useContent()
  const ref = findLesson(content, lessonId ?? '')
  if (!ref) return <div className="page"><EmptyState icon="BookOpen" title="Lesson not found" /></div>
  const index = ref.module.lessons.findIndex((l) => l.id === ref.lesson.id) + 1
  return (
    <PrintShell title={ref.lesson.title} back={`/lesson/${ref.lesson.id}`}>
      <LessonDoc level={ref.level} module={ref.module} lesson={ref.lesson} index={index} />
      <DocFooter />
    </PrintShell>
  )
}

export function PrintModule() {
  const { moduleId } = useParams()
  const { content } = useContent()
  const found = findModule(content, moduleId ?? '')
  if (!found) return <div className="page"><EmptyState icon="BookOpen" title="Module not found" /></div>
  const { level, module } = found
  return (
    <PrintShell title={module.title} back={`/learn/${level.id}/${module.id}`}>
      <header className="print-cover" style={{ breakAfter: 'page' }}>
        <div className="lesson-cover" style={{ maxWidth: 520 }}>
          <Illustration name={coverFor(module.title, module.id)} title="" />
        </div>
        <span className="eyebrow">{level.name} · Module workbook</span>
        <h1 style={{ fontSize: '2.6rem' }}>{module.title}</h1>
        <p className="lead">{module.summary}</p>
        <p><strong>You’ll be able to:</strong> {module.outcome}</p>
        <ol className="stack" style={{ '--gap': '6px', paddingLeft: '1.3em' } as CSSProperties}>
          {module.lessons.map((l) => <li key={l.id} style={{ marginTop: 0 }}>{l.title} <span className="subtle">· {formatMinutes(l.minutes)}</span></li>)}
        </ol>
      </header>
      {module.lessons.map((l, i) => <LessonDoc key={l.id} level={level} module={module} lesson={l} index={i + 1} />)}
      <DocFooter />
    </PrintShell>
  )
}

function GuideDoc({ guide }: { guide: CareerGuide }) {
  const section = CAREER_SECTIONS.find((s) => s.id === guide.section)
  return (
    <article className="print-lesson">
      <header className="print-cover">
        {guide.cover && (
          <div className="lesson-cover" style={{ maxWidth: 520 }}>
            <Illustration name={guide.cover} title="" />
          </div>
        )}
        <span className="eyebrow">Career Centre · {section?.title}</span>
        <h1 style={{ fontSize: '2.2rem' }}>{guide.title}</h1>
        <p className="lead">{guide.summary}</p>
      </header>
      <Blocks blocks={guide.blocks} />
      {guide.checklist.length > 0 && (
        <section className="print-section">
          <h2>Checklist</h2>
          <ul className="list">
            {guide.checklist.map((c, i) => (
              <li key={i} className="row" style={{ flexWrap: 'nowrap', padding: '5px 0' }}><Square size={16} aria-hidden /> {c}</li>
            ))}
          </ul>
        </section>
      )}
      {!!guide.attachments?.length && (
        <section className="print-section">
          <h2>Downloads</h2>
          <div className="stack">{guide.attachments.map((f) => <FileCard key={f.url} file={f} />)}</div>
        </section>
      )}
    </article>
  )
}

export function PrintGuide() {
  const { guideId } = useParams()
  const { content } = useContent()
  const guide = content.careerGuides.find((g) => g.id === guideId)
  if (!guide) return <div className="page"><EmptyState icon="Briefcase" title="Guide not found" /></div>
  return (
    <PrintShell title={guide.title} back={`/career/${guide.section}#${guide.id}`}>
      <GuideDoc guide={guide} />
      <DocFooter />
    </PrintShell>
  )
}
