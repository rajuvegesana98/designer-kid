import { Reorder, useDragControls } from 'motion/react'
import { ArrowDown, ArrowUp, GripVertical, ImagePlus, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Modal, Spinner } from '../components/ui'
import { store, type MediaItem } from '../data'
import { isHex } from '../lib/theme'
import { useToast } from '../state/ui'

/**
 * Text inputs keep a local value and commit to the draft after a short pause
 * (and on blur), so typing stays fast even though the draft is large.
 */
function useCommitted<T>(value: T, onCommit: (v: T) => void, delay = 350) {
  const [local, setLocal] = useState(value)
  const timer = useRef<number | undefined>(undefined)
  const pending = useRef(false)
  // Always commit through the latest callback so edits to sibling fields aren't overwritten.
  const commitRef = useRef(onCommit)
  commitRef.current = onCommit
  useEffect(() => {
    if (!pending.current) setLocal(value)
  }, [value])
  const change = (v: T) => {
    setLocal(v)
    pending.current = true
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      pending.current = false
      commitRef.current(v)
    }, delay)
  }
  const flush = () => {
    if (!pending.current) return
    window.clearTimeout(timer.current)
    pending.current = false
    commitRef.current(local)
  }
  return [local, change, flush] as const
}

interface BaseProps {
  label: string
  hint?: string
  required?: boolean
}

export function TextField({ label, hint, value, onChange, placeholder, required, maxLength, type = 'text' }: BaseProps & { value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; type?: string }) {
  const id = useId()
  const [local, change, flush] = useCommitted(value, onChange)
  const invalid = required && !local.trim()
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden style={{ color: 'var(--c-danger)' }}> *</span>}
      </label>
      <input id={id} className="input" type={type} value={local} placeholder={placeholder} maxLength={maxLength} aria-invalid={invalid || undefined} required={required} onChange={(e) => change(e.target.value)} onBlur={flush} />
      {invalid ? <span className="error">{label} is required.</span> : hint && <span className="hint">{hint}</span>}
    </div>
  )
}

export function TextArea({ label, hint, value, onChange, rows = 4, placeholder, mono }: BaseProps & { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; mono?: boolean }) {
  const id = useId()
  const [local, change, flush] = useCommitted(value, onChange)
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} className={`textarea ${mono ? 'mono' : ''}`} rows={rows} value={local} placeholder={placeholder} onChange={(e) => change(e.target.value)} onBlur={flush} />
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}

export function NumberField({ label, hint, value, onChange, min, max, step = 1, suffix }: BaseProps & { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; suffix?: string }) {
  const id = useId()
  const [local, change, flush] = useCommitted(String(value), (v) => {
    const n = Number(v)
    if (!Number.isNaN(n) && v !== '') onChange(Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n)))
  })
  return (
    <div className="field">
      <label htmlFor={id}>{label}{suffix && <span className="subtle" style={{ fontWeight: 400 }}> ({suffix})</span>}</label>
      <input id={id} className="input" type="number" inputMode="decimal" min={min} max={max} step={step} value={local} onChange={(e) => change(e.target.value)} onBlur={flush} />
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}

export function SelectField<T extends string>({ label, hint, value, onChange, options }: BaseProps & { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}

export function ColorField({ label, value, onChange, hint }: BaseProps & { value: string; onChange: (v: string) => void }) {
  const id = useId()
  const [local, change, flush] = useCommitted(value, (v) => isHex(v) && onChange(v.toUpperCase()), 150)
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="row" style={{ '--gap': '8px', flexWrap: 'nowrap' } as CSSProperties}>
        <input type="color" aria-label={`${label} colour picker`} value={isHex(local) && local.length === 7 ? local : '#000000'} onChange={(e) => change(e.target.value)} style={{ width: 44, height: 44, border: '1px solid var(--c-line-strong)', borderRadius: 10, padding: 2, background: 'var(--c-surface)', flexShrink: 0 }} />
        <input id={id} className="input mono" value={local} onChange={(e) => change(e.target.value)} onBlur={flush} aria-invalid={!isHex(local) || undefined} />
      </div>
      {!isHex(local) ? <span className="error">Use a hex colour like #4F3FF0.</span> : hint && <span className="hint">{hint}</span>}
    </div>
  )
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="switch">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="track" aria-hidden="true" />
      <span>
        {label}
        {hint && <span className="subtle" style={{ display: 'block', fontWeight: 400 }}>{hint}</span>}
      </span>
    </label>
  )
}

