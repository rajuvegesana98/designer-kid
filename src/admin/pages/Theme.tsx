import { Check, Eye, RotateCcw, X } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { BrandMark } from '../../components/Brand'
import { ConfirmDialog, PageHeader, Tabs } from '../../components/ui'
import type { Theme, ThemeColors } from '../../content/types'
import { contrastRatio, ensureFonts, FONT_OPTIONS, onColor, themeVars } from '../../lib/theme'
import { loadSeed } from '../../state/content'
import { ColorField, FormSection, ImageField, NumberField, SelectField, TextField } from '../fields'
import { useAdmin } from '../state'

const COLOR_KEYS: { key: keyof ThemeColors; label: string; hint: string }[] = [
  { key: 'primary', label: 'Primary', hint: 'Buttons, links, active states.' },
  { key: 'secondary', label: 'Secondary', hint: 'Highlights and decorative accents.' },
  { key: 'accent', label: 'Accent', hint: 'Success and completion.' },
  { key: 'background', label: 'Background', hint: 'Page background.' },
  { key: 'surface', label: 'Surface', hint: 'Cards, panels and inputs.' },
  { key: 'text', label: 'Text', hint: 'Body copy and headings.' },
]

const PRESETS: { name: string; light: ThemeColors; dark: ThemeColors; heading?: string; body?: string }[] = [
  {
    name: 'Designer Kid',
    light: { primary: '#4F3FF0', secondary: '#E8590C', accent: '#0E9F6E', background: '#F5F4EF', surface: '#FFFFFF', text: '#16171D' },
    dark: { primary: '#9D94FF', secondary: '#FF9E6B', accent: '#3DD6A3', background: '#0D0E13', surface: '#171820', text: '#F1F1F4' },
    heading: 'Bricolage Grotesque',
    body: 'Instrument Sans',
  },
  {
    name: 'Ocean',
    light: { primary: '#0B63CE', secondary: '#0E9AA7', accent: '#0E9F6E', background: '#F3F6FA', surface: '#FFFFFF', text: '#0F172A' },
    dark: { primary: '#6CB2FF', secondary: '#4FD1C5', accent: '#3DD6A3', background: '#0B1220', surface: '#121A2B', text: '#E8EEF7' },
    heading: 'Sora',
    body: 'Inter',
  },
  {
    name: 'Forest',
    light: { primary: '#15803D', secondary: '#CA8A04', accent: '#0E7490', background: '#F4F6F1', surface: '#FFFFFF', text: '#14201A' },
    dark: { primary: '#4ADE80', secondary: '#FACC15', accent: '#22D3EE', background: '#0C130F', surface: '#142019', text: '#E7F2EA' },
    heading: 'Fraunces',
    body: 'Work Sans',
  },
  {
    name: 'Sunset',
    light: { primary: '#C2410C', secondary: '#DB2777', accent: '#7C3AED', background: '#FBF6F1', surface: '#FFFFFF', text: '#1F1512' },
    dark: { primary: '#FB923C', secondary: '#F472B6', accent: '#A78BFA', background: '#140E0B', surface: '#1E1612', text: '#F6EDE6' },
    heading: 'Outfit',
    body: 'DM Sans',
  },
  {
    name: 'Mono',
    light: { primary: '#18181B', secondary: '#71717A', accent: '#16A34A', background: '#F7F7F5', surface: '#FFFFFF', text: '#18181B' },
    dark: { primary: '#FAFAFA', secondary: '#A1A1AA', accent: '#4ADE80', background: '#0A0A0B', surface: '#161618', text: '#F4F4F5' },
    heading: 'Space Grotesk',
    body: 'IBM Plex Sans',
  },
  {
    name: 'Grape',
    light: { primary: '#7E22CE', secondary: '#DB2777', accent: '#0D9488', background: '#F8F5FB', surface: '#FFFFFF', text: '#1A1523' },
    dark: { primary: '#C084FC', secondary: '#F472B6', accent: '#2DD4BF', background: '#110D16', surface: '#1A1422', text: '#F1ECF7' },
    heading: 'Plus Jakarta Sans',
    body: 'Figtree',
  },
]

function BrandPreview({ name, tagline, logo, favicon }: { name: string; tagline: string; logo: string; favicon: string }) {
  return (
    <div className="card card-flat stack" style={{ '--gap': '12px' } as CSSProperties}>
      <span className="eyebrow">Brand preview</span>
      <div className="row" style={{ flexWrap: 'nowrap' }}>
        {logo ? <img src={logo} alt="" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 10 }} /> : <BrandMark size={40} />}
        <span>
          <strong style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>{name || 'Brand name'}</strong>
          <span className="subtle">{tagline}</span>
        </span>
      </div>
      <div className="favicon-tab" aria-label="Browser tab preview">
        {favicon ? <img src={favicon} alt="" width={16} height={16} /> : <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={16} height={16} />}
        <span>{name} — {tagline}</span>
      </div>
    </div>
  )
}

