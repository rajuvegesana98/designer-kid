import { Eye } from 'lucide-react'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { PageHeader, Tabs } from '../../components/ui'
import type { FooterLink, SiteContent } from '../../content/types'
import { ICON_NAMES } from '../../lib/icons'
import { AddButton, FormSection, ImageField, SelectField, SortableList, TextArea, TextField, Toggle } from '../fields'
import { newId, useAdmin } from '../state'

type Tab = 'home' | 'nav' | 'footer'

/** Generic list-of-objects editor: drag to reorder, expand to edit, delete. */
export function Repeater<T extends { id: string }>({ items, label, summary, onChange, create, editor, addLabel }: { items: T[]; label: string; summary: (t: T) => ReactNode; onChange: (next: T[]) => void; create: () => T; editor: (t: T, set: (fn: (t: T) => void) => void) => ReactNode; addLabel: string }) {
  const [open, setOpen] = useState<string | null>(null)
  const setItem = (id: string) => (fn: (t: T) => void) =>
    onChange(
      items.map((x) => {
        if (x.id !== id) return x
        const c = structuredClone(x)
        fn(c)
        return c
      }),
    )
  return (
    <div className="stack" style={{ '--gap': '10px' } as CSSProperties}>
      {items.length === 0 && <p className="muted small">None yet.</p>}
      <SortableList
        label={label}
        items={items}
        keys={items.map((i) => i.id)}
        onReorder={onChange}
        onRemove={(i) => onChange(items.filter((_, j) => j !== i))}
        render={(t) => (
          <div className="stack" style={{ '--gap': '8px' } as CSSProperties}>
            <button type="button" className="tree-item" aria-expanded={open === t.id} onClick={() => setOpen(open === t.id ? null : t.id)}>
              <span className="grow" style={{ textAlign: 'left' }}>{summary(t)}</span>
            </button>
            {open === t.id && <div className="stack" style={{ padding: '0 8px 8px' }}>{editor(t, setItem(t.id))}</div>}
          </div>
        )}
      />
      <div>
        <AddButton
          onClick={() => {
            const t = create()
            onChange([...items, t])
            setOpen(t.id)
          }}
        >
          {addLabel}
        </AddButton>
      </div>
    </div>
  )
}

