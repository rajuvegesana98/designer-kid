import { Copy, Eye, Plus, Trash2 } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { PromoBar, PromoCard, promoIsActive } from '../../components/Promo'
import { ConfirmDialog, EmptyState, PageHeader } from '../../components/ui'
import type { Promo } from '../../content/types'
import { useToast } from '../../state/ui'
import { FormSection, ImageField, SelectField, TextArea, TextField, Toggle } from '../fields'
import { IllustrationPicker } from '../IllustrationPicker'
import { newId, useAdmin } from '../state'

function status(p: Promo) {
  const today = new Date().toISOString().slice(0, 10)
  if (!p.enabled) return { label: 'Off', cls: '' }
  if (p.startsAt && today < p.startsAt) return { label: `Scheduled · starts ${p.startsAt}`, cls: 'badge-primary' }
  if (p.endsAt && today > p.endsAt) return { label: 'Ended', cls: '' }
  return { label: 'Running', cls: 'badge-success' }
}

export function newPromo(): Promo {
  return {
    id: newId('promo', 'offer'),
    enabled: false,
    style: 'bar',
    title: 'New offer',
    message: 'Describe the offer in one short sentence.',
    ctaLabel: 'Learn more',
    ctaUrl: '/learn',
    image: '',
    illustration: 'career-growth',
    tone: 'primary',
    startsAt: '',
    endsAt: '',
    audience: 'everyone',
    pages: 'all',
    dismissible: true,
    version: 1,
  }
}

