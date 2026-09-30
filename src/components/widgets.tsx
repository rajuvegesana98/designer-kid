import { motion } from 'motion/react'
import { Check, Loader2, X } from 'lucide-react'
import { useId, useState, type CSSProperties, type ReactNode } from 'react'
import type { WidgetName } from '../content/types'
import { contrastRatio, isHex } from '../lib/theme'

function Widget({ stage, controls, caption, label }: { stage: ReactNode; controls: ReactNode; caption?: string; label: string }) {
  return (
    <figure className="widget" style={{ margin: 0 }} aria-label={label}>
      <div className="widget-stage">{stage}</div>
      <div className="widget-controls">{controls}</div>
      {caption && <figcaption className="widget-caption">{caption}</figcaption>}
    </figure>
  )
}

function Range({ label, value, min, max, step = 1, onChange, unit = 'px' }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string }) {
  const id = useId()
  return (
    <div className="field" style={{ gap: 2 }}>
      <label htmlFor={id} className="small">
        {label}: <strong>{value}{unit}</strong>
      </label>
      <input id={id} className="range" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}

function Choice<T extends string | number>({ label, options, value, onChange }: { label: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="stack" style={{ '--gap': '4px' } as CSSProperties}>
      <span className="small" style={{ fontWeight: 600 }}>{label}</span>
      <div className="chip-group">
        {options.map((o) => (
          <button key={String(o.value)} type="button" role="radio" aria-checked={value === o.value} className="chip" onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Contrast checker ─────────────────────────────────────────────────── */

function ContrastChecker({ caption }: { caption?: string }) {
  const [fg, setFg] = useState('#6B7280')
  const [bg, setBg] = useState('#FFFFFF')
  const valid = isHex(fg) && isHex(bg)
  const ratio = valid ? contrastRatio(fg, bg) : 1
  const checks = [
    { label: 'Normal text AA (4.5:1)', pass: ratio >= 4.5 },
    { label: 'Large text AA (3:1)', pass: ratio >= 3 },
    { label: 'Normal text AAA (7:1)', pass: ratio >= 7 },
  ]
  const ColorField = ({ label, value, set }: { label: string; value: string; set: (v: string) => void }) => {
    const id = useId()
    return (
      <div className="field" style={{ gap: 4 }}>
        <label htmlFor={id} className="small">{label}</label>
        <div className="row" style={{ '--gap': '6px', flexWrap: 'nowrap' } as CSSProperties}>
          <input type="color" aria-label={`${label} picker`} value={isHex(value) ? value : '#000000'} onChange={(e) => set(e.target.value.toUpperCase())} style={{ width: 44, height: 44, border: 0, background: 'none', padding: 0 }} />
          <input id={id} className="input mono" style={{ width: 120 }} value={value} onChange={(e) => set(e.target.value)} />
        </div>
      </div>
    )
  }
  return (
    <Widget
      label="Contrast checker"
      caption={caption}
      stage={
        <div style={{ background: valid ? bg : '#fff', color: valid ? fg : '#000', borderRadius: 14, padding: 24, border: '1px solid var(--c-line)' }}>
          <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>Large heading text</div>
          <p style={{ marginTop: 8, fontSize: 16 }}>Body text at 16px. Can everyone read this comfortably, including in bright sunlight?</p>
        </div>
      }
      controls={
        <>
          <ColorField label="Text colour" value={fg} set={setFg} />
          <ColorField label="Background" value={bg} set={setBg} />
          <div className="stack grow" style={{ '--gap': '6px', minWidth: 220 } as CSSProperties} aria-live="polite">
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>{valid ? `${ratio.toFixed(2)}:1` : 'Enter hex colours'}</div>
            {checks.map((c) => (
              <span key={c.label} className={`badge ${c.pass ? 'badge-success' : 'badge-danger'}`} style={{ width: 'fit-content' }}>
                {c.pass ? <Check size={13} aria-hidden /> : <X size={13} aria-hidden />}
                {c.label} — {c.pass ? 'pass' : 'fail'}
              </span>
            ))}
          </div>
        </>
      }
    />
  )
}

/* ─── Spacing scale ────────────────────────────────────────────────────── */

function SpacingScale({ caption }: { caption?: string }) {
  const [base, setBase] = useState<4 | 8>(8)
  const [step, setStep] = useState(3)
  const scale = base === 8 ? [4, 8, 16, 24, 32, 48, 64] : [4, 8, 12, 16, 20, 24, 32]
  const pad = scale[step]
  return (
    <Widget
      label="Spacing scale"
      caption={caption}
      stage={
        <div className="grid grid-2" style={{ alignItems: 'center' }}>
          <div className="stack" style={{ '--gap': '6px' } as CSSProperties}>
            {scale.map((s, i) => (
              <div key={s} className="row" style={{ '--gap': '10px', flexWrap: 'nowrap' } as CSSProperties}>
                <span className="mono subtle" style={{ width: 40 }}>{s}px</span>
                <motion.div layout style={{ height: 14, width: s * 2.4, borderRadius: 4, background: i === step ? 'var(--c-primary)' : 'var(--c-line-strong)' }} />
              </div>
            ))}
          </div>
          <motion.div layout style={{ background: 'var(--c-surface)', border: '1px dashed var(--c-primary)', borderRadius: 14, padding: pad }}>
            <div style={{ background: 'var(--c-primary-soft)', borderRadius: 8, padding: 12 }}>
              <strong>Card content</strong>
              <div className="small muted" style={{ marginTop: pad / 2 }}>Padding: {pad}px · inner gap: {pad / 2}px</div>
            </div>
          </motion.div>
        </div>
      }
      controls={
        <>
          <Choice label="Base unit" value={base} onChange={(v) => { setBase(v); setStep(3) }} options={[{ value: 8, label: '8-point' }, { value: 4, label: '4-point' }]} />
          <Range label="Card padding step" value={step} min={0} max={scale.length - 1} onChange={setStep} unit="" />
        </>
      }
    />
  )
}

/* ─── Type scale ───────────────────────────────────────────────────────── */

function TypeScale({ caption }: { caption?: string }) {
  const [base, setBase] = useState(16)
  const [ratio, setRatio] = useState(1.25)
  const steps = [
    { name: 'Display', p: 4 },
    { name: 'H1', p: 3 },
    { name: 'H2', p: 2 },
    { name: 'H3', p: 1 },
    { name: 'Body', p: 0 },
    { name: 'Caption', p: -1 },
  ]
  return (
    <Widget
      label="Type scale"
      caption={caption}
      stage={
        <div className="stack" style={{ '--gap': '6px', overflow: 'hidden' } as CSSProperties}>
          {steps.map((s) => {
            const size = Math.round(base * ratio ** s.p)
            return (
              <div key={s.name} className="row" style={{ flexWrap: 'nowrap', alignItems: 'baseline' }}>
                <span className="mono subtle" style={{ width: 90, flexShrink: 0 }}>{s.name} · {size}</span>
                <motion.span layout style={{ fontSize: size, fontFamily: s.p > 0 ? 'var(--font-heading)' : 'var(--font-body)', fontWeight: s.p > 0 ? 700 : 400, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  Design with intent
                </motion.span>
              </div>
            )
          })}
        </div>
      }
      controls={
        <>
          <Range label="Base size" value={base} min={14} max={20} onChange={setBase} />
          <Choice
            label="Scale ratio"
            value={ratio}
            onChange={setRatio}
            options={[
              { value: 1.125, label: '1.125 Major second' },
              { value: 1.25, label: '1.25 Major third' },
              { value: 1.333, label: '1.333 Perfect fourth' },
              { value: 1.5, label: '1.5 Perfect fifth' },
            ]}
          />
        </>
      }
    />
  )
}

/* ─── Visual hierarchy ─────────────────────────────────────────────────── */

function VisualHierarchy({ caption }: { caption?: string }) {
  const [size, setSize] = useState(true)
  const [weight, setWeight] = useState(true)
  const [colour, setColour] = useState(true)
  const [space, setSpace] = useState(true)
  const toggles = [
    { label: 'Size', v: size, set: setSize },
    { label: 'Weight', v: weight, set: setWeight },
    { label: 'Colour', v: colour, set: setColour },
    { label: 'Spacing', v: space, set: setSpace },
  ]
  return (
    <Widget
      label="Visual hierarchy"
      caption={caption}
      stage={
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <motion.div layout className="card" style={{ width: 'min(320px, 100%)', padding: space ? 24 : 12 }}>
            <motion.div layout style={{ fontSize: 13, color: colour ? 'var(--c-text-3)' : 'inherit', fontWeight: 400, textTransform: 'uppercase', letterSpacing: 1 }}>Pro plan</motion.div>
            <motion.div layout style={{ fontSize: size ? 40 : 16, fontWeight: weight ? 800 : 400, marginTop: space ? 8 : 0, fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
              £12<span style={{ fontSize: size ? 16 : 16, fontWeight: 400, color: colour ? 'var(--c-text-3)' : 'inherit' }}>/month</span>
            </motion.div>
            <motion.p layout style={{ fontSize: 16, marginTop: space ? 12 : 2, color: colour ? 'var(--c-text-2)' : 'inherit' }}>Unlimited projects, shared libraries and version history.</motion.p>
            <motion.div
              layout
              style={{
                marginTop: space ? 20 : 4,
                padding: '10px 14px',
                borderRadius: 10,
                textAlign: 'center',
                fontWeight: weight ? 700 : 400,
                background: colour ? 'var(--c-primary)' : 'transparent',
                color: colour ? 'var(--c-on-primary)' : 'inherit',
                border: colour ? 0 : '1px solid var(--c-line-strong)',
              }}
            >
              Start free trial
            </motion.div>
          </motion.div>
        </div>
      }
      controls={
        <div className="stack" style={{ '--gap': '6px' } as CSSProperties}>
          <span className="small" style={{ fontWeight: 600 }}>Hierarchy tools — switch them off to see what each one contributes</span>
          <div className="chip-group">
            {toggles.map((t) => (
              <button key={t.label} type="button" className="chip" aria-pressed={t.v} onClick={() => t.set(!t.v)}>
                {t.v ? <Check size={14} aria-hidden /> : null}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      }
    />
  )
}

/* ─── Auto Layout ──────────────────────────────────────────────────────── */

function AutoLayout({ caption }: { caption?: string }) {
  const [dir, setDir] = useState<'row' | 'column'>('row')
  const [gap, setGap] = useState(12)
  const [pad, setPad] = useState(16)
  const [align, setAlign] = useState<'flex-start' | 'center' | 'flex-end'>('center')
  const [fill, setFill] = useState(false)
  return (
    <Widget
      label="Auto Layout playground"
      caption={caption}
      stage={
        <div style={{ display: 'grid', placeItems: 'center', minHeight: 200 }}>
          <div style={{ position: 'relative', width: fill ? '100%' : 'auto' }}>
            <span className="frame-label" style={{ top: -26, left: 0 }}>Frame · Auto Layout</span>
            <motion.div
              layout
              style={{
                display: 'flex',
                flexDirection: dir,
                gap,
                padding: pad,
                alignItems: align,
                border: '1.5px solid var(--c-primary)',
                borderRadius: 12,
                background: 'var(--c-surface)',
                width: fill ? '100%' : 'fit-content',
                minHeight: dir === 'row' ? 110 : undefined,
                minWidth: dir === 'column' ? 180 : undefined,
              }}
            >
              {[48, 72, 36].map((h, i) => (
                <motion.div layout key={i} style={{ background: 'var(--c-primary-soft)', border: '1px solid var(--c-primary-line)', borderRadius: 8, width: dir === 'row' ? (fill ? undefined : 64) : fill ? '100%' : 64 + i * 20, flex: fill && dir === 'row' ? 1 : undefined, height: dir === 'row' ? h : 36 }} />
              ))}
            </motion.div>
          </div>
        </div>
      }
      controls={
        <>
          <Choice label="Direction" value={dir} onChange={setDir} options={[{ value: 'row', label: 'Horizontal' }, { value: 'column', label: 'Vertical' }]} />
          <Choice label="Align" value={align} onChange={setAlign} options={[{ value: 'flex-start', label: 'Start' }, { value: 'center', label: 'Centre' }, { value: 'flex-end', label: 'End' }]} />
          <Choice label="Children" value={fill ? 'fill' : 'hug'} onChange={(v) => setFill(v === 'fill')} options={[{ value: 'hug', label: 'Hug contents' }, { value: 'fill', label: 'Fill container' }]} />
          <Range label="Gap" value={gap} min={0} max={40} step={4} onChange={setGap} />
          <Range label="Padding" value={pad} min={0} max={40} step={4} onChange={setPad} />
        </>
      }
    />
  )
}

/* ─── Layout grid ──────────────────────────────────────────────────────── */

function GridPlayground({ caption }: { caption?: string }) {
  const [cols, setCols] = useState(12)
  const [gutter, setGutter] = useState(16)
  const [margin, setMargin] = useState(24)
  const [overlay, setOverlay] = useState(true)
  const spans = cols === 12 ? [8, 4, 4, 4, 4] : cols === 8 ? [5, 3, 4, 4, 8] : [4, 2, 2, 4, 4]
  return (
    <Widget
      label="Layout grid playground"
      caption={caption}
      stage={
        <div style={{ position: 'relative', background: 'var(--c-surface)', borderRadius: 12, border: '1px solid var(--c-line)', padding: `16px ${margin}px`, overflow: 'hidden' }}>
          {overlay && (
            <div aria-hidden style={{ position: 'absolute', inset: `0 ${margin}px`, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: gutter, pointerEvents: 'none' }}>
              {Array.from({ length: cols }, (_, i) => (
                <div key={i} style={{ background: 'color-mix(in oklab, var(--c-danger) 12%, transparent)' }} />
              ))}
            </div>
          )}
          <motion.div layout style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: gutter }}>
            {spans.map((s, i) => (
              <motion.div layout key={`${cols}-${i}`} style={{ gridColumn: `span ${s}`, height: i === 0 ? 72 : 48, borderRadius: 8, background: 'var(--c-primary-soft)', border: '1px solid var(--c-primary-line)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, color: 'var(--c-primary-text)' }}>
                span {s}
              </motion.div>
            ))}
          </motion.div>
        </div>
      }
      controls={
        <>
          <Choice label="Columns" value={cols} onChange={setCols} options={[{ value: 4, label: '4 (mobile)' }, { value: 8, label: '8 (tablet)' }, { value: 12, label: '12 (desktop)' }]} />
          <Range label="Gutter" value={gutter} min={8} max={32} step={4} onChange={setGutter} />
          <Range label="Margin" value={margin} min={8} max={64} step={8} onChange={setMargin} />
          <button type="button" className="chip" aria-pressed={overlay} onClick={() => setOverlay(!overlay)}>Show columns</button>
        </>
      }
    />
  )
}

/* ─── Button states ────────────────────────────────────────────────────── */

const STATES = {
  default: 'The resting state. It must look clickable without any interaction.',
  hover: 'Pointer feedback on desktop. Never rely on it alone — touch screens have no hover.',
  focus: 'Shows keyboard users where they are. Removing the focus ring is an accessibility failure.',
  pressed: 'Confirms the tap or click registered, usually a slightly darker or smaller button.',
  disabled: 'Unavailable. Explain why nearby, or keep it enabled and show an error on submit instead.',
  loading: 'The action is in progress. Keep the width stable and prevent double submission.',
} as const

function ButtonStates({ caption }: { caption?: string }) {
  const [state, setState] = useState<keyof typeof STATES>('default')
  const style: CSSProperties = {
    minHeight: 48,
    minWidth: 180,
    padding: '0 22px',
    borderRadius: 12,
    border: 0,
    fontWeight: 700,
    fontSize: 16,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: 'var(--c-on-primary)',
    background:
      state === 'hover' ? 'color-mix(in oklab, var(--c-primary) 86%, var(--c-text))' : state === 'pressed' ? 'color-mix(in oklab, var(--c-primary) 72%, var(--c-text))' : state === 'disabled' ? 'var(--c-surface-3)' : 'var(--c-primary)',
    ...(state === 'disabled' ? { color: 'var(--c-text-3)' } : {}),
    outline: state === 'focus' ? '3px solid var(--c-primary)' : 'none',
    outlineOffset: 3,
    transform: state === 'pressed' ? 'scale(0.97)' : undefined,
  }
  return (
    <Widget
      label="Button states"
      caption={caption}
      stage={
        <div className="stack" style={{ alignItems: 'center', justifyContent: 'center', minHeight: 150 }}>
          <div style={style} aria-hidden>
            {state === 'loading' && <Loader2 size={18} className="spin" style={{ animation: 'spin 0.8s linear infinite' }} />}
            {state === 'loading' ? 'Saving…' : 'Save changes'}
          </div>
          <p className="small muted" style={{ maxWidth: 420, textAlign: 'center' }} aria-live="polite">{STATES[state]}</p>
        </div>
      }
      controls={<Choice label="State" value={state} onChange={setState} options={Object.keys(STATES).map((k) => ({ value: k as keyof typeof STATES, label: k[0].toUpperCase() + k.slice(1) }))} />}
    />
  )
}

export function InteractiveWidget({ widget, caption }: { widget: WidgetName; caption?: string }) {
  switch (widget) {
    case 'contrast-checker':
      return <ContrastChecker caption={caption} />
    case 'spacing-scale':
      return <SpacingScale caption={caption} />
    case 'type-scale':
      return <TypeScale caption={caption} />
    case 'visual-hierarchy':
      return <VisualHierarchy caption={caption} />
    case 'auto-layout':
      return <AutoLayout caption={caption} />
    case 'grid-playground':
      return <GridPlayground caption={caption} />
    case 'button-states':
      return <ButtonStates caption={caption} />
    default:
      return null
  }
}

export const WIDGET_NAMES: WidgetName[] = ['contrast-checker', 'spacing-scale', 'type-scale', 'visual-hierarchy', 'auto-layout', 'grid-playground', 'button-states']