function ContrastRow({ label, a, b, min }: { label: string; a: string; b: string; min: number }) {
  const r = contrastRatio(a, b)
  const pass = r >= min
  return (
    <li className="row-between small" style={{ padding: '6px 0' }}>
      <span className="row" style={{ '--gap': '8px' } as CSSProperties}>
        <span aria-hidden style={{ width: 28, height: 20, borderRadius: 6, background: b, color: a, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11, border: '1px solid var(--c-line)' }}>Aa</span>
        {label}
      </span>
      <span className={`badge ${pass ? 'badge-success' : 'badge-danger'}`}>
        {pass ? <Check size={12} aria-hidden /> : <X size={12} aria-hidden />} {r.toFixed(2)}:1 {pass ? 'pass' : `needs ${min}:1`}
      </span>
    </li>
  )
}

function ThemePreview({ theme, mode }: { theme: Theme; mode: 'light' | 'dark' }) {
  const vars = themeVars(theme, mode) as CSSProperties
  return (
    <div data-mode={mode} style={{ ...vars, background: 'var(--c-bg)', color: 'var(--c-text)', fontFamily: 'var(--font-body)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh)', borderRadius: 16, padding: 20, border: '1px solid var(--c-line)' } as CSSProperties} className="canvas-bg stack">
      <span className="eyebrow">Live preview · {mode}</span>
      <h2 style={{ fontSize: '1.6rem' }}>Build a button that grows with its label</h2>
      <p className="muted">Auto Layout lets frames resize with their content, so your designs stay consistent.</p>
      <div className="row">
        <button className="btn btn-primary" type="button">Continue lesson</button>
        <button className="btn" type="button">Secondary</button>
        <button className="btn btn-soft" type="button">Soft</button>
      </div>
      <div className="card stack" style={{ '--gap': '10px' } as CSSProperties}>
        <div className="row-between">
          <strong>Figma Fundamentals</strong>
          <span className="badge badge-primary">In progress</span>
        </div>
        <div className="progress" style={{ '--c-level': 'var(--c-primary)' } as CSSProperties}><span style={{ width: '62%' }} /></div>
        <span className="subtle">9 of 14 lessons</span>
      </div>
      <div className="field">
        <label htmlFor="preview-input">Input label</label>
        <input id="preview-input" className="input" placeholder="Placeholder text" />
      </div>
      <div className="row">
        <span className="badge badge-success">Completed</span>
        <span className="badge" style={{ background: 'var(--c-secondary-soft)', color: 'var(--c-text)' }}>Secondary</span>
        <a href="#preview" onClick={(e) => e.preventDefault()}>A text link</a>
      </div>
    </div>
  )
}