/** Edits a list of short strings, one per line. */
export function LinesField({ label, hint, value, onChange, rows = 4 }: BaseProps & { value: string[]; onChange: (v: string[]) => void; rows?: number }) {
  return (
    <TextArea
      label={label}
      hint={hint ?? 'One item per line.'}
      rows={Math.max(rows, value.length + 1)}
      value={value.join('\n')}
      onChange={(v) => onChange(v.split('\n').map((s) => s.trim()).filter(Boolean))}
    />
  )
}

/* ─── Images ───────────────────────────────────────────────────────────── */

export function MediaPicker({ open, onClose, onPick, folder = 'general' }: { open: boolean; onClose: () => void; onPick: (url: string) => void; folder?: string }) {
  const [items, setItems] = useState<MediaItem[] | null>(null)
  const [uploading, setUploading] = useState(false)
  const toast = useToast()
  useEffect(() => {
    if (open) store.listMedia().then(setItems).catch(() => setItems([]))
  }, [open])
  const upload = async (file?: File) => {
    if (!file) return
    setUploading(true)
    try {
      const item = await store.uploadMedia(file, folder)
      onPick(item.url)
      onClose()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }
  return (
    <Modal open={open} onClose={onClose} title="Choose an image" wide>
      <div className="stack">
        <label className="btn btn-primary" style={{ width: 'fit-content' }}>
          <ImagePlus size={18} aria-hidden /> {uploading ? 'Uploading…' : 'Upload new image'}
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
        </label>
        {!items ? (
          <Spinner />
        ) : items.filter((i) => i.mimeType.startsWith('image/')).length === 0 ? (
          <p className="muted">No images yet. Upload one to get started.</p>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', maxHeight: '50vh', overflowY: 'auto' }}>
            {items
              .filter((i) => i.mimeType.startsWith('image/'))
              .map((i) => (
                <button key={i.id} type="button" className="card card-flat card-link" style={{ padding: 6, cursor: 'pointer' }} onClick={() => { onPick(i.url); onClose() }}>
                  <img src={i.url} alt="" loading="lazy" style={{ aspectRatio: '1', objectFit: 'cover', width: '100%', borderRadius: 10 }} />
                  <span className="subtle" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem', marginTop: 4 }}>{i.name}</span>
                </button>
              ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

export function ImageField({ label, value, onChange, hint, folder }: BaseProps & { value: string; onChange: (v: string) => void; folder?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="field">
      <span className="label">{label}</span>
      <div className="row" style={{ flexWrap: 'nowrap' }}>
        <div style={{ width: 72, height: 72, borderRadius: 12, border: '1px dashed var(--c-line-strong)', display: 'grid', placeItems: 'center', overflow: 'hidden', flexShrink: 0, background: 'var(--c-surface-2)' }}>
          {value ? <img src={value} alt={`${label} preview`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImagePlus size={20} className="subtle" aria-hidden />}
        </div>
        <div className="row">
          <button type="button" className="btn btn-sm" onClick={() => setOpen(true)}>{value ? 'Replace' : 'Choose image'}</button>
          {value && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange('')}>
              <X size={15} aria-hidden /> Remove
            </button>
          )}
        </div>
      </div>
      {hint && <span className="hint">{hint}</span>}
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={onChange} folder={folder} />
    </div>
  )
}

/* ─── Sortable list (drag with pointer, or buttons with keyboard) ──────── */

function SortableRow({ k, index, count, children, onMove, onRemove, removeLabel, onDragEnd }: { k: string; index: number; count: number; children: ReactNode; onMove: (from: number, to: number) => void; onRemove?: (index: number) => void; removeLabel?: string; onDragEnd: () => void }) {
  const controls = useDragControls()
  return (
    <Reorder.Item value={k} dragListener={false} dragControls={controls} className="sortable-row" whileDrag={{ scale: 1.01, boxShadow: 'var(--shadow-2)' }} onDragEnd={onDragEnd}>
      <button type="button" className="drag-handle" aria-hidden tabIndex={-1} onPointerDown={(e) => controls.start(e)} title="Drag to reorder">
        <GripVertical size={18} />
      </button>
      <div className="grow" style={{ minWidth: 0 }}>{children}</div>
      <div className="row" style={{ '--gap': '2px', flexWrap: 'nowrap' } as CSSProperties}>
        <button type="button" className="btn btn-ghost btn-icon btn-sm" aria-label="Move up" disabled={index === 0} onClick={() => onMove(index, index - 1)}>
          <ArrowUp size={16} />
        </button>
        <button type="button" className="btn btn-ghost btn-icon btn-sm" aria-label="Move down" disabled={index === count - 1} onClick={() => onMove(index, index + 1)}>
          <ArrowDown size={16} />
        </button>
        {onRemove && (
          <button type="button" className="btn btn-ghost btn-icon btn-sm" aria-label={removeLabel ?? 'Delete'} onClick={() => onRemove(index)} style={{ color: 'var(--c-danger)' }}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </Reorder.Item>
  )
}

/**
 * Drag-and-drop list. Reorder works on stable string keys (draft objects are
 * re-created on every edit), and the new order is committed when the drag ends.
 */
export function SortableList<T>({
  items,
  keys,
  onReorder,
  render,
  onRemove,
  removeLabel,
  label,
}: {
  items: T[]
  keys: string[]
  onReorder: (next: T[], nextKeys: string[]) => void
  render: (item: T, index: number, key: string) => ReactNode
  onRemove?: (index: number) => void
  removeLabel?: string
  label: string
}) {
  const [order, setOrder] = useState(keys)
  const dragging = useRef(false)
  useEffect(() => {
    if (!dragging.current) setOrder(keys)
  }, [keys.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps

  const commit = (nextKeys: string[]) => {
    const byKey = new Map(keys.map((k, i) => [k, items[i]]))
    if (nextKeys.join('|') !== keys.join('|')) onReorder(nextKeys.map((k) => byKey.get(k)!), nextKeys)
  }
  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return
    const next = [...order]
    const [it] = next.splice(from, 1)
    next.splice(to, 0, it)
    setOrder(next)
    commit(next)
  }
  const byKey = new Map(keys.map((k, i) => [k, i]))
  return (
    <Reorder.Group
      axis="y"
      values={order}
      onReorder={(next: string[]) => {
        dragging.current = true
        setOrder(next)
      }}
      className="sortable"
      aria-label={label}
      as="ul"
    >
      {order.map((k, i) => {
        const idx = byKey.get(k)
        if (idx === undefined) return null
        return (
          <SortableRow
            key={k}
            k={k}
            index={i}
            count={order.length}
            onMove={move}
            onRemove={onRemove ? () => onRemove(idx) : undefined}
            removeLabel={removeLabel}
            onDragEnd={() => {
              dragging.current = false
              commit(order)
            }}
          >
            {render(items[idx], idx, k)}
          </SortableRow>
        )
      })}
    </Reorder.Group>
  )
}

export function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="btn btn-soft btn-sm" onClick={onClick}>
      <Plus size={16} aria-hidden /> {children}
    </button>
  )
}

export function FormSection({ title, description, children, actions }: { title: string; description?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="card stack" style={{ '--gap': '16px' } as CSSProperties}>
      <div className="row-between">
        <div>
          <h2 style={{ fontSize: '1.1rem' }}>{title}</h2>
          {description && <p className="small muted" style={{ marginTop: 2 }}>{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}
