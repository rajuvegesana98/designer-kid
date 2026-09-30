import { motion } from 'motion/react'
import { Star } from 'lucide-react'
import { useEffect, useId, useState, type CSSProperties, type FormEvent } from 'react'
import { Link } from 'react-router'
import { MentorLink, useMentor } from '../components/MentorLink'
import { EmptyState, formatDate, PageHeader, Reveal, Spinner } from '../components/ui'
import { store, type Review } from '../data'
import { useAuth } from '../state/auth'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { useToast } from '../state/ui'

export function Stars({ value, size = 16, label }: { value: number; size?: number; label?: string }) {
  return (
    <span className="stars" role="img" aria-label={label ?? `${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} aria-hidden fill={i <= Math.round(value) ? 'currentColor' : 'none'} className={i <= Math.round(value) ? 'on' : ''} />
      ))}
    </span>
  )
}

export function useApprovedReviews() {
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const load = () => store.listReviews(false).then(setReviews).catch(() => setReviews([]))
  useEffect(() => {
    void load()
  }, [])
  return { reviews, reload: load }
}

export function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="card stack review-card" style={{ margin: 0, '--gap': '12px' } as CSSProperties}>
      <div className="row-between">
        <Stars value={r.rating} />
        {r.featured && <span className="badge badge-primary">Featured</span>}
      </div>
      <blockquote style={{ margin: 0, fontSize: '1.02rem', whiteSpace: 'pre-wrap' }}>“{r.text}”</blockquote>
      <figcaption className="row" style={{ marginTop: 'auto' }}>
        <span className="avatar">{r.name.trim()[0]?.toUpperCase() ?? '?'}</span>
        <span>
          <strong style={{ display: 'block' }}>{r.name}</strong>
          <span className="subtle">{[r.role, formatDate(r.createdAt, { month: 'short', year: 'numeric' })].filter(Boolean).join(' · ')}</span>
        </span>
      </figcaption>
      {r.reply && (
        <div className="review-reply">
          <strong className="small">Reply</strong>
          <p className="small" style={{ whiteSpace: 'pre-wrap' }}>{r.reply}</p>
        </div>
      )}
    </figure>
  )
}

function average(list: Review[]) {
  return list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0
}

/** Compact reviews strip for the homepage. */
export function ReviewsSection() {
  const { content } = useContent()
  const { reviews } = useApprovedReviews()
  const settings = content.reviews
  if (!settings?.enabled || !settings.showOnHome || !reviews?.length) return null
  const shown = reviews.slice(0, 6)
  const avg = average(reviews)
  return (
    <section className="page" aria-labelledby="reviews-home-title">
      <Reveal className="row-between" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="stack" style={{ '--gap': '8px' } as CSSProperties}>
          <span className="eyebrow">Reviews</span>
          <h2 id="reviews-home-title">{settings.title}</h2>
          <span className="row" style={{ '--gap': '8px' } as CSSProperties}>
            <Stars value={avg} size={18} /> <strong>{avg.toFixed(1)}</strong> <span className="muted">from {reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
          </span>
        </div>
        <Link to="/reviews" className="btn">Read all & write a review</Link>
      </Reveal>
      <div className="grid grid-3">
        {shown.map((r, i) => (
          <Reveal key={r.id} delay={(i % 3) * 0.06}>
            <ReviewCard r={r} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ReviewForm({ onDone }: { onDone: () => void }) {
  const { content } = useContent()
  const { user, mode } = useAuth()
  const { state } = useLearner()
  const toast = useToast()
  const [name, setName] = useState(state.name || user?.name || '')
  const [role, setRole] = useState('')
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState<null | 'pending' | 'approved'>(null)
  const ids = { name: useId(), role: useId(), text: useId(), consent: useId() }

  if (mode === 'supabase' && !user)
    return (
      <div className="card stack">
        <h2 style={{ fontSize: '1.2rem' }}>Write a review</h2>
        <p className="muted">Please sign in so we can keep reviews genuine. It takes a minute.</p>
        <Link to="/account?next=/reviews" className="btn btn-primary" style={{ width: 'fit-content' }}>Sign in to write a review</Link>
      </div>
    )

  if (sent)
    return (
      <motion.div className="card stack" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <h2 style={{ fontSize: '1.2rem' }}>Thank you for your review</h2>
        <p className="muted">{sent === 'pending' ? 'It will appear here once it has been approved.' : 'It’s now live on the page.'}</p>
      </motion.div>
    )

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Please add your name.')
    if (!rating) return setError('Please choose a star rating.')
    if (text.trim().length < 20) return setError('Please write at least 20 characters so the review is useful to others.')
    if (!consent) return setError('Please confirm your review can be shown publicly.')
    setBusy(true)
    try {
      const r = await store.submitReview({ name: name.trim(), role: role.trim(), rating, text: text.trim() }, user, !content.reviews.requireApproval)
      setSent(r.status === 'approved' ? 'approved' : 'pending')
      toast('Review sent — thank you!')
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your review.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card stack" onSubmit={submit} noValidate aria-labelledby="write-review">
      <h2 id="write-review" style={{ fontSize: '1.2rem' }}>Write a review</h2>
      <p className="muted small">{content.reviews.prompt}</p>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="label" style={{ marginBottom: 6 }}>Your rating</legend>
        <div className="star-input" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} type="button" role="radio" aria-checked={rating === i} aria-label={`${i} star${i > 1 ? 's' : ''}`} className={i <= rating ? 'on' : ''} onClick={() => setRating(i)}>
              <Star size={28} fill={i <= rating ? 'currentColor' : 'none'} aria-hidden />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid grid-2">
        <div className="field">
          <label htmlFor={ids.name}>Name shown with the review</label>
          <input id={ids.name} className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor={ids.role}>Role (optional)</label>
          <input id={ids.role} className="input" value={role} onChange={(e) => setRole(e.target.value)} maxLength={80} placeholder="e.g. Junior Product Designer" />
        </div>
      </div>
      <div className="field">
        <label htmlFor={ids.text}>Your review</label>
        <textarea id={ids.text} className="textarea" rows={5} value={text} onChange={(e) => setText(e.target.value)} maxLength={1200} placeholder="What did you work on together, and what changed for you?" />
        <span className="hint">{text.length}/1200</span>
      </div>
      <label className="row small" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', cursor: 'pointer' }}>
        <input id={ids.consent} type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18 }} />
        <span>I agree this review, my name and role can be shown publicly on Designer Kid.</span>
      </label>
      {error && <p role="alert" style={{ color: 'var(--c-danger)', fontWeight: 500 }}>{error}</p>}
      <button className="btn btn-primary" disabled={busy} style={{ width: 'fit-content' }}>{busy ? 'Sending…' : 'Submit review'}</button>
    </form>
  )
}

export function ReviewsPage() {
  const { content } = useContent()
  const mentor = useMentor()
  const { reviews, reload } = useApprovedReviews()
  const settings = content.reviews
  if (!settings?.enabled)
    return (
      <div className="page">
        <EmptyState icon="Star" title="Reviews are switched off">Check back soon.</EmptyState>
      </div>
    )
  const avg = reviews ? average(reviews) : 0
  return (
    <div className="page">
      <PageHeader eyebrow="Reviews" title={settings.title} actions={mentor.available && <MentorLink className="btn" />}>
        Honest feedback from learners who worked with {mentor.name}.
      </PageHeader>
      <div className="grid reviews-layout">
        <div className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
          {reviews && reviews.length > 0 && (
            <div className="card row" style={{ gap: 'var(--space-5)' }}>
              <span className="stat-value" style={{ fontSize: '2.6rem' }}>{avg.toFixed(1)}</span>
              <span className="stack" style={{ '--gap': '4px' } as CSSProperties}>
                <Stars value={avg} size={20} />
                <span className="muted">{reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
              </span>
            </div>
          )}
          {!reviews ? (
            <Spinner />
          ) : reviews.length === 0 ? (
            <EmptyState icon="Star" title="No reviews yet">Be the first to share how a session or course helped you.</EmptyState>
          ) : (
            <div className="grid grid-2">
              {reviews.map((r) => <ReviewCard key={r.id} r={r} />)}
            </div>
          )}
        </div>
        <aside>
          <div style={{ position: 'sticky', top: 'calc(var(--topbar-h) + 16px)' }}>
            <ReviewForm onDone={reload} />
          </div>
        </aside>
      </div>
    </div>
  )
}

