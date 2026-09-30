import { ArrowLeft, ArrowRight, Check, Clock, Copy, Download } from 'lucide-react'
import { useId, useState, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Blocks, FileCard } from '../components/Blocks'
import { Illustration } from '../components/illustrationLibrary'
import { BookmarkButton } from '../components/BookmarkButton'
import { MentorLink, useMentor } from '../components/MentorLink'
import { CheckItem, formatMinutes, LevelBadge, PageHeader, ProgressBar, ProgressRing, Reveal } from '../components/ui'
import { CAREER_SECTIONS, guidesFor } from '../lib/content'
import { Icon } from '../lib/icons'
import { careerSectionProgress } from '../lib/progress'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { useToast } from '../state/ui'

export function CareerCentre() {
  const { content } = useContent()
  const { state } = useLearner()
  const mentor = useMentor()
  const all = CAREER_SECTIONS.map((s) => careerSectionProgress(content, s.id, state))
  const total = all.reduce((s, p) => s + p.total, 0)
  const done = all.reduce((s, p) => s + p.done, 0)
  const challengeCount = content.challenges.filter((c) => !state.level || c.level === state.level).length
  const challengesDone = content.challenges.filter((c) => (!state.level || c.level === state.level) && state.completedChallenges[c.id]).length
  const nextSection = CAREER_SECTIONS.find((_, i) => !all[i].complete)

  return (
    <div className="page">
      <PageHeader eyebrow="Career Centre" title="Get job-ready, honestly">
        Practical guidance for your portfolio, resume, LinkedIn, job search and interviews. Tick off each checklist as you go.
      </PageHeader>

      <div className="card row" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <ProgressRing value={total ? done / total : 0} label="Career readiness">
          <strong>{done}/{total}</strong>
          <span className="subtle">steps</span>
        </ProgressRing>
        <div className="grow stack" style={{ '--gap': '8px', minWidth: 240 } as CSSProperties}>
          <h2 style={{ fontSize: '1.25rem' }}>Career readiness</h2>
          <p className="muted">
            {nextSection ? (
              <>Next up: <strong>{nextSection.title}</strong> — {nextSection.blurb}</>
            ) : (
              'Every checklist is complete. Keep your materials fresh as your skills grow.'
            )}
          </p>
          {nextSection && (
            <Link to={`/career/${nextSection.id}`} className="btn btn-primary" style={{ width: 'fit-content' }}>
              Continue with {nextSection.title} <ArrowRight size={16} aria-hidden />
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-3">
        {CAREER_SECTIONS.map((s, i) => {
          const p = all[i]
          return (
            <Reveal key={s.id} delay={(i % 3) * 0.05}>
              <Link to={`/career/${s.id}`} className="card card-link stack" style={{ height: '100%', '--gap': '10px' } as CSSProperties}>
                <div className="row-between">
                  <span className="icon-tile"><Icon name={s.icon} size={22} /></span>
                  {p.complete && <span className="badge badge-success"><Check size={13} aria-hidden /> Done</span>}
                </div>
                <h2 style={{ fontSize: '1.2rem' }}>{s.title}</h2>
                <p className="muted small">{s.blurb}</p>
                <div style={{ marginTop: 'auto' }}>
                  <div className="row-between subtle" style={{ marginBottom: 6 }}>
                    <span>Checklist</span>
                    <span>{p.done}/{p.total}</span>
                  </div>
                  <ProgressBar value={p.pct} label={`${s.title} progress`} thin />
                </div>
              </Link>
            </Reveal>
          )
        })}
        <Reveal delay={0.1}>
          <Link to="/challenges?category=Portfolio" className="card card-link stack" style={{ height: '100%', '--gap': '10px' } as CSSProperties}>
            <span className="icon-tile"><Icon name="Target" size={22} /></span>
            <h2 style={{ fontSize: '1.2rem' }}>Design Challenges</h2>
            <p className="muted small">Portfolio-worthy practice with realistic briefs — the raw material for strong case studies.</p>
            <div style={{ marginTop: 'auto' }}>
              <div className="row-between subtle" style={{ marginBottom: 6 }}>
                <span>Submitted</span>
                <span>{challengesDone}/{challengeCount}</span>
              </div>
              <ProgressBar value={challengeCount ? challengesDone / challengeCount : 0} label="Challenges submitted" thin />
            </div>
          </Link>
        </Reveal>
        {mentor.available && (
          <Reveal delay={0.15}>
            <div className="card tinted stack" style={{ height: '100%', '--gap': '10px' } as CSSProperties}>
              <span className="icon-tile"><Icon name="MessagesSquare" size={22} /></span>
              <h2 style={{ fontSize: '1.2rem' }}>Get a review from {mentor.name}</h2>
              <p className="muted small">Portfolio, resume and LinkedIn reviews, interview practice and career guidance.</p>
              <MentorLink className="btn btn-primary" style={{ marginTop: 'auto' }} />
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}

export function CareerSectionPage() {
  const { section } = useParams()
  const { content } = useContent()
  const { state, toggleCareerCheck } = useLearner()
  const meta = CAREER_SECTIONS.find((s) => s.id === section)
  const [showAll, setShowAll] = useState(false)
  if (!meta) return <Navigate to="/career" replace />
  const mine = guidesFor(content, meta.id, state.level)
  const others = content.careerGuides.filter((g) => g.section === meta.id && !mine.includes(g))
  const p = careerSectionProgress(content, meta.id, state)
  const idx = CAREER_SECTIONS.findIndex((s) => s.id === meta.id)
  const nextSection = CAREER_SECTIONS[idx + 1]

  return (
    <div className="page page-narrow">
      <Link to="/career" className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-4)', marginLeft: -12 }}>
        <ArrowLeft size={16} aria-hidden /> Career Centre
      </Link>
      <PageHeader eyebrow={<span className="row" style={{ '--gap': '8px' } as CSSProperties}><Icon name={meta.icon} size={16} /> Career · {meta.title}</span>} title={meta.title}>
        {meta.blurb}
      </PageHeader>

      <div className="card card-tight row" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="grow">
          <div className="row-between small" style={{ marginBottom: 6 }}>
            <strong>Your {meta.title.toLowerCase()} checklist</strong>
            <span className="muted">{p.done} of {p.total}</span>
          </div>
          <ProgressBar value={p.pct} label={`${meta.title} checklist`} />
        </div>
      </div>

      {meta.id === 'resume' && <BulletBuilder />}
      {meta.id === 'linkedin' && <HeadlineBuilder />}
      {meta.id === 'portfolio' && <CaseStudyTemplate />}

      <div className="stack" style={{ '--gap': 'var(--space-6)' } as CSSProperties}>
        {mine.map((g) => {
          const level = content.levels.find((l) => l.id === g.level)
          return (
            <article key={g.id} id={g.id} className="stack" style={{ '--gap': 'var(--space-4)', scrollMarginTop: 90 } as CSSProperties} aria-labelledby={`t-${g.id}`}>
              <div className="row-between">
                <div className="stack" style={{ '--gap': '6px' } as CSSProperties}>
                  <div className="meta">
                    {level && <LevelBadge level={level} />}
                    <span><Clock size={14} aria-hidden /> {formatMinutes(g.minutes)}</span>
                  </div>
                  <h2 id={`t-${g.id}`}>{g.title}</h2>
                  <p className="muted">{g.summary}</p>
                </div>
                <div className="row" style={{ '--gap': '6px' } as CSSProperties}>
                  <Link to={`/print/guide/${g.id}`} className="btn btn-sm"><Download size={15} aria-hidden /> PDF</Link>
                  <BookmarkButton kind="guide" id={g.id} title={g.title} compact />
                </div>
              </div>
              {g.cover && (
                <div className="lesson-cover">
                  <Illustration name={g.cover} title="" />
                </div>
              )}
              {!!g.attachments?.length && (
                <div className="stack" style={{ '--gap': '8px', maxWidth: 'var(--reading-max)' } as CSSProperties}>
                  {g.attachments.map((f) => <FileCard key={f.url} file={f} />)}
                </div>
              )}
              <Blocks blocks={g.blocks} />
              <section className="card" aria-labelledby={`cl-${g.id}`} style={{ maxWidth: 'var(--reading-max)' }}>
                <h3 id={`cl-${g.id}`} style={{ marginBottom: 8 }}>Checklist</h3>
                {g.checklist.map((item, i) => {
                  const key = `${g.id}:${i}`
                  return (
                    <CheckItem key={key} checked={!!state.careerChecks[key]} onChange={() => toggleCareerCheck(key)}>
                      {item}
                    </CheckItem>
                  )
                })}
              </section>
            </article>
          )
        })}
      </div>

      {others.length > 0 && (
        <section style={{ marginTop: 'var(--space-7)' }}>
          <button className="btn" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Hide' : 'Show'} {meta.title.toLowerCase()} guides for other levels ({others.length})
          </button>
          {showAll && (
            <div className="grid grid-2" style={{ marginTop: 'var(--space-4)' }}>
              {others.map((g) => {
                const level = content.levels.find((l) => l.id === g.level)
                return (
                  <details key={g.id} className="card card-tight faq">
                    <summary className="row-between" style={{ cursor: 'pointer', listStyle: 'none' }}>
                      <span>
                        {level && <LevelBadge level={level} />}
                        <strong style={{ display: 'block', marginTop: 6 }}>{g.title}</strong>
                      </span>
                    </summary>
                    <div style={{ marginTop: 16 }}><Blocks blocks={g.blocks} /></div>
                  </details>
                )
              })}
            </div>
          )}
        </section>
      )}

      {nextSection && (
        <div className="row-between card card-tight" style={{ marginTop: 'var(--space-7)' }}>
          <span className="muted">Next in the Career Centre</span>
          <Link to={`/career/${nextSection.id}`} className="btn btn-soft">
            {nextSection.title} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      )}
    </div>
  )
}

function useCopy() {
  const toast = useToast()
  return async (text: string, label = 'Copied to clipboard') => {
    try {
      await navigator.clipboard.writeText(text)
      toast(label)
    } catch {
      toast('Copy failed — select the text and copy it manually.', 'error')
    }
  }
}

function Tool({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="card tinted" style={{ marginBottom: 'var(--space-6)' }} aria-label={title}>
      <span className="eyebrow">Tool</span>
      <h2 style={{ fontSize: '1.25rem', margin: '4px 0 6px' }}>{title}</h2>
      <p className="muted small" style={{ marginBottom: 16 }}>{description}</p>
      {children}
    </section>
  )
}

function Field({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; hint?: string }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className="input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}

function BulletBuilder() {
  const [verb, setVerb] = useState('Redesigned')
  const [what, setWhat] = useState('')
  const [how, setHow] = useState('')
  const [result, setResult] = useState('')
  const copy = useCopy()
  const bullet = [verb.trim(), what.trim(), how.trim() && `by ${how.trim().replace(/^by\s+/i, '')}`, result.trim() && `— ${result.trim()}`].filter(Boolean).join(' ')
  const vague = /\b(helped|worked on|responsible for|various)\b/i.test(bullet)
  const unsupported = /\d+\s?%/.test(result) && !/(measured|analytics|survey|test|data|tracked)/i.test(result)
  return (
    <Tool title="Honest bullet builder" description="Action + what + how + outcome. Only include outcomes you can explain and back up — “what changed” is often more honest than a percentage.">
      <div className="grid grid-2">
        <Field label="Action verb" value={verb} onChange={setVerb} placeholder="Redesigned, Researched, Built…" />
        <Field label="What you worked on" value={what} onChange={setWhat} placeholder="the checkout flow for a student food app" />
        <Field label="How you did it" value={how} onChange={setHow} placeholder="interviewing 5 students and testing 2 prototypes" />
        <Field label="Outcome (optional, must be true)" value={result} onChange={setResult} placeholder="testers completed checkout without help" hint="No data? Describe the qualitative result or what you learned." />
      </div>
      <div className="card card-flat" style={{ marginTop: 16 }} aria-live="polite">
        <div className="subtle" style={{ marginBottom: 4 }}>Preview</div>
        <p style={{ fontWeight: 500 }}>• {bullet || 'Start typing to build your bullet point.'}</p>
        {vague && <p className="small" style={{ color: 'var(--c-warning)', marginTop: 8 }}>Tip: replace vague words like “helped” or “worked on” with what you actually did.</p>}
        {unsupported && <p className="small" style={{ color: 'var(--c-warning)', marginTop: 8 }}>Only use a percentage if you measured it. Say how you know (e.g. “in usability testing”).</p>}
        <button className="btn btn-sm" style={{ marginTop: 12 }} disabled={!what.trim()} onClick={() => copy(bullet, 'Bullet copied')}>
          <Copy size={15} aria-hidden /> Copy bullet
        </button>
      </div>
    </Tool>
  )
}

function HeadlineBuilder() {
  const [role, setRole] = useState('UI/UX Designer')
  const [focus, setFocus] = useState('')
  const [value, setValue] = useState('')
  const copy = useCopy()
  const headline = [role.trim(), focus.trim(), value.trim()].filter(Boolean).join(' | ')
  return (
    <Tool title="Headline builder" description="Your headline appears next to your name everywhere on LinkedIn. Be specific about the role you want and what you care about.">
      <div className="grid grid-2">
        <Field label="Role you’re targeting" value={role} onChange={setRole} placeholder="Junior Product Designer" />
        <Field label="Focus or domain" value={focus} onChange={setFocus} placeholder="Accessible mobile apps" />
        <Field label="What you bring" value={value} onChange={setValue} placeholder="Research-led, systems-minded" />
      </div>
      <div className="card card-flat" style={{ marginTop: 16 }} aria-live="polite">
        <div className="row-between subtle" style={{ marginBottom: 4 }}>
          <span>Preview</span>
          <span style={{ color: headline.length > 220 ? 'var(--c-danger)' : undefined }}>{headline.length}/220</span>
        </div>
        <p style={{ fontWeight: 600 }}>{headline || 'Your headline preview'}</p>
        <button className="btn btn-sm" style={{ marginTop: 12 }} disabled={!headline} onClick={() => copy(headline, 'Headline copied')}>
          <Copy size={15} aria-hidden /> Copy headline
        </button>
      </div>
    </Tool>
  )
}

const CASE_STAGES: [string, string][] = [
  ['Problem', 'Who is struggling, with what, and why does it matter to them and the business?'],
  ['Research', 'What did you do to understand the problem? Methods, participants, constraints.'],
  ['Insights', 'The 2–4 findings that changed your direction. Quote real users where you can.'],
  ['User flow', 'The key path you designed for. What did you remove or simplify?'],
  ['Wireframes', 'Early options you explored and why you chose one.'],
  ['Design system', 'Type, colour, spacing and components you set up — and why.'],
  ['UI', 'The final screens. Annotate the decisions, not just the visuals.'],
  ['Testing', 'How you tested, what you asked, what you observed.'],
  ['Iteration', 'What changed because of testing. Show before and after.'],
  ['Outcome', 'What changed as a result. Only real, verifiable results — qualitative is fine.'],
  ['Learnings', 'What you’d do differently next time and what you’d explore next.'],
]

function CaseStudyTemplate() {
  const copy = useCopy()
  const text = CASE_STAGES.map(([t, q], i) => `${i + 1}. ${t}\n${q}\n\n`).join('')
  return (
    <Tool title="Case-study template" description="Problem → Research → Insights → User Flow → Wireframes → Design System → UI → Testing → Iteration → Outcome → Learnings.">
      <ol className="stack" style={{ '--gap': '8px', paddingLeft: '1.3em', margin: 0 } as CSSProperties}>
        {CASE_STAGES.map(([t, q]) => (
          <li key={t} style={{ marginTop: 0 }}>
            <strong>{t}</strong> <span className="muted">— {q}</span>
          </li>
        ))}
      </ol>
      <button className="btn btn-sm" style={{ marginTop: 16 }} onClick={() => copy(text, 'Template copied — paste it into Figma, Notion or Docs')}>
        <Copy size={15} aria-hidden /> Copy template
      </button>
    </Tool>
  )
}

