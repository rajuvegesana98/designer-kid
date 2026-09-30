import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { CheckCircle2, CircleAlert, X } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SiteContent } from '../content/types'
import { pageTitle } from '../lib/usePageTitle'
import { ensureFonts, themeVars } from '../lib/theme'

/* ─── Colour mode ──────────────────────────────────────────────────────── */

export type ModePref = 'light' | 'dark' | 'system'
const MODE_KEY = 'dk.colorMode'

interface ModeCtx {
  pref: ModePref | null
  resolved: 'light' | 'dark'
  setPref(p: ModePref | null): void
}
const ModeContext = createContext<ModeCtx | null>(null)

function systemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** Applies the published theme to the document and resolves light/dark. */
export function ThemeProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  const [pref, setPrefState] = useState<ModePref | null>(() => {
    try {
      return (localStorage.getItem(MODE_KEY) as ModePref | null) ?? null
    } catch {
      return null
    }
  })
  const [sysDark, setSysDark] = useState(systemDark)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => setSysDark(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const effective = pref ?? content.theme.mode
  const resolved: 'light' | 'dark' = effective === 'system' ? (sysDark ? 'dark' : 'light') : effective

  useEffect(() => {
    const root = document.documentElement
    root.dataset.mode = resolved
    for (const [k, v] of Object.entries(themeVars(content.theme, resolved))) root.style.setProperty(k, v)
    if (resolved === 'dark') {
      root.style.removeProperty('--shadow-1')
      root.style.removeProperty('--shadow-2')
    }
    ensureFonts([content.theme.fonts.heading, content.theme.fonts.body])
  }, [content.theme, resolved])

  useEffect(() => {
    if (!pageTitle.active) document.title = `${content.brand.name} — ${content.brand.tagline}`
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (link && content.brand.faviconUrl) link.href = content.brand.faviconUrl
  }, [content.brand])

  const setPref = useCallback((p: ModePref | null) => {
    setPrefState(p)
    try {
      if (p) localStorage.setItem(MODE_KEY, p)
      else localStorage.removeItem(MODE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <ModeContext.Provider value={{ pref, resolved, setPref }}>
      {/* reducedMotion="user" makes every Motion animation respect the OS setting. */}
      <MotionConfig reducedMotion="user" transition={{ type: 'spring', stiffness: 420, damping: 36 }}>
        {children}
      </MotionConfig>
    </ModeContext.Provider>
  )
}

export function useColorMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useColorMode must be used inside ThemeProvider')
  return ctx
}

/* ─── Toasts ───────────────────────────────────────────────────────────── */

interface Toast {
  id: number
  message: string
  tone: 'default' | 'error'
}
const ToastContext = createContext<(message: string, tone?: Toast['tone']) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))
  const push = useCallback((message: string, tone: Toast['tone'] = 'default') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t.slice(-2), { id, message, tone }])
    window.setTimeout(() => dismiss(id), tone === 'error' ? 7000 : 3800)
  }, [])
  const value = useMemo(() => push, [push])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              className={`toast ${t.tone === 'error' ? 'toast-error' : ''}`}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.15 } }}
            >
              {t.tone === 'error' ? <CircleAlert size={18} aria-hidden /> : <CheckCircle2 size={18} aria-hidden />}
              <span className="grow">{t.message}</span>
              <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'inherit' }} onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
