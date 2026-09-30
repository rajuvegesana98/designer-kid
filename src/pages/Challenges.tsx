import { ArrowLeft, Check, CheckCircle2, Clock, Gauge, Send } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { BookmarkButton } from '../components/BookmarkButton'
import { MentorLink, useMentor } from '../components/MentorLink'
import { LevelFilter } from '../components/Search'
import { CheckItem, ConfirmDialog, EmptyState, formatDate, formatMinutes, LevelBadge, PageHeader, Reveal } from '../components/ui'
import type { ChallengeCategory, LevelId } from '../content/types'
import { Icon } from '../lib/icons'
import { inline } from '../lib/markdown'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { useToast } from '../state/ui'

export const CATEGORIES: ChallengeCategory[] = ['UI', 'UX', 'Figma', 'UX research', 'Design system', 'Product thinking', 'Portfolio']
const CATEGORY_ICON: Record<ChallengeCategory, string> = {
  UI: 'Palette',
  UX: 'Compass',
  Figma: 'PenTool',
  'UX research': 'Search',
  'Design system': 'Boxes',
  'Product thinking': 'Lightbulb',
  Portfolio: 'LayoutTemplate',
}
type Status = 'any' | 'todo' | 'progress' | 'done'

export function ChallengesPage() {
  const { content } = useContent()
  const { state } = useLearner()
  const [params, setParams] = useSearchParams()
  const level = (params.get('level') as LevelId | 'any' | null) ?? state.level ?? 'any'
  const category = (params.get('category') as ChallengeCategory | null) ?? null
  const [status, setStatus] = useState<Status>('any')

  const set = (k: string, v: string | null) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const list = content.challenges.filter((c) => {
    if (level !== 'any' && c.level !== level) return false
    if (category && c.category !== category) return false
    const done = !!state.completedChallenges[c.id]
    const started = !!state.challengeWork[c.id] && !done
    if (status === 'done' && !done) return false
    if (status === 'progress' && !started) return false
    if (status === 'todo' && (done || started)) return false
    return true
  })

  return (
    <div className="page">
      <PageHeader eyebrow="Practise" title="Design challenges">
        Realistic briefs with constraints and a self-review checklist. Submit a link to your work when you’re done.
      </PageHeader>
      <div className="stack" style={{ marginBottom: 'var(--space-5)', '--gap': '12px' } as CSSProperties}>
        <LevelFilter value={level} onChange={(v) => set('level', v)} />
        <div className="chip-group" role="radiogroup" aria-label="Filter by category">
          <button type="button" role="radio" className="chip" aria-checked={!category} onClick={() => set('category', null)}>All categories</button>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" role="radio" className="chip" aria-checked={category === c} onClick={() => set('category', c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="chip-group" role="radiogroup" aria-label="Filter by status">
          {(
            [
              ['any', 'Any status'],
              ['todo', 'Not started'],
              ['progress', 'In progress'],
              ['done', 'Submitted'],
            ] as [Status, string][]
          ).map(([v, label]) => (
            <button key={v} type="button" role="radio" className="chip" aria-checked={status === v} onClick={() => setStatus(v)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="subtle" aria-live="polite" style={{ marginBottom: 12 }}>{list.length} challenge{list.length === 1 ? '' : 's'}</p>
      {list.length === 0 ? (
        <EmptyState icon="Target" title="No challenges match these filters" action={<button className="btn" onClick={() => { setParams({}); setStatus('any') }}>Clear filters</button>} />
      ) : (
        <div className="grid grid-3">
          {list.map((c, i) => {
            const lvl = content.levels.find((l) => l.id === c.level)
            const done = !!state.completedChallenges[c.id]
            return (
              <Reveal key={c.id} delay={(i % 3) * 0.05}>
                <Link to={`/challenges/${c.id}`} className="card card-link stack" style={{ height: '100%', '--gap': '10px' } as CSSProperties}>
                  <div className="row-between">
                    <span className="row" style={{ '--gap': '8px' } as CSSProperties}>
                      <span className="icon-tile icon-tile-sm"><Icon name={CATEGORY_ICON[c.category]} size={16} /></span>
                      <span className="small" style={{ fontWeight: 600 }}>{c.category}</span>
                    </span>
                    {done ? <span className="badge badge-success"><Check size={13} aria-hidden /> Submitted</span> : state.challengeWork[c.id] ? <span className="badge badge-warning">In progress</span> : null}
                  </div>
                  <h2 style={{ fontSize: '1.15rem' }}>{c.title}</h2>
                  <p className="muted small clamp-2" style={{ display: '-webkit-box' }}>{c.brief}</p>
                  <div className="meta" style={{ marginTop: 'auto' }}>
                    {lvl && <LevelBadge level={lvl} />}
                    <span><Gauge size={14} aria-hidden /> {c.difficulty}</span>
                    <span><Clock size={14} aria-hidden /> {formatMinutes(c.minutes)}</span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function ChallengePage() {
  const { challengeId } = useParams()
  const { content } = useContent()
  const { state, saveChallengeWork, completeChallenge } = useLearner()
  const mentor = useMentor()
  const toast = useToast()
  const c = content.challenges.find((x) => x.id === challengeId)
  const work = c ? state.challengeWork[c.id] : undefined
  const [link, setLink] = useState(work?.link ?? '')
  const [notes, setNotes] = useState(work?.notes ?? '')
  const [confirm, setConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [linkError, setLinkError] = useState('')
  const linkId = useId()
  const notesId = useId()
  const timer = useRef<number | undefined>(undefined)
  const checks = useMemo(() => work?.checks ?? [], [work?.checks])

  useEffect(() => {
    setLink(work?.link ?? '')
    setNotes(work?.notes ?? '')
  }, [challengeId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!c)
    return (
      <div className="page">
        <EmptyState icon="Target" title="Challenge not found" action={<Link to="/challenges" className="btn btn-primary">All challenges</Link>} />
      </div>
    )

  const level = content.levels.find((l) => l.id === c.level)
  const done = !!state.completedChallenges[c.id]
  const checkedCount = c.checklist.filter((_, i) => checks[i]).length

  const persist = (patch: Partial<{ link: string; notes: string; checks: boolean[] }>) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => saveChallengeWork(c.id, { link, notes, checks, ...patch }), 400)
  }

  const toggleCheck = (i: number) => {
    const next = c.checklist.map((_, j) => (j === i ? !checks[j] : !!checks[j]))
    saveChallengeWork(c.id, { link, notes, checks: next })
  }

  const validLink = !link || /^https?:\/\/\S+\.\S+/.test(link)
  const canSubmit = (link.trim() || notes.trim()) && validLink

  const submit = async () => {
    setConfirm(false)
    if (!validLink) {
      setLinkError('Enter a full link starting with https://')
      return
    }
    setSubmitting(true)
    try {
      window.clearTimeout(timer.current)
      await completeChallenge(c.id, c.title, link.trim(), notes.trim())
      toast('Challenge submitted — nice work!')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not submit. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page page-narrow">
      <Link to="/challenges" className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-4)', marginLeft: -12 }}>
        <ArrowLeft size={16} aria-hidden /> All challenges
      </Link>
      <header className="stack" style={{ '--gap': '12px', marginBottom: 'var(--space-6)' } as CSSProperties}>
        <span className="row" style={{ '--gap': '8px' } as CSSProperties}>
          {level && <LevelBadge level={level} />}
          <span className="badge">{c.category} challenge</span>
        </span>
        <h1 style={{ fontSize: 'clamp(1.8rem, 1.3rem + 2vw, 2.6rem)' }}>{c.title}</h1>
        <p className="lead">{c.brief}</p>
        <div className="row-between">
          <div className="meta">
            <span><Gauge size={15} aria-hidden /> {c.difficulty}</span>
            <span><Clock size={15} aria-hidden /> About {formatMinutes(c.minutes)}</span>
          </div>
          <BookmarkButton kind="challenge" id={c.id} title={c.title} />
        </div>
      </header>

      <div className="stack" style={{ '--gap': 'var(--space-5)' } as CSSProperties}>
        <section className="card" aria-labelledby="ctx">
          <h2 id="ctx" style={{ fontSize: '1.15rem', marginBottom: 8 }}>User & problem context</h2>
          <p>{inline(c.context)}</p>
        </section>
        <div className="grid grid-2">
          <section className="card" aria-labelledby="req">
            <h2 id="req" style={{ fontSize: '1.15rem', marginBottom: 8 }}>Requirements</h2>
            <ul style={{ paddingLeft: '1.2em', margin: 0 }} className="stack">
              {c.requirements.map((r, i) => <li key={i} style={{ marginTop: 0 }}>{inline(r)}</li>)}
            </ul>
          </section>
          <section className="card" aria-labelledby="con">
            <h2 id="con" style={{ fontSize: '1.15rem', marginBottom: 8 }}>Constraints</h2>
            <ul style={{ paddingLeft: '1.2em', margin: 0 }} className="stack">
              {c.constraints.map((r, i) => <li key={i} style={{ marginTop: 0 }}>{inline(r)}</li>)}
            </ul>
          </section>
        </div>
        <section className="callout callout-tip" aria-labelledby="out">
          <Icon name="Target" size={20} />
          <div>
            <strong id="out" className="callout-title">Expected outcome</strong>
            <p>{inline(c.expectedOutcome)}</p>
          </div>
        </section>

        <section className="card" aria-labelledby="review">
          <div className="row-between" style={{ marginBottom: 8 }}>
            <h2 id="review" style={{ fontSize: '1.15rem' }}>Self-review checklist</h2>
            <span className="subtle">{checkedCount}/{c.checklist.length}</span>
          </div>
          <p className="small muted" style={{ marginBottom: 8 }}>Review your work honestly before submitting. It’s the habit that separates good designers from great ones.</p>
          {c.checklist.map((item, i) => (
            <CheckItem key={i} checked={!!checks[i]} onChange={() => toggleCheck(i)}>{inline(item)}</CheckItem>
          ))}
        </section>

        <section className="card frame" aria-labelledby="submit" style={{ marginTop: 12 }}>
          <span className="frame-handles" />
          <span className="frame-label">Your submission</span>
          <h2 id="submit" style={{ fontSize: '1.15rem', marginBottom: 12 }}>{done ? 'Submitted' : 'Submit your work'}</h2>
          {done && work?.submittedAt && (
            <p className="row small" style={{ marginBottom: 12, '--gap': '6px' } as CSSProperties}>
              <CheckCircle2 size={16} style={{ color: 'var(--c-accent)' }} aria-hidden /> Submitted on {formatDate(work.submittedAt)}. You can update your link and notes below.
            </p>
          )}
          <div className="stack">
            <div className="field">
              <label htmlFor={linkId}>Link to your work</label>
              <input
                id={linkId}
                className="input"
                type="url"
                inputMode="url"
                placeholder="https://www.figma.com/file/…"
                value={link}
                aria-invalid={!!linkError}
                aria-describedby={`${linkId}-hint ${linkError ? `${linkId}-err` : ''}`}
                onChange={(e) => {
                  setLink(e.target.value)
                  setLinkError('')
                  persist({ link: e.target.value })
                }}
                onBlur={() => !validLink && setLinkError('Enter a full link starting with https://')}
              />
              <span id={`${linkId}-hint`} className="hint">Figma, a prototype, a Notion page or a portfolio case study. Make sure sharing is set to “anyone with the link”.</span>
              {linkError && <span id={`${linkId}-err`} className="error" role="alert">{linkError}</span>}
            </div>
            <div className="field">
              <label htmlFor={notesId}>Notes and decisions</label>
              <textarea id={notesId} className="textarea" value={notes} placeholder="What did you decide, what trade-offs did you make, and what would you do next?" onChange={(e) => { setNotes(e.target.value); persist({ notes: e.target.value }) }} />
              <span className="hint">Your draft saves automatically.</span>
            </div>
            <p className="small muted">Your work and checklist are saved in this browser.</p>
            <div className="row">
              <button className="btn btn-primary" disabled={!canSubmit || submitting} onClick={() => (checkedCount < c.checklist.length ? setConfirm(true) : submit())}>
                <Send size={16} aria-hidden /> {submitting ? 'Submitting…' : done ? 'Update submission' : 'Submit challenge'}
              </button>
              {!canSubmit && <span className="subtle">Add a link or notes to submit.</span>}
            </div>
            {mentor.available && done && (
              <p className="small muted">Want detailed feedback? <MentorLink className="">Book a 1:1 with {mentor.name}</MentorLink></p>
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirm}
        title="Submit before finishing your review?"
        body={`You’ve checked ${checkedCount} of ${c.checklist.length} review items. You can still submit — or go back and review first.`}
        confirmLabel="Submit anyway"
        onConfirm={submit}
        onCancel={() => setConfirm(false)}
      />
    </div>
  )
}

