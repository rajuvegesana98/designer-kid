import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Level } from '../content/types'
import { Icon } from '../lib/icons'

export function ProgressBar({ value, label, thin, color }: { value: number; label: string; thin?: boolean; color?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      className={`progress ${thin ? 'progress-thin' : ''}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      style={color ? ({ '--c-level': color } as CSSProperties) : undefined}
    >
      <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: pct / 100 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  )
}

export function ProgressRing({ value, size = 112, stroke = 10, children, label }: { value: number; size?: number; stroke?: number; children?: ReactNode; label: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, Math.max(0, value))
  return (
    <div className="ring" role="img" aria-label={`${label}: ${Math.round(pct * 100)}%`}>
      <svg width={size} height={size}>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <motion.circle
          className="ring-value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="ring-label" aria-hidden="true">
        {children ?? <strong>{Math.round(pct * 100)}%</strong>}
      </div>
    </div>
  )
}

function useFocusTrap(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const node = ref.current
    const focusables = () =>
      Array.from(node?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? [])
    const first = node?.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0]
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const firstEl = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])
  return ref
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  wide,
  center,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children: ReactNode
  wide?: boolean
  center?: boolean
}) {
  const ref = useFocusTrap(open, onClose)
  const titleId = useId()
  // Portal to <body> so dialogs are never clipped by a parent with backdrop-filter/transform.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`overlay ${center ? 'overlay-center' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`dialog ${wide ? 'dialog-wide' : ''}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.12 } }}
          >
            <div className="row-between" style={{ marginBottom: description ? 6 : 16, alignItems: 'flex-start' }}>
              <h2 id={titleId} style={{ fontSize: '1.3rem' }}>
                {title}
              </h2>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} aria-label="Close dialog">
                <X size={18} />
              </button>
            </div>
            {description && <div className="muted" style={{ marginBottom: 16 }}>{description}</div>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useFocusTrap(open, onClose)
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="overlay sheet-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={ref}
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            <div className="sheet-grip" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  body: ReactNode
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} center>
      <div className="stack">
        <div className="muted">{body}</div>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onCancel} data-autofocus>
            Cancel
          </button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  id,
}: {
  tabs: { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  label: string
  id: string
}) {
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = tabs[(i + dir + tabs.length) % tabs.length]
    onChange(next.value)
    document.getElementById(`${id}-tab-${next.value}`)?.focus()
  }
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t, i) => (
        <button
          key={t.value}
          id={`${id}-tab-${t.value}`}
          role="tab"
          className="tab"
          aria-selected={value === t.value}
          tabIndex={value === t.value ? 0 : -1}
          onClick={() => onChange(t.value)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {value === t.value && <motion.div className="tab-pill" layoutId={`${id}-pill`} />}
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

export function EmptyState({ icon, title, children, action }: { icon: string; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={icon} size={26} />
      </div>
      <h3>{title}</h3>
      {children && <p style={{ maxWidth: 420 }}>{children}</p>}
      {action}
    </div>
  )
}

export function CheckItem({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: ReactNode }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="box" aria-hidden="true">
        <Check size={15} strokeWidth={3} />
      </span>
      <span className="check-text">{children}</span>
    </label>
  )
}

export function Switch({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
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

export function LevelBadge({ level }: { level: Pick<Level, 'name' | 'color' | 'icon'> }) {
  return (
    <span className="badge badge-level" style={{ '--level-color': level.color } as CSSProperties}>
      <Icon name={level.icon} size={13} />
      {level.name}
    </span>
  )
}

/** Fades content in as it scrolls into view. Skipped entirely for reduced motion. */
export function Reveal({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function PageHeader({ eyebrow, title, children, actions }: { eyebrow?: ReactNode; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="row-between" style={{ alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
      <div className="stack" style={{ '--gap': '10px', maxWidth: 720 } as CSSProperties}>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 style={{ fontSize: 'clamp(1.8rem, 1.3rem + 1.8vw, 2.6rem)' }}>{title}</h1>
        {children && <p className="lead">{children}</p>}
      </div>
      {actions && <div className="row">{actions}</div>}
    </header>
  )
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <div className="spinner" role="status" aria-label={label} />
}

export function FullPageLoader() {
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
      <Spinner label="Loading Designer Kid" />
    </div>
  )
}

export function formatMinutes(min: number) {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m} min` : `${h} h`
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, opts)
}

export function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`
  return formatDate(iso)
}

/** Password input with a show/hide toggle (keyboard and screen-reader accessible). */
export function PasswordInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="password-field">
      <input {...props} type={visible ? 'text' : 'password'} className={`input ${props.className ?? ''}`.replace('input input', 'input')} />
      <button
        type="button"
        className="password-toggle"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
      </button>
    </div>
  )
}
