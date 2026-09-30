import { AnimatePresence, motion } from 'motion/react'
import { CornerDownLeft, Search as SearchIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router'
import type { LevelId, LevelScope, SiteContent } from '../content/types'
import { CAREER_SECTIONS, levelLessons } from '../lib/content'
import { Icon } from '../lib/icons'
import { plain } from '../lib/markdown'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'

export type ResultCategory = 'Lesson' | 'Module' | 'Challenge' | 'Resource' | 'Career guide' | 'Article'

export interface SearchResult {
  key: string
  category: ResultCategory
  level: LevelScope
  title: string
  description: string
  to: string
  external?: boolean
}

const CATEGORY_ICON: Record<ResultCategory, string> = {
  Lesson: 'BookOpen',
  Module: 'Layers',
  Challenge: 'Target',
  Resource: 'Bookmark',
  'Career guide': 'Briefcase',
  Article: 'FileText',
}

export function buildIndex(content: SiteContent): SearchResult[] {
  const out: SearchResult[] = []
  for (const level of content.levels) {
    for (const course of level.courses)
      for (const m of course.modules)
        out.push({ key: `m-${m.id}`, category: 'Module', level: level.id, title: m.title, description: m.summary, to: `/learn/${level.id}/${m.id}` })
    for (const r of levelLessons(level))
      out.push({ key: `l-${r.lesson.id}`, category: 'Lesson', level: level.id, title: r.lesson.title, description: r.lesson.summary, to: `/lesson/${r.lesson.id}` })
  }
  for (const c of content.challenges) out.push({ key: `c-${c.id}`, category: 'Challenge', level: c.level, title: c.title, description: c.brief, to: `/challenges/${c.id}` })
  for (const r of content.resources) out.push({ key: `r-${r.id}`, category: 'Resource', level: r.level, title: r.title, description: r.description, to: r.url, external: true })
  for (const g of content.careerGuides) {
    const section = CAREER_SECTIONS.find((s) => s.id === g.section)
    out.push({ key: `g-${g.id}`, category: 'Career guide', level: g.level, title: g.title, description: `${section?.title ?? ''} · ${g.summary}`, to: `/career/${g.section}#${g.id}` })
  }
  for (const b of content.blog ?? []) out.push({ key: `b-${b.id}`, category: 'Article', level: 'all', title: b.title, description: b.excerpt, to: `/blog/${b.slug}` })
  return out
}

export function searchIndex(index: SearchResult[], query: string, level: LevelId | 'any', category: ResultCategory | 'any' = 'any') {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  return index
    .filter((r) => (level === 'any' || r.level === level || r.level === 'all') && (category === 'any' || r.category === category))
    .map((r) => {
      const title = r.title.toLowerCase()
      const hay = `${title} ${plain(r.description).toLowerCase()}`
      if (!terms.every((t) => hay.includes(t))) return null
      const score = terms.reduce((s, t) => s + (title.includes(t) ? 3 : 1) + (title.startsWith(t) ? 2 : 0), 0)
      return { r, score }
    })
    .filter((x): x is { r: SearchResult; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.r)
}

export function LevelFilter({ value, onChange }: { value: LevelId | 'any'; onChange: (v: LevelId | 'any') => void }) {
  const { content } = useContent()
  return (
    <div className="chip-group" role="radiogroup" aria-label="Filter by level">
      <button type="button" role="radio" className="chip" aria-checked={value === 'any'} onClick={() => onChange('any')}>All levels</button>
      {content.levels.map((l) => (
        <button key={l.id} type="button" role="radio" className="chip" aria-checked={value === l.id} onClick={() => onChange(l.id)}>
          {l.name}
        </button>
      ))}
    </div>
  )
}

export function ResultRow({ r, selected, id, onPick }: { r: SearchResult; selected?: boolean; id?: string; onPick: () => void }) {
  const { content } = useContent()
  const level = content.levels.find((l) => l.id === r.level)
  return (
    <div id={id} role="option" aria-selected={selected} className="result-item" onClick={onPick}>
      <span className="icon-tile icon-tile-sm" aria-hidden>
        <Icon name={CATEGORY_ICON[r.category]} size={17} />
      </span>
      <span className="grow">
        <span className="row" style={{ '--gap': '8px' } as CSSProperties}>
          <strong>{r.title}</strong>
        </span>
        <span className="small muted clamp-2" style={{ display: '-webkit-box' }}>{plain(r.description)}</span>
        <span className="meta" style={{ marginTop: 4 }}>
          <span className="badge">{r.category}</span>
          <span className="badge">{level ? level.name : 'All levels'}</span>
        </span>
      </span>
      {selected && <CornerDownLeft size={16} className="subtle" aria-hidden />}
    </div>
  )
}

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { content } = useContent()
  const { state } = useLearner()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<LevelId | 'any'>('any')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const index = useMemo(() => buildIndex(content), [content])
  const results = useMemo(() => (query.trim() ? searchIndex(index, query, level).slice(0, 12) : []), [index, query, level])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setLevel(state.level ?? 'any')
      const prev = document.activeElement as HTMLElement | null
      const t = window.setTimeout(() => inputRef.current?.focus(), 30)
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        window.clearTimeout(t)
        document.body.style.overflow = prevOverflow
        prev?.focus?.()
      }
    }
  }, [open, state.level])

  const pick = (r: SearchResult) => {
    onClose()
    if (r.external) window.open(r.to, '_blank', 'noopener')
    else navigate(r.to)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(results.length - 1, a + 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    }
    if (e.key === 'Enter' && results[active]) {
      // Stop the Enter keypress from re-clicking the search button that regains focus on close.
      e.preventDefault()
      pick(results[active])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search Designer Kid"
            className="dialog dialog-wide"
            style={{ padding: 0, overflow: 'hidden' }}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            onKeyDown={onKey}
          >
            <div className="row" style={{ padding: '14px 18px', borderBottom: '1px solid var(--c-line)', flexWrap: 'nowrap' }}>
              <SearchIcon size={20} aria-hidden className="subtle" />
              <input
                ref={inputRef}
                className="grow"
                style={{ border: 0, outline: 'none', background: 'transparent', fontSize: '1.1rem', minHeight: 40 }}
                placeholder="Search lessons, challenges, resources, career guides…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `sr-${results[active].key}` : undefined}
                aria-label="Search"
              />
              <kbd>Esc</kbd>
            </div>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--c-line)' }}>
              <LevelFilter value={level} onChange={setLevel} />
            </div>
            <div id="search-results" role="listbox" aria-label="Search results" style={{ maxHeight: '52vh', overflowY: 'auto', padding: 8 }}>
              {!query.trim() && <p className="muted" style={{ padding: 16 }}>Try “auto layout”, “personas”, “resume” or “design tokens”.</p>}
              {query.trim() && !results.length && <p className="muted" style={{ padding: 16 }}>No results for “{query}”{level !== 'any' ? ' at this level — try All levels.' : '.'}</p>}
              {results.map((r, i) => (
                <ResultRow key={r.key} id={`sr-${r.key}`} r={r} selected={i === active} onPick={() => pick(r)} />
              ))}
            </div>
            {query.trim() && (
              <div className="row-between small muted" style={{ padding: '10px 18px', borderTop: '1px solid var(--c-line)' }}>
                <span>
                  <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>Enter</kbd> to open
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    onClose()
                    navigate(`/search?q=${encodeURIComponent(query)}&level=${level}`)
                  }}
                >
                  See all results
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
