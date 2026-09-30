import { Check, EyeOff, Pin, PinOff, Trash2 } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { ConfirmDialog, EmptyState, formatDate, PageHeader, Spinner, Tabs } from '../../components/ui'
import { store, type Review, type ReviewStatus } from '../../data'
import { Stars } from '../../pages/Reviews'
import { useToast } from '../../state/ui'
import { FormSection, TextArea, TextField, Toggle } from '../fields'
import { useAdmin } from '../state'

type Filter = ReviewStatus | 'all'

/**
 * Moderation happens instantly (it isn't part of the content draft), so
 * approving or hiding a review takes effect for students straight away.
 */
export function ReviewsAdmin() {
  const { draft, update, openPreview } = useAdmin()
  const toast = useToast()
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const [filter, setFilter] = useState<Filter>('pending')
  const [confirm, setConfirm] = useState<Review | null>(null)
  const [replies, setReplies] = useState<Record<string, string>>({})
  const settings = draft.reviews

  const load = () =>
    store
      .listReviews(true)
      .then(setReviews)
      .catch((e) => {
        setReviews([])
        toast(e instanceof Error ? e.message : 'Could not load reviews', 'error')
      })
  useEffect(() => {
    void load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (r: Review, patch: Partial<Pick<Review, 'status' | 'featured' | 'reply'>>, message: string) => {
    try {
      await store.updateReview(r.id, patch)
      setReviews((list) => list?.map((x) => (x.id === r.id ? { ...x, ...patch } : x)) ?? null)
      toast(message)
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Action failed', 'error')
    }
  }

  const counts = (s: Filter) => (reviews ?? []).filter((r) => s === 'all' || r.status === s).length
  const list = (reviews ?? []).filter((r) => filter === 'all' || r.status === filter)
  const approved = (reviews ?? []).filter((r) => r.status === 'approved')
  const avg = approved.length ? approved.reduce((s, r) => s + r.rating, 0) / approved.length : 0

  return (
    <>
      <PageHeader title="Reviews" eyebrow="People" actions={<button className="btn" onClick={() => openPreview('/reviews')}>Preview reviews page</button>}>
        Learners write reviews about you. Approve, hide, feature or reply — moderation takes effect immediately.
      </PageHeader>
      <div className="grid admin-split">
        <div className="stack" style={{ alignSelf: 'start', '--gap': 'var(--space-4)' } as CSSProperties}>
          <FormSection title="Summary">
            <div className="row" style={{ gap: 'var(--space-5)' }}>
              <span className="stat"><span className="stat-value">{avg ? avg.toFixed(1) : '—'}</span><span className="stat-label">Average rating</span></span>
              <span className="stat"><span className="stat-value">{approved.length}</span><span className="stat-label">Live</span></span>
              <span className="stat"><span className="stat-value">{counts('pending')}</span><span className="stat-label">Waiting</span></span>
            </div>
          </FormSection>
          <FormSection title="Settings" description="Settings are part of your draft — publish to apply them.">
            <Toggle label="Allow reviews" checked={settings.enabled} onChange={(v) => update((d) => { d.reviews.enabled = v })} />
            <Toggle label="Approve before showing" hint="Recommended. New reviews wait in “Pending” until you approve them." checked={settings.requireApproval} onChange={(v) => update((d) => { d.reviews.requireApproval = v })} />
            <Toggle label="Show on homepage" checked={settings.showOnHome} onChange={(v) => update((d) => { d.reviews.showOnHome = v })} />
            <TextField label="Section title" value={settings.title} onChange={(v) => update((d) => { d.reviews.title = v })} />
            <TextArea label="Prompt shown above the form" rows={3} value={settings.prompt} onChange={(v) => update((d) => { d.reviews.prompt = v })} />
          </FormSection>
        </div>

        <div className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
          <Tabs<Filter>
            id="rev"
            label="Review status"
            value={filter}
            onChange={setFilter}
            tabs={[
              { value: 'pending', label: `Pending (${counts('pending')})` },
              { value: 'approved', label: `Approved (${counts('approved')})` },
              { value: 'hidden', label: `Hidden (${counts('hidden')})` },
              { value: 'all', label: 'All' },
            ]}
          />
          {!reviews ? (
            <Spinner />
          ) : list.length === 0 ? (
            <EmptyState icon="Star" title={filter === 'pending' ? 'Nothing waiting for approval' : 'No reviews here'}>
              {store.mode === 'local' ? 'In browser-only mode you’ll only see reviews written in this browser.' : 'New reviews from learners appear in Pending.'}
            </EmptyState>
          ) : (
            list.map((r) => (
              <article key={r.id} className="card stack" style={{ '--gap': '10px' } as CSSProperties}>
                <div className="row-between">
                  <span className="row">
                    <Stars value={r.rating} />
                    <strong>{r.name}</strong>
                    {r.role && <span className="subtle">{r.role}</span>}
                  </span>
                  <span className="row" style={{ '--gap': '6px' } as CSSProperties}>
                    <span className={`badge ${r.status === 'approved' ? 'badge-success' : r.status === 'pending' ? 'badge-warning' : ''}`}>{r.status}</span>
                    {r.featured && <span className="badge badge-primary">Featured</span>}
                    <span className="subtle">{formatDate(r.createdAt)}</span>
                  </span>
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{r.text}</p>
                <div className="field">
                  <label htmlFor={`reply-${r.id}`}>Public reply (optional)</label>
                  <textarea id={`reply-${r.id}`} className="textarea" rows={2} style={{ minHeight: 60 }} value={replies[r.id] ?? r.reply} onChange={(e) => setReplies((x) => ({ ...x, [r.id]: e.target.value }))} placeholder="Thank the learner or add context" />
                </div>
                <div className="row">
                  {r.status !== 'approved' && <button className="btn btn-primary btn-sm" onClick={() => act(r, { status: 'approved' }, 'Review approved — it’s live')}><Check size={15} aria-hidden /> Approve</button>}
                  {r.status !== 'hidden' && <button className="btn btn-sm" onClick={() => act(r, { status: 'hidden', featured: false }, 'Review hidden')}><EyeOff size={15} aria-hidden /> Hide</button>}
                  {r.status === 'approved' && (
                    <button className="btn btn-sm" onClick={() => act(r, { featured: !r.featured }, r.featured ? 'Removed from featured' : 'Featured on the homepage')}>
                      {r.featured ? <PinOff size={15} aria-hidden /> : <Pin size={15} aria-hidden />} {r.featured ? 'Unfeature' : 'Feature'}
                    </button>
                  )}
                  {(replies[r.id] ?? r.reply) !== r.reply && <button className="btn btn-soft btn-sm" onClick={() => act(r, { reply: (replies[r.id] ?? '').trim() }, 'Reply saved')}>Save reply</button>}
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--c-danger)', marginLeft: 'auto' }} onClick={() => setConfirm(r)}><Trash2 size={15} aria-hidden /> Delete</button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
      <ConfirmDialog
        open={!!confirm}
        danger
        title="Delete this review?"
        body="It will be permanently removed. To keep it but stop showing it, use Hide instead."
        confirmLabel="Delete review"
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          const r = confirm!
          setConfirm(null)
          try {
            await store.deleteReview(r.id)
            setReviews((list) => list?.filter((x) => x.id !== r.id) ?? null)
            toast('Review deleted')
          } catch (e) {
            toast(e instanceof Error ? e.message : 'Delete failed', 'error')
          }
        }}
      />
    </>
  )
}
