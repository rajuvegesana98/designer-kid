import type { Theme, ThemeColors } from '../content/types'

export const FONT_OPTIONS = [
  'Bricolage Grotesque',
  'Instrument Sans',
  'Inter',
  'DM Sans',
  'Manrope',
  'Plus Jakarta Sans',
  'Space Grotesk',
  'Sora',
  'Outfit',
  'Figtree',
  'Lexend',
  'Work Sans',
  'IBM Plex Sans',
  'Fraunces',
]

const SHADOWS: Record<Theme['shadow'], [string, string]> = {
  none: ['none', '0 0 0 1px var(--c-line)'],
  soft: ['0 1px 2px rgb(20 20 40 / 0.05), 0 4px 16px rgb(20 20 40 / 0.05)', '0 2px 6px rgb(20 20 40 / 0.08), 0 16px 40px rgb(20 20 40 / 0.1)'],
  medium: ['0 2px 4px rgb(20 20 40 / 0.08), 0 8px 24px rgb(20 20 40 / 0.09)', '0 4px 10px rgb(20 20 40 / 0.1), 0 24px 56px rgb(20 20 40 / 0.16)'],
  strong: ['0 4px 10px rgb(20 20 40 / 0.12), 0 14px 36px rgb(20 20 40 / 0.14)', '0 8px 18px rgb(20 20 40 / 0.16), 0 32px 72px rgb(20 20 40 / 0.22)'],
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function luminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a)
  const l2 = luminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

/** Picks white or near-black text for a coloured background, whichever reads better. */
export function onColor(bg: string): string {
  return contrastRatio(bg, '#ffffff') >= contrastRatio(bg, '#0d0e13') ? '#ffffff' : '#0d0e13'
}

export function isHex(value: string) {
  return hexToRgb(value) !== null
}

export function themeVars(theme: Theme, mode: 'light' | 'dark'): Record<string, string> {
  const c: ThemeColors = mode === 'dark' ? theme.dark : theme.light
  const [s1, s2] = SHADOWS[theme.shadow]
  const vars: Record<string, string> = {
    '--c-primary': c.primary,
    '--c-secondary': c.secondary,
    '--c-accent': c.accent,
    '--c-bg': c.background,
    '--c-surface': c.surface,
    '--c-text': c.text,
    '--c-on-primary': onColor(c.primary),
    '--font-heading': `'${theme.fonts.heading}', system-ui, sans-serif`,
    '--font-body': `'${theme.fonts.body}', system-ui, sans-serif`,
    '--fs-base': `${theme.fonts.baseSize}px`,
    '--fw-heading': String(theme.fonts.headingWeight),
    '--fw-body': String(theme.fonts.bodyWeight),
    '--lh': String(theme.fonts.lineHeight),
    '--r-base': `${theme.radius.base}px`,
    '--r-button': `${theme.radius.button}px`,
    '--r-card': `${theme.radius.card}px`,
    '--border-w': theme.border === 'none' ? '0px' : theme.border === 'strong' ? '1.5px' : '1px',
  }
  if (mode === 'light') {
    vars['--shadow-1'] = s1
    vars['--shadow-2'] = s2
  }
  return vars
}

const loadedFonts = new Set<string>()

/** Loads Google Fonts on demand so the theme editor can offer any font in FONT_OPTIONS. */
export function ensureFonts(families: string[]) {
  const missing = families.filter((f) => f && !loadedFonts.has(f))
  if (!missing.length) return
  missing.forEach((f) => loadedFonts.add(f))
  const query = missing.map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700;800`).join('&')
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${query}&display=swap`
  document.head.appendChild(link)
}
