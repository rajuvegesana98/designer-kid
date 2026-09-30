import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, X } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router'
import type { Promo } from '../content/types'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { Illustration } from './illustrationLibrary'
import { Modal } from './ui'

const DISMISS_KEY = (p: Promo) => `dk.promo.${p.id}.v${p.version}`

function isDismissed(p: Promo) {
  try {
    return localStorage.getItem(DISMISS_KEY(p)) === '1'
  } catch {
    return false
  }
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

/** Is this offer running right now for this visitor on this page? */
export function promoIsActive(p: Promo, opts: { isHome: boolean; isNewVisitor: boolean }) {
  if (!p.enabled) return false
  const d = today()
  if (p.startsAt && d < p.startsAt) return false
  if (p.endsAt && d > p.endsAt) return false
  if (p.pages === 'home' && !opts.isHome) return false
  if (p.audience === 'new' && !opts.isNewVisitor) return false
  if (p.audience === 'returning' && opts.isNewVisitor) return false
  return true
}

const TONES: Record<Promo['tone'], { bg: string; fg: string }> = {
  primary: { bg: 'var(--c-primary)', fg: 'var(--c-on-primary)' },
  secondary: { bg: 'color-mix(in oklab, var(--c-secondary) 82%, #000)', fg: '#fff' },
  accent: { bg: 'color-mix(in oklab, var(--c-accent) 78%, #000)', fg: '#fff' },
  dark: { bg: '#15161c', fg: '#fff' },
}

function PromoCta({ promo, className, onClick }: { promo: Promo; className: string; onClick?: () => void }) {
  if (!promo.ctaLabel || !promo.ctaUrl) return null
  const external = /^https?:\/\//.test(promo.ctaUrl)
  return external ? (
    <a href={promo.ctaUrl} target="_blank" rel="noreferrer" className={className} onClick={onClick}>
      {promo.ctaLabel} <ArrowRight size={16} aria-hidden />
    </a>
  ) : (
    <Link to={promo.ctaUrl} className={className} onClick={onClick}>
      {promo.ctaLabel} <ArrowRight size={16} aria-hidden />
    </Link>
  )
}

export function PromoBar({ promo, onDismiss }: { promo: Promo; onDismiss?: () => void }) {
  const tone = TONES[promo.tone]
  return (
    <div className="promo-bar" role="region" aria-label="Offer" style={{ background: tone.bg, color: tone.fg } as CSSProperties}>
      <div className="promo-bar-inner">
        <strong>{promo.title}</strong>
        {promo.message && <span className="promo-bar-msg">{promo.message}</span>}
        <PromoCta promo={promo} className="promo-bar-cta" onClick={onDismiss} />
      </div>
      {promo.dismissible && onDismiss && (
        <button type="button" className="promo-close" aria-label="Dismiss offer" onClick={onDismiss} style={{ color: 'inherit' }}>
          <X size={18} />
        </button>
      )}
    </div>
  )
}

export function PromoCard({ promo, onCta }: { promo: Promo; onCta?: () => void }) {
  return (
    <div className="stack" style={{ '--gap': '14px' } as CSSProperties}>
      {promo.image ? (
        <img src={promo.image} alt="" style={{ borderRadius: 'var(--r-card)', width: '100%', maxHeight: 240, objectFit: 'cover' }} />
      ) : promo.illustration ? (
        <div style={{ borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          <Illustration name={promo.illustration} title="" />
        </div>
      ) : null}
      {promo.message && <p className="muted" style={{ fontSize: '1.05rem' }}>{promo.message}</p>}
      <PromoCta promo={promo} className="btn btn-primary btn-lg" onClick={onCta} />
    </div>
  )
}

/** Shows the first active offer: a bar above the page or a pop-up shortly after landing. */
export function PromoLayer() {
  const { content, isPreview } = useContent()
  const { state } = useLearner()
  const location = useLocation()
  const [dismissedNow, setDismissedNow] = useState<Record<string, boolean>>({})
  const [popupReady, setPopupReady] = useState(false)
  const path = location.pathname
  const hidden = path.startsWith('/admin') || path.startsWith('/print') || path.startsWith('/account')
  const isHome = path === '/' || path === '/welcome'
  const isNewVisitor = !state.level

  const active = (content.promos ?? []).filter((p) => promoIsActive(p, { isHome, isNewVisitor }) && (isPreview || (!isDismissed(p) && !dismissedNow[DISMISS_KEY(p)])))
  const bar = active.find((p) => p.style === 'bar')
  const popup = active.find((p) => p.style === 'popup')

  // Let people see the page first; don't interrupt instantly.
  useEffect(() => {
    if (!popup) return
    const t = window.setTimeout(() => setPopupReady(true), 1200)
    return () => window.clearTimeout(t)
  }, [popup?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (hidden) return null

  const dismiss = (p: Promo) => {
    try {
      localStorage.setItem(DISMISS_KEY(p), '1')
    } catch {
      /* ignore */
    }
    setDismissedNow((d) => ({ ...d, [DISMISS_KEY(p)]: true }))
  }

  // Closing always works. "Dismissible" offers stay closed for good; others return on the next visit.
  const hideForSession = (p: Promo) => setDismissedNow((d) => ({ ...d, [DISMISS_KEY(p)]: true }))
  const close = (p: Promo) => (p.dismissible ? dismiss(p) : hideForSession(p))

  return (
    <>
      <AnimatePresence>
        {bar && (
          <motion.div key={bar.id} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <PromoBar promo={bar} onDismiss={bar.dismissible ? () => dismiss(bar) : undefined} />
          </motion.div>
        )}
      </AnimatePresence>
      {popup && (
        <Modal open={popupReady} onClose={() => close(popup)} title={popup.title} center>
          <PromoCard promo={popup} onCta={() => close(popup)} />
          <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => close(popup)}>
            No thanks
          </button>
        </Modal>
      )}
    </>
  )
}