export function ThemePage() {
  const { draft, update, openPreview } = useAdmin()
  const t = draft.theme
  const [editMode, setEditMode] = useState<'light' | 'dark'>('light')
  const [confirmReset, setConfirmReset] = useState(false)
  const set = (fn: (t: Theme) => void) => update((d) => fn(d.theme))
  const colors = t[editMode]
  useEffect(() => ensureFonts([t.fonts.heading, t.fonts.body]), [t.fonts.heading, t.fonts.body])

  return (
    <>
      <PageHeader
        title="Theme"
        eyebrow="Site"
        actions={
          <>
            <button className="btn" onClick={() => setConfirmReset(true)}><RotateCcw size={16} aria-hidden /> Reset to defaults</button>
            <button className="btn" onClick={() => openPreview('/')}><Eye size={16} aria-hidden /> Preview full site</button>
          </>
        }
      >
        Brand, colours, typography and shape. The preview updates as you edit; students see changes only after you publish.
      </PageHeader>
      <div className="grid theme-split">
        <div className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
          <FormSection title="Brand">
            <div className="grid grid-2">
              <TextField label="Brand name" required value={draft.brand.name} onChange={(v) => update((d) => { d.brand.name = v })} />
              <TextField label="Tagline" value={draft.brand.tagline} onChange={(v) => update((d) => { d.brand.tagline = v })} />
              <ImageField label="Logo" folder="brand" hint="Square PNG or SVG works best. Empty = default mark." value={draft.brand.logoUrl} onChange={(v) => update((d) => { d.brand.logoUrl = v })} />
              <ImageField label="Favicon" folder="brand" hint="Square, at least 64×64." value={draft.brand.faviconUrl} onChange={(v) => update((d) => { d.brand.faviconUrl = v })} />
            </div>
          </FormSection>

          <FormSection title="Quick themes" description="Apply a complete palette and font pairing in one click — then fine-tune below. Nothing changes for students until you publish.">
            <div className="preset-grid">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className="preset"
                  onClick={() =>
                    set((th) => {
                      th.light = { ...p.light }
                      th.dark = { ...p.dark }
                      if (p.heading) th.fonts.heading = p.heading
                      if (p.body) th.fonts.body = p.body
                    })
                  }
                >
                  <span className="preset-swatches" aria-hidden>
                    {[p.light.primary, p.light.secondary, p.light.accent, p.dark.background].map((c) => <span key={c} style={{ background: c }} />)}
                  </span>
                  <strong>{p.name}</strong>
                  <span className="subtle" style={{ fontSize: '0.75rem' }}>{p.heading} · {p.body}</span>
                </button>
              ))}
            </div>
          </FormSection>

          <FormSection title="Colours" actions={<Tabs id="cmode" label="Colour mode" value={editMode} onChange={setEditMode} tabs={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />}>
            <div className="grid grid-2">
              {COLOR_KEYS.map((c) => (
                <ColorField key={`${editMode}-${c.key}`} label={c.label} hint={c.hint} value={colors[c.key]} onChange={(v) => set((th) => { th[editMode][c.key] = v })} />
              ))}
            </div>
            <div>
              <strong className="small">Accessibility checks ({editMode})</strong>
              <ul className="list">
                <ContrastRow label="Text on background" a={colors.text} b={colors.background} min={4.5} />
                <ContrastRow label="Text on surface" a={colors.text} b={colors.surface} min={4.5} />
                <ContrastRow label="Button text on primary" a={onColor(colors.primary)} b={colors.primary} min={4.5} />
                <ContrastRow label="Primary links on surface" a={colors.primary} b={colors.surface} min={3} />
              </ul>
            </div>
          </FormSection>

          <FormSection title="Typography">
            <div className="grid grid-2">
              <SelectField label="Heading font" value={t.fonts.heading} onChange={(v) => set((th) => { th.fonts.heading = v })} options={FONT_OPTIONS.map((f) => ({ value: f, label: f }))} />
              <SelectField label="Body font" value={t.fonts.body} onChange={(v) => set((th) => { th.fonts.body = v })} options={FONT_OPTIONS.map((f) => ({ value: f, label: f }))} />
              <NumberField label="Base font size" suffix="px" min={14} max={20} value={t.fonts.baseSize} onChange={(v) => set((th) => { th.fonts.baseSize = v })} hint="16px is recommended for readability." />
              <NumberField label="Line height" min={1.2} max={2} step={0.05} value={t.fonts.lineHeight} onChange={(v) => set((th) => { th.fonts.lineHeight = v })} />
              <SelectField label="Heading weight" value={String(t.fonts.headingWeight)} onChange={(v) => set((th) => { th.fonts.headingWeight = Number(v) })} options={['500', '600', '700', '800'].map((w) => ({ value: w, label: w }))} />
              <SelectField label="Body weight" value={String(t.fonts.bodyWeight)} onChange={(v) => set((th) => { th.fonts.bodyWeight = Number(v) })} options={['400', '500'].map((w) => ({ value: w, label: w }))} />
            </div>
          </FormSection>

          <FormSection title="Shape & depth">
            <div className="grid grid-2">
              <NumberField label="Base radius" suffix="px" min={0} max={24} value={t.radius.base} onChange={(v) => set((th) => { th.radius.base = v })} />
              <NumberField label="Button radius" suffix="px" min={0} max={999} value={t.radius.button} onChange={(v) => set((th) => { th.radius.button = v })} />
              <NumberField label="Card radius" suffix="px" min={0} max={40} value={t.radius.card} onChange={(v) => set((th) => { th.radius.card = v })} />
              <SelectField<Theme['shadow']> label="Shadows" value={t.shadow} onChange={(v) => set((th) => { th.shadow = v })} options={[{ value: 'none', label: 'None' }, { value: 'soft', label: 'Soft' }, { value: 'medium', label: 'Medium' }, { value: 'strong', label: 'Strong' }]} />
              <SelectField<Theme['border']> label="Borders" value={t.border} onChange={(v) => set((th) => { th.border = v })} options={[{ value: 'none', label: 'None' }, { value: 'subtle', label: 'Subtle' }, { value: 'strong', label: 'Strong' }]} />
              <SelectField<Theme['mode']> label="Default colour mode" hint="Students can override this in their profile." value={t.mode} onChange={(v) => set((th) => { th.mode = v })} options={[{ value: 'system', label: 'System (match device)' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
            </div>
          </FormSection>
        </div>
        <aside className="stack theme-preview" aria-label="Theme preview" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
          <BrandPreview name={draft.brand.name} tagline={draft.brand.tagline} logo={draft.brand.logoUrl} favicon={draft.brand.faviconUrl} />
          <ThemePreview theme={t} mode={editMode} />
        </aside>
      </div>
      <ConfirmDialog
        open={confirmReset}
        title="Reset theme to defaults?"
        body="Colours, fonts and shapes return to the original Designer Kid theme in your draft. Brand name and logo are kept."
        confirmLabel="Reset theme"
        onCancel={() => setConfirmReset(false)}
        onConfirm={async () => {
          const seed = await loadSeed()
          update((d) => { d.theme = seed.theme })
          setConfirmReset(false)
        }}
      />
    </>
  )
}