export function OffersPage() {
  const { draft, update, openPreview } = useAdmin()
  const toast = useToast()
  const promos = draft.promos ?? []
  const [selected, setSelected] = useState<string | null>(promos[0]?.id ?? null)
  const [confirm, setConfirm] = useState(false)
  const current = promos.find((p) => p.id === selected)
  // Any content edit bumps the version, so visitors who closed the old offer see the new one.
  const set = (fn: (p: Promo) => void, bump = true) =>
    update((d) => {
      const p = d.promos.find((x) => x.id === selected)!
      fn(p)
      if (bump) p.version = (p.version ?? 1) + 1
    })
  const running = promos.filter((p) => promoIsActive(p, { isHome: true, isNewVisitor: true }) || promoIsActive(p, { isHome: true, isNewVisitor: false }))

  return (
    <>
      <PageHeader
        title="Offers & banners"
        eyebrow="Site"
        actions={
          <button
            className="btn btn-primary"
            onClick={() => {
              const p = newPromo()
              update((d) => { d.promos = [p, ...(d.promos ?? [])] })
              setSelected(p.id)
            }}
          >
            <Plus size={16} aria-hidden /> New offer
          </button>
        }
      >
        Show a slim banner or a pop-up when people land on the site. Schedule it, choose who sees it, then Publish.
      </PageHeader>

      {running.length > 1 && <p className="callout callout-warning small" style={{ marginBottom: 'var(--space-4)' }}>{running.length} offers are running. Visitors see the first bar and the first pop-up in this list — switch the others off to keep it calm.</p>}

      <div className="grid admin-split">
        <aside className="card card-tight stack" style={{ alignSelf: 'start', '--gap': '6px' } as CSSProperties} aria-label="Offers">
          {promos.length === 0 && <p className="muted small">No offers yet.</p>}
          {promos.map((p) => {
            const st = status(p)
            return (
              <button key={p.id} className={`tree-item ${selected === p.id ? 'active' : ''}`} onClick={() => setSelected(p.id)}>
                <span className="grow" style={{ textAlign: 'left' }}>
                  {p.title}
                  <span className="subtle" style={{ display: 'block', fontSize: '0.78rem' }}>{p.style === 'bar' ? 'Banner' : 'Pop-up'}</span>
                </span>
                <span className={`badge ${st.cls}`}>{st.label}</span>
              </button>
            )
          })}
        </aside>

        {!current ? (
          <EmptyState icon="Sparkles" title="Create your first offer">Use it for launches, discounts, free review weeks or important news.</EmptyState>
        ) : (
          <div key={current.id} className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
            <div className="row-between">
              <Toggle label={current.enabled ? 'Offer is on' : 'Offer is off'} hint="Takes effect after you publish." checked={current.enabled} onChange={(v) => set((p) => { p.enabled = v }, false)} />
              <div className="row">
                <button className="btn btn-sm" onClick={() => openPreview('/welcome')}><Eye size={15} aria-hidden /> Preview on site</button>
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    const copy = { ...structuredClone(current), id: newId('promo', current.title), title: `${current.title} (copy)`, enabled: false, version: 1 }
                    update((d) => { d.promos = [copy, ...d.promos] })
                    setSelected(copy.id)
                  }}
                >
                  <Copy size={15} aria-hidden /> Duplicate
                </button>
                <button className="btn btn-sm" style={{ color: 'var(--c-danger)' }} onClick={() => setConfirm(true)}><Trash2 size={15} aria-hidden /> Delete</button>
              </div>
            </div>

            <section className="card stack" aria-label="Live preview">
              <span className="eyebrow">Live preview</span>
              {current.style === 'bar' ? (
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--c-line)' }}>
                  <PromoBar promo={current} onDismiss={current.dismissible ? () => {} : undefined} />
                  <div style={{ height: 70, background: 'var(--c-bg)', display: 'grid', placeItems: 'center' }} className="subtle">Your site</div>
                </div>
              ) : (
                <div className="dialog" style={{ margin: '0 auto', boxShadow: 'var(--shadow-2)', maxWidth: 460 }}>
                  <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>{current.title}</h2>
                  <PromoCard promo={current} />
                </div>
              )}
            </section>

            <FormSection title="Content">
              <SelectField<Promo['style']> label="Format" value={current.style} onChange={(v) => set((p) => { p.style = v })} options={[{ value: 'bar', label: 'Banner — slim strip at the top of every page' }, { value: 'popup', label: 'Pop-up — appears shortly after landing' }]} />
              <TextField label="Title" required value={current.title} maxLength={80} onChange={(v) => set((p) => { p.title = v })} />
              <TextArea label="Message" rows={2} value={current.message} onChange={(v) => set((p) => { p.message = v })} />
              <div className="grid grid-2">
                <TextField label="Button label" value={current.ctaLabel} onChange={(v) => set((p) => { p.ctaLabel = v })} />
                <TextField label="Button link" value={current.ctaUrl} hint="e.g. /learn, /blog, /career or https://…" onChange={(v) => set((p) => { p.ctaUrl = v.trim() })} />
              </div>
              <SelectField<Promo['tone']> label="Colour" value={current.tone} onChange={(v) => set((p) => { p.tone = v })} options={[{ value: 'primary', label: 'Brand primary' }, { value: 'secondary', label: 'Secondary' }, { value: 'accent', label: 'Accent' }, { value: 'dark', label: 'Dark' }]} />
              {current.style === 'popup' && (
                <>
                  <ImageField label="Image (optional)" folder="illustrations" hint="Shown at the top of the pop-up. Leave empty to use an illustration." value={current.image} onChange={(v) => set((p) => { p.image = v })} />
                  {!current.image && <IllustrationPicker value={current.illustration} onChange={(v) => set((p) => { p.illustration = v })} />}
                </>
              )}
            </FormSection>

            <FormSection title="Schedule & audience">
              <div className="grid grid-2">
                <TextField label="Starts" type="date" value={current.startsAt} hint="Leave empty to start as soon as you publish." onChange={(v) => set((p) => { p.startsAt = v }, false)} />
                <TextField label="Ends" type="date" value={current.endsAt} hint="Leave empty to run until you switch it off." onChange={(v) => set((p) => { p.endsAt = v }, false)} />
                <SelectField<Promo['audience']> label="Who sees it" value={current.audience} onChange={(v) => set((p) => { p.audience = v }, false)} options={[{ value: 'everyone', label: 'Everyone' }, { value: 'new', label: 'New visitors (haven’t chosen a level)' }, { value: 'returning', label: 'Returning learners' }]} />
                <SelectField<Promo['pages']> label="Where" value={current.pages} onChange={(v) => set((p) => { p.pages = v }, false)} options={[{ value: 'all', label: 'Every page' }, { value: 'home', label: 'Homepage only' }]} />
              </div>
              <Toggle label="Remember when closed" hint="On: once a visitor closes it, they won’t see it again (until you edit the offer). Off: it returns on their next visit." checked={current.dismissible} onChange={(v) => set((p) => { p.dismissible = v }, false)} />
            </FormSection>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm}
        danger
        title={`Delete “${current?.title}”?`}
        body="The offer is removed from the draft. Visitors keep seeing it until you publish."
        confirmLabel="Delete offer"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          update((d) => { d.promos = d.promos.filter((p) => p.id !== selected) })
          setSelected(null)
          setConfirm(false)
          toast('Offer deleted from draft')
        }}
      />
    </>
  )
}