export function WebsitePage() {
  const { draft, update, openPreview } = useAdmin()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'home'
  const h = draft.home
  const setHome = (fn: (h: SiteContent['home']) => void) => update((d) => fn(d.home))

  return (
    <>
      <PageHeader title="Website" eyebrow="Site" actions={<button className="btn" onClick={() => openPreview('/welcome')}><Eye size={16} aria-hidden /> Preview homepage</button>}>
        Edit the homepage, navigation and footer. Changes stay in your draft until you publish.
      </PageHeader>
      <Tabs<Tab> id="web" label="Website section" value={tab} onChange={(v) => setParams({ tab: v }, { replace: true })} tabs={[{ value: 'home', label: 'Homepage' }, { value: 'nav', label: 'Navigation' }, { value: 'footer', label: 'Footer' }]} />
      <div id="web-panel" role="tabpanel" className="stack" style={{ marginTop: 'var(--space-5)', '--gap': 'var(--space-4)' } as CSSProperties}>
        {tab === 'home' && (
          <>
            <FormSection title="Hero">
              <TextField label="Eyebrow" value={h.eyebrow} onChange={(v) => setHome((x) => { x.eyebrow = v })} />
              <TextField label="Hero title" required value={h.heroTitle} onChange={(v) => setHome((x) => { x.heroTitle = v })} />
              <TextArea label="Hero description" rows={3} value={h.heroDescription} onChange={(v) => setHome((x) => { x.heroDescription = v })} />
              <div className="grid grid-2">
                <TextField label="Primary CTA label" value={h.ctaLabel} onChange={(v) => setHome((x) => { x.ctaLabel = v })} />
                <TextField label="Secondary CTA label" value={h.secondaryCtaLabel} onChange={(v) => setHome((x) => { x.secondaryCtaLabel = v })} />
              </div>
              <ImageField label="Hero image (optional)" folder="illustrations" hint="Leave empty to use the built-in animated illustration." value={h.heroImage} onChange={(v) => setHome((x) => { x.heroImage = v })} />
            </FormSection>
            <FormSection title="Feature sections">
              <Repeater
                label="Features"
                addLabel="Add feature"
                items={h.features}
                onChange={(next) => setHome((x) => { x.features = next })}
                summary={(f) => f.title}
                create={() => ({ id: newId('f'), title: 'New feature', body: '', icon: 'Sparkles' })}
                editor={(f, set) => (
                  <>
                    <TextField label="Title" value={f.title} onChange={(v) => set((x) => { x.title = v })} />
                    <TextArea label="Body" rows={2} value={f.body} onChange={(v) => set((x) => { x.body = v })} />
                    <SelectField label="Icon" value={f.icon} onChange={(v) => set((x) => { x.icon = v })} options={ICON_NAMES.map((n) => ({ value: n, label: n }))} />
                  </>
                )}
              />
            </FormSection>
            <FormSection title="Statistics" description="Only add real, current numbers you can stand behind. The section is hidden while empty.">
              <Repeater
                label="Statistics"
                addLabel="Add statistic"
                items={h.stats}
                onChange={(next) => setHome((x) => { x.stats = next })}
                summary={(s) => `${s.value || '—'} ${s.label}`}
                create={() => ({ id: newId('s'), label: '', value: '' })}
                editor={(s, set) => (
                  <div className="grid grid-2">
                    <TextField label="Value" value={s.value} onChange={(v) => set((x) => { x.value = v })} />
                    <TextField label="Label" value={s.label} onChange={(v) => set((x) => { x.label = v })} />
                  </div>
                )}
              />
            </FormSection>
            <FormSection title="Testimonials" description="Only use real quotes with the person’s permission. The section is hidden while empty.">
              <Repeater
                label="Testimonials"
                addLabel="Add testimonial"
                items={h.testimonials}
                onChange={(next) => setHome((x) => { x.testimonials = next })}
                summary={(t) => t.name || 'Unnamed'}
                create={() => ({ id: newId('t'), quote: '', name: '', role: '', photo: '' })}
                editor={(t, set) => (
                  <>
                    <TextArea label="Quote" rows={3} value={t.quote} onChange={(v) => set((x) => { x.quote = v })} />
                    <div className="grid grid-2">
                      <TextField label="Name" value={t.name} onChange={(v) => set((x) => { x.name = v })} />
                      <TextField label="Role" value={t.role} onChange={(v) => set((x) => { x.role = v })} />
                    </div>
                    <ImageField label="Photo" folder="profiles" value={t.photo} onChange={(v) => set((x) => { x.photo = v })} />
                  </>
                )}
              />
            </FormSection>
            <FormSection title="FAQ">
              <Repeater
                label="FAQ"
                addLabel="Add question"
                items={h.faq}
                onChange={(next) => setHome((x) => { x.faq = next })}
                summary={(q) => q.question || 'New question'}
                create={() => ({ id: newId('q'), question: '', answer: '' })}
                editor={(q, set) => (
                  <>
                    <TextField label="Question" value={q.question} onChange={(v) => set((x) => { x.question = v })} />
                    <TextArea label="Answer" rows={3} value={q.answer} onChange={(v) => set((x) => { x.answer = v })} />
                  </>
                )}
              />
            </FormSection>
          </>
        )}

        {tab === 'nav' && (
          <FormSection title="Main navigation" description="Order, rename or hide menu items. Paths starting with https:// open in a new tab. “1:1 Connect” and “Profile” are always added automatically.">
            <Repeater
              label="Menu items"
              addLabel="Add menu link"
              items={draft.navigation}
              onChange={(next) => update((d) => { d.navigation = next })}
              summary={(n) => (
                <>
                  {n.label} <span className="subtle">{n.path}</span> {!n.visible && <span className="badge">Hidden</span>}
                </>
              )}
              create={() => ({ id: newId('nav'), label: 'New link', path: 'https://', visible: true })}
              editor={(n, set) => (
                <>
                  <div className="grid grid-2">
                    <TextField label="Label" required value={n.label} onChange={(v) => set((x) => { x.label = v })} />
                    <TextField label="Link" value={n.path} onChange={(v) => set((x) => { x.path = v })} hint="e.g. /learn or https://example.com" />
                  </div>
                  <Toggle label="Visible" checked={n.visible} onChange={(v) => set((x) => { x.visible = v })} />
                </>
              )}
            />
          </FormSection>
        )}

        {tab === 'footer' && (
          <>
            <FormSection title="Footer links">
              <LinkRepeater items={draft.footer.links} onChange={(v) => update((d) => { d.footer.links = v })} label="Footer links" />
            </FormSection>
            <FormSection title="Social links">
              <LinkRepeater items={draft.footer.social} onChange={(v) => update((d) => { d.footer.social = v })} label="Social links" />
            </FormSection>
            <FormSection title="Copyright & contact">
              <TextField label="Copyright" value={draft.footer.copyright} onChange={(v) => update((d) => { d.footer.copyright = v })} />
              <TextField label="Contact email" type="email" value={draft.footer.email} onChange={(v) => update((d) => { d.footer.email = v })} />
            </FormSection>
          </>
        )}
      </div>
    </>
  )
}

function LinkRepeater({ items, onChange, label }: { items: FooterLink[]; onChange: (v: FooterLink[]) => void; label: string }) {
  return (
    <Repeater
      label={label}
      addLabel="Add link"
      items={items}
      onChange={onChange}
      summary={(l) => <>{l.label} <span className="subtle">{l.url}</span></>}
      create={() => ({ id: newId('l'), label: 'New link', url: 'https://' })}
      editor={(l, set) => (
        <div className="grid grid-2">
          <TextField label="Label" value={l.label} onChange={(v) => set((x) => { x.label = v })} />
          <TextField label="URL" value={l.url} onChange={(v) => set((x) => { x.url = v })} />
        </div>
      )}
    />
  )
}
