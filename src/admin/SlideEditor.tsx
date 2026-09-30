/**
 * PowerPoint-style editor for lessons and career guides.
 *  - Left: slide rail (thumbnails) — click to select, drag or ⌥↑/⌥↓ to reorder.
 *  - Centre: the real student rendering. Click any text to edit it in place.
 *  - Right: Format panel with every option for the selected slide.
 *  - Ribbon: Insert, duplicate, delete, move, undo/redo, preview and PDF.
 * The editor works on a whole document value so undo/redo covers every change.
 */
import { Reorder } from 'motion/react'
import {
  AlignLeft, ArrowDown, ArrowUp, CheckSquare, Copy, Eye, FileDown, FileUp, Heading, Image as ImageIcon, Lightbulb, List, ListChecks, MessageCircleQuestion,
  MousePointerClick, Palette, Plus, Redo2, Scale, Sparkles, Trash2, Undo2, Video, Link2, type LucideIcon,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { BlockView, FileCard, PrintMode } from '../components/Blocks'
import { Illustration } from '../components/illustrationLibrary'
import type { Block, FileAsset, IllustrationName } from '../content/types'
import { inline, Markdown } from '../lib/markdown'
import { useToast } from '../state/ui'
import { BlockForm, emptyBlock } from './BlocksEditor'
import { IllustrationPicker } from './IllustrationPicker'
import { DocUploadButton } from './uploads'

/* ─── Inline editing ───────────────────────────────────────────────────── */

/** Shows formatted text; click to edit the raw text in place, like a slide text box. */
export function EditableText({
  value,
  onChange,
  placeholder,
  multiline,
  as = 'div',
  markdown,
  className,
  style,
  label,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  multiline?: boolean
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'strong'
  markdown?: boolean
  className?: string
  style?: CSSProperties
  label: string
}) {
  const [editing, setEditing] = useState(false)
  const [local, setLocal] = useState(value)
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (!editing) setLocal(value)
  }, [value, editing])
  useEffect(() => {
    if (!editing || !ref.current) return
    const el = ref.current
    el.focus()
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [editing])
  const commit = () => {
    setEditing(false)
    if (local !== value) onChange(local)
  }
  if (editing)
    return (
      <textarea
        ref={ref}
        aria-label={label}
        className={`inline-editor ${className ?? ''}`}
        style={style}
        value={local}
        rows={1}
        placeholder={placeholder}
        onChange={(e) => {
          setLocal(e.target.value)
          e.target.style.height = 'auto'
          e.target.style.height = `${e.target.scrollHeight}px`
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setLocal(value)
            setEditing(false)
          }
          if (e.key === 'Enter' && !multiline && !e.shiftKey) {
            e.preventDefault()
            commit()
          }
          e.stopPropagation()
        }}
      />
    )
  const Tag = as
  return (
    <Tag
      className={`inline-editable ${className ?? ''} ${value ? '' : 'is-empty'}`}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`Edit ${label}`}
      onClick={() => setEditing(true)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setEditing(true)
        }
      }}
    >
      {value ? (markdown ? <Markdown text={value} className="stack" /> : inline(value)) : placeholder}
    </Tag>
  )
}

export function EditableSteps(props: { items: string[]; onChange: (v: string[]) => void; label: string }) {
  return <EditableList {...props} ordered />
}

function EditableList({ items, onChange, label, ordered }: { items: string[]; onChange: (v: string[]) => void; label: string; ordered?: boolean }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <div className="stack" style={{ '--gap': '6px' } as CSSProperties}>
      <Tag style={{ margin: 0 }}>
        {items.map((it, i) => (
          <li key={i} className="row" style={{ flexWrap: 'nowrap', '--gap': '4px', display: 'list-item' } as CSSProperties}>
            <span className="row" style={{ flexWrap: 'nowrap', '--gap': '4px' } as CSSProperties}>
              <EditableText
                as="span"
                className="grow"
                label={`${label} item ${i + 1}`}
                value={it}
                placeholder="Type an item"
                onChange={(v) => onChange(v.trim() ? items.map((x, j) => (j === i ? v : x)) : items.filter((_, j) => j !== i))}
              />
              <button type="button" className="btn btn-ghost btn-icon btn-sm slide-x" aria-label={`Remove ${label} item ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>
            </span>
          </li>
        ))}
      </Tag>
      <button type="button" className="btn btn-ghost btn-sm add-inline" onClick={() => onChange([...items, 'New item'])}>
        <Plus size={14} aria-hidden /> Add item
      </button>
    </div>
  )
}

/** In-canvas editable rendering of a block. Blocks without inline editing show their normal view. */
function CanvasBlock({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const set = (patch: Record<string, unknown>) => onChange({ ...block, ...patch } as Block)
  switch (block.type) {
    case 'text':
      return <EditableText markdown multiline label="text" value={block.body} placeholder="Click to add text" onChange={(body) => set({ body })} />
    case 'heading':
      return <EditableText as="h3" label="heading" value={block.text} placeholder="Heading" onChange={(text) => set({ text })} />
    case 'callout':
      return (
        <aside className={`callout callout-${block.tone}`}>
          <Lightbulb size={20} className="callout-icon" aria-hidden />
          <div className="grow">
            <EditableText as="strong" className="callout-title" label="callout title" value={block.title ?? ''} placeholder={block.tone === 'why' ? 'Why this matters' : 'Title'} onChange={(t) => set({ title: t || undefined })} />
            <EditableText markdown multiline label="callout text" value={block.body} placeholder="Callout text" onChange={(body) => set({ body })} />
          </div>
        </aside>
      )
    case 'list':
      return <EditableList label="list" ordered={block.ordered} items={block.items} onChange={(items) => set({ items })} />
    case 'checklist':
      return (
        <div className="card card-flat card-tight">
          <EditableText as="h3" label="checklist title" value={block.title ?? ''} placeholder="Checklist title (optional)" onChange={(t) => set({ title: t || undefined })} />
          <EditableList label="checklist" items={block.items} onChange={(items) => set({ items })} />
        </div>
      )
    case 'doDont':
      return (
        <div className="dodont">
          <div className="do">
            <h4>✓ Do</h4>
            <EditableList label="do" items={block.do} onChange={(v) => set({ do: v })} />
          </div>
          <div className="dont">
            <h4>✕ Don’t</h4>
            <EditableList label="don’t" items={block.dont} onChange={(v) => set({ dont: v })} />
          </div>
        </div>
      )
    case 'example':
      return (
        <div className="card card-flat tinted">
          <div className="eyebrow" style={{ marginBottom: 6 }}>Example</div>
          <EditableText as="h3" label="example title" value={block.title} placeholder="Example title" onChange={(title) => set({ title })} />
          <EditableText markdown multiline label="example text" value={block.body} placeholder="Describe the example" onChange={(body) => set({ body })} />
          <div className="compare">
            <div className="before">
              <span className="tag">Before</span>
              <EditableText multiline label="before" value={block.before ?? ''} placeholder="Weak version (optional)" onChange={(v) => set({ before: v || undefined })} />
            </div>
            <div className="after">
              <span className="tag">After</span>
              <EditableText multiline label="after" value={block.after ?? ''} placeholder="Improved version (optional)" onChange={(v) => set({ after: v || undefined })} />
            </div>
          </div>
        </div>
      )
    case 'qa':
      return (
        <section className="qa">
          <EditableText as="h3" label="Q&A title" value={block.title ?? ''} placeholder="Questions & answers" onChange={(t) => set({ title: t || undefined })} />
          <div className="stack" style={{ '--gap': '8px', marginTop: 10 } as CSSProperties}>
            {block.items.map((it, i) => {
              const patch = (p: Partial<typeof it>) => set({ items: block.items.map((x, j) => (j === i ? { ...x, ...p } : x)) })
              return (
                <div key={i} className="qa-item" style={{ padding: 14 }}>
                  <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                    <span className="qa-q">Q{i + 1}</span>
                    <EditableText as="strong" className="grow" label={`question ${i + 1}`} value={it.question} placeholder="Question" onChange={(question) => patch({ question })} />
                    <button type="button" className="btn btn-ghost btn-icon btn-sm slide-x" aria-label={`Remove question ${i + 1}`} onClick={() => set({ items: block.items.filter((_, j) => j !== i) })}>×</button>
                  </div>
                  <div style={{ paddingLeft: 46, marginTop: 8 }}>
                    <EditableText markdown multiline label={`answer ${i + 1}`} value={it.answer} placeholder="Model answer" onChange={(answer) => patch({ answer })} />
                    <div className="qa-tip">
                      <Lightbulb size={15} aria-hidden />
                      <EditableText as="span" multiline label={`tip ${i + 1}`} value={it.tip ?? ''} placeholder="Tip (optional)" onChange={(tip) => patch({ tip: tip || undefined })} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <button type="button" className="btn btn-ghost btn-sm add-inline" onClick={() => set({ items: [...block.items, { question: 'New question', answer: '' }] })}>
            <Plus size={14} aria-hidden /> Add question
          </button>
        </section>
      )
    case 'quiz':
      return (
        <div className="card card-flat">
          <div className="eyebrow" style={{ marginBottom: 8 }}>Quick check</div>
          <EditableText as="h3" label="quiz question" value={block.question} placeholder="Question" onChange={(question) => set({ question })} />
          <div className="stack" style={{ '--gap': '8px', marginTop: 12 } as CSSProperties}>
            {block.options.map((o, i) => (
              <div key={i} className={`quiz-option ${i === block.answer ? 'correct' : ''}`} style={{ cursor: 'default' }}>
                <button type="button" className="quiz-letter" style={{ border: 0, cursor: 'pointer' }} aria-label={`Mark option ${i + 1} as correct`} aria-pressed={i === block.answer} onClick={() => set({ answer: i })}>
                  {String.fromCharCode(65 + i)}
                </button>
                <EditableText as="span" className="grow" label={`option ${i + 1}`} value={o} placeholder="Option" onChange={(v) => set({ options: block.options.map((x, j) => (j === i ? v : x)) })} />
              </div>
            ))}
          </div>
          <p className="subtle" style={{ marginTop: 8 }}>Click a letter to mark the correct answer.</p>
          <EditableText multiline label="explanation" value={block.explanation} placeholder="Explanation shown after answering" onChange={(explanation) => set({ explanation })} />
        </div>
      )
    default:
      return <BlockView block={block} />
  }
}

/* ─── Slides model ─────────────────────────────────────────────────────── */

export interface SlideSection {
  id: string
  label: string
  blocks: Block[]
}

export interface ExtraSlide {
  id: string
  label: string
  icon: LucideIcon
  thumb: ReactNode
  canvas: ReactNode
  panel?: ReactNode
}

export interface CoverData {
  title: string
  summary: string
  cover?: IllustrationName
  autoCover: IllustrationName
  attachments: FileAsset[]
  meta?: ReactNode
}

type SlideRef = { kind: 'cover' } | { kind: 'block'; section: string; index: number } | { kind: 'extra'; id: string } | { kind: 'files' }

const INSERT: { type: Block['type']; label: string; icon: LucideIcon }[] = [
  { type: 'text', label: 'Text', icon: AlignLeft },
  { type: 'heading', label: 'Heading', icon: Heading },
  { type: 'callout', label: 'Callout', icon: Lightbulb },
  { type: 'list', label: 'List', icon: List },
  { type: 'doDont', label: 'Do / Don’t', icon: Scale },
  { type: 'checklist', label: 'Checklist', icon: ListChecks },
  { type: 'example', label: 'Example', icon: Sparkles },
  { type: 'qa', label: 'Q&A', icon: MessageCircleQuestion },
  { type: 'quiz', label: 'Quiz', icon: CheckSquare },
  { type: 'illustration', label: 'Illustration', icon: Palette },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'file', label: 'PDF / PPT', icon: FileUp },
  { type: 'video', label: 'Video', icon: Video },
  { type: 'interactive', label: 'Widget', icon: MousePointerClick },
  { type: 'link', label: 'Link', icon: Link2 },
]

function useHistory<T>(value: T, onReplace: (v: T) => void) {
  const past = useRef<T[]>([])
  const future = useRef<T[]>([])
  const last = useRef(value)
  const skip = useRef(false)
  const [, force] = useState(0)
  useEffect(() => {
    if (value === last.current) return
    if (skip.current) skip.current = false
    else {
      past.current = [...past.current.slice(-49), last.current]
      future.current = []
    }
    last.current = value
    force((n) => n + 1)
  }, [value])
  const undo = useCallback(() => {
    const prev = past.current.pop()
    if (prev === undefined) return
    future.current.push(last.current)
    skip.current = true
    onReplace(prev)
  }, [onReplace])
  const redo = useCallback(() => {
    const next = future.current.pop()
    if (next === undefined) return
    past.current.push(last.current)
    skip.current = true
    onReplace(next)
  }, [onReplace])
  return { undo, redo, canUndo: past.current.length > 0, canRedo: future.current.length > 0 }
}

/** Slides are div buttons (their thumbnails contain real, inert content), so wire up Enter/Space. */
function activateOnKey(e: React.KeyboardEvent<HTMLElement>) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    e.currentTarget.click()
  }
}

function Thumb({ children, label, index }: { children: ReactNode; label: string; index: number }) {
  return (
    <span className="slide-thumb">
      <span className="slide-num">{index}</span>
      <span className="slide-thumb-canvas" aria-hidden inert>
        <span className="slide-thumb-inner">
          <PrintMode.Provider value={true}>{children}</PrintMode.Provider>
        </span>
      </span>
      <span className="slide-thumb-label">{label}</span>
    </span>
  )
}

export function SlideEditor<T>({
  value,
  onReplace,
  cover,
  onCoverChange,
  sections,
  onBlocksChange,
  extras = [],
  previewPath,
  pdfPath,
  onPreview,
  details,
}: {
  value: T
  onReplace: (v: T) => void
  cover: CoverData
  onCoverChange: (patch: Partial<Pick<CoverData, 'title' | 'summary' | 'cover' | 'attachments'>>) => void
  sections: SlideSection[]
  onBlocksChange: (sectionId: string, blocks: Block[]) => void
  extras?: ExtraSlide[]
  previewPath: string
  pdfPath: string
  onPreview: (path: string) => void
  details?: ReactNode
}) {
  const toast = useToast()
  const [sel, setSel] = useState<SlideRef>({ kind: 'cover' })
  const { undo, redo, canUndo, canRedo } = useHistory(value, onReplace)
  const railRef = useRef<HTMLDivElement>(null)

  // Stable keys for blocks so reordering keeps selection and thumbnails in place.
  const keySeq = useRef(0)
  const [keys, setKeys] = useState<Record<string, string[]>>(() => Object.fromEntries(sections.map((s) => [s.id, s.blocks.map(() => `k${++keySeq.current}`)])))
  const sectionKeys = useMemo(() => {
    const out: Record<string, string[]> = {}
    for (const s of sections) {
      const k = keys[s.id] ?? []
      out[s.id] = k.length === s.blocks.length ? k : s.blocks.map((_, i) => k[i] ?? `k${s.id}-${i}`)
    }
    return out
  }, [sections, keys])
  useEffect(() => {
    // Content replaced externally (undo, restore): regenerate keys when counts differ.
    setKeys((prev) => {
      let changed = false
      const next = { ...prev }
      for (const s of sections)
        if ((prev[s.id]?.length ?? -1) !== s.blocks.length) {
          next[s.id] = s.blocks.map(() => `k${++keySeq.current}`)
          changed = true
        }
      return changed ? next : prev
    })
  }, [sections])

  const selectedBlock = sel.kind === 'block' ? sections.find((s) => s.id === sel.section)?.blocks[sel.index] : undefined
  const currentSection = sel.kind === 'block' ? sel.section : sections[0]?.id

  const updateBlocks = (sectionId: string, blocks: Block[], nextKeys?: string[]) => {
    if (nextKeys) setKeys((k) => ({ ...k, [sectionId]: nextKeys }))
    onBlocksChange(sectionId, blocks)
  }

  const insert = (type: Block['type'], sectionOverride?: string) => {
    const sectionId = sectionOverride ?? currentSection
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return
    const at = sel.kind === 'block' && sel.section === sectionId ? sel.index + 1 : section.blocks.length
    const blocks = [...section.blocks]
    blocks.splice(at, 0, emptyBlock(type))
    const k = [...sectionKeys[section.id]]
    k.splice(at, 0, `k${++keySeq.current}`)
    updateBlocks(section.id, blocks, k)
    setSel({ kind: 'block', section: section.id, index: at })
  }

  const withSelected = (fn: (section: SlideSection, index: number) => void) => {
    if (sel.kind !== 'block') return
    const section = sections.find((s) => s.id === sel.section)
    if (section && section.blocks[sel.index]) fn(section, sel.index)
  }

  const duplicate = () =>
    withSelected((s, i) => {
      const blocks = [...s.blocks]
      blocks.splice(i + 1, 0, structuredClone(s.blocks[i]))
      const k = [...sectionKeys[s.id]]
      k.splice(i + 1, 0, `k${++keySeq.current}`)
      updateBlocks(s.id, blocks, k)
      setSel({ kind: 'block', section: s.id, index: i + 1 })
    })

  const remove = () =>
    withSelected((s, i) => {
      updateBlocks(
        s.id,
        s.blocks.filter((_, j) => j !== i),
        sectionKeys[s.id].filter((_, j) => j !== i),
      )
      setSel(s.blocks.length > 1 ? { kind: 'block', section: s.id, index: Math.max(0, i - 1) } : { kind: 'cover' })
      toast('Slide deleted — press Undo to bring it back')
    })

  const move = (dir: -1 | 1) =>
    withSelected((s, i) => {
      const to = i + dir
      if (to < 0 || to >= s.blocks.length) return
      const blocks = [...s.blocks]
      const [b] = blocks.splice(i, 1)
      blocks.splice(to, 0, b)
      const k = [...sectionKeys[s.id]]
      const [kk] = k.splice(i, 1)
      k.splice(to, 0, kk)
      updateBlocks(s.id, blocks, k)
      setSel({ kind: 'block', section: s.id, index: to })
    })

  // Flat slide order for keyboard navigation.
  const order: SlideRef[] = useMemo(
    () => [
      { kind: 'cover' },
      ...sections.flatMap((s) => s.blocks.map((_, index) => ({ kind: 'block' as const, section: s.id, index }))),
      ...extras.map((e) => ({ kind: 'extra' as const, id: e.id })),
      { kind: 'files' },
    ],
    [sections, extras],
  )
  const same = (a: SlideRef, b: SlideRef) => JSON.stringify(a) === JSON.stringify(b)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'z' && !typing) {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      } else if (mod && e.key.toLowerCase() === 'y' && !typing) {
        e.preventDefault()
        redo()
      } else if (mod && e.key.toLowerCase() === 'd' && !typing) {
        e.preventDefault()
        duplicate()
      } else if (!typing && railRef.current?.contains(document.activeElement)) {
        const i = order.findIndex((o) => same(o, sel))
        if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
          e.preventDefault()
          move(e.key === 'ArrowUp' ? -1 : 1)
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          const next = order[Math.min(order.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))]
          setSel(next)
        } else if ((e.key === 'Delete' || e.key === 'Backspace') && sel.kind === 'block') {
          e.preventDefault()
          remove()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Keep the selected thumbnail visible.
  useEffect(() => {
    railRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  let n = 1
  const extra = sel.kind === 'extra' ? extras.find((e) => e.id === sel.id) : undefined

  return (
    <div className="slide-editor">
      <div className="slide-ribbon" role="toolbar" aria-label="Slide editor tools">
        <div className="ribbon-group">
          <span className="ribbon-label">Insert</span>
          <div className="ribbon-buttons">
            {INSERT.map((it) => (
              <button key={it.type} type="button" className="ribbon-btn" onClick={() => insert(it.type)} title={`Insert ${it.label}`} disabled={!sections.length}>
                <it.icon size={18} aria-hidden />
                <span>{it.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-label">Arrange</span>
          <div className="ribbon-buttons">
            <button type="button" className="ribbon-btn" onClick={() => move(-1)} disabled={sel.kind !== 'block'} title="Move up (⌥↑)"><ArrowUp size={18} aria-hidden /><span>Up</span></button>
            <button type="button" className="ribbon-btn" onClick={() => move(1)} disabled={sel.kind !== 'block'} title="Move down (⌥↓)"><ArrowDown size={18} aria-hidden /><span>Down</span></button>
            <button type="button" className="ribbon-btn" onClick={duplicate} disabled={sel.kind !== 'block'} title="Duplicate (⌘D)"><Copy size={18} aria-hidden /><span>Duplicate</span></button>
            <button type="button" className="ribbon-btn danger" onClick={remove} disabled={sel.kind !== 'block'} title="Delete (Del)"><Trash2 size={18} aria-hidden /><span>Delete</span></button>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-label">Edit</span>
          <div className="ribbon-buttons">
            <button type="button" className="ribbon-btn" onClick={undo} disabled={!canUndo} title="Undo (⌘Z)"><Undo2 size={18} aria-hidden /><span>Undo</span></button>
            <button type="button" className="ribbon-btn" onClick={redo} disabled={!canRedo} title="Redo (⇧⌘Z)"><Redo2 size={18} aria-hidden /><span>Redo</span></button>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-label">View</span>
          <div className="ribbon-buttons">
            <button type="button" className="ribbon-btn" onClick={() => onPreview(previewPath)} title="Preview as a student"><Eye size={18} aria-hidden /><span>Preview</span></button>
            <button type="button" className="ribbon-btn" onClick={() => onPreview(pdfPath)} title="Open the PDF version"><FileDown size={18} aria-hidden /><span>PDF</span></button>
          </div>
        </div>
      </div>

      <div className="slide-body">
        <div className="slide-rail" ref={railRef} aria-label="Slides">
          <div role="button" tabIndex={0} className="slide-item" aria-current={sel.kind === 'cover'} onClick={() => setSel({ kind: 'cover' })} onKeyDown={activateOnKey}>
            <Thumb index={n++} label="Title slide">
              <Illustration name={cover.cover ?? cover.autoCover} title="" />
              <h1 style={{ fontSize: '2.4rem', marginTop: 16 }}>{cover.title}</h1>
            </Thumb>
          </div>
          {sections.map((s) => (
            <div key={s.id}>
              <div className="slide-section-label">{s.label}</div>
              <Reorder.Group
                axis="y"
                as="div"
                values={sectionKeys[s.id]}
                onReorder={(nextKeys: string[]) => {
                  const byKey = new Map(sectionKeys[s.id].map((k, i) => [k, s.blocks[i]]))
                  updateBlocks(s.id, nextKeys.map((k) => byKey.get(k)!), nextKeys)
                  if (sel.kind === 'block' && sel.section === s.id) {
                    const selKey = sectionKeys[s.id][sel.index]
                    setSel({ kind: 'block', section: s.id, index: nextKeys.indexOf(selKey) })
                  }
                }}
              >
                {s.blocks.map((b, i) => {
                  const k = sectionKeys[s.id][i]
                  const num = n++
                  const current = sel.kind === 'block' && sel.section === s.id && sel.index === i
                  return (
                    <Reorder.Item key={k} value={k} as="div">
                      <div role="button" tabIndex={0} className="slide-item" aria-current={current} onClick={() => setSel({ kind: 'block', section: s.id, index: i })} onKeyDown={activateOnKey}>
                        <Thumb index={num} label={INSERT.find((x) => x.type === b.type)?.label ?? b.type}>
                          <div className="prose">
                            <BlockView block={b} />
                          </div>
                        </Thumb>
                      </div>
                    </Reorder.Item>
                  )
                })}
              </Reorder.Group>
              {s.blocks.length === 0 && (
                <button type="button" className="btn btn-ghost btn-sm" style={{ margin: '4px 0 8px' }} onClick={() => insert('text', s.id)}>
                  <Plus size={14} aria-hidden /> Add a slide
                </button>
              )}
            </div>
          ))}
          {extras.length > 0 && <div className="slide-section-label">More</div>}
          {extras.map((e) => (
            <div key={e.id} role="button" tabIndex={0} className="slide-item" aria-current={sel.kind === 'extra' && sel.id === e.id} onClick={() => setSel({ kind: 'extra', id: e.id })} onKeyDown={activateOnKey}>
              <Thumb index={n++} label={e.label}>{e.thumb}</Thumb>
            </div>
          ))}
          <div role="button" tabIndex={0} className="slide-item" aria-current={sel.kind === 'files'} onClick={() => setSel({ kind: 'files' })} onKeyDown={activateOnKey}>
            <Thumb index={n++} label={`Downloads (${cover.attachments.length})`}>
              <h2>Downloads</h2>
              {cover.attachments.map((f) => <p key={f.url}>📄 {f.name}</p>)}
            </Thumb>
          </div>
        </div>

        <div className="slide-stage">
          <div className="slide-canvas">
            {sel.kind === 'cover' && (
              <div className="stack" style={{ '--gap': '16px' } as CSSProperties}>
                <div className="lesson-cover" style={{ maxWidth: 'none' }}>
                  <Illustration name={cover.cover ?? cover.autoCover} title="" />
                </div>
                <EditableText as="h1" label="title" value={cover.title} placeholder="Title" onChange={(title) => onCoverChange({ title })} style={{ fontSize: 'clamp(1.8rem, 1.4rem + 1.4vw, 2.5rem)' }} />
                <EditableText as="p" className="lead" multiline label="summary" value={cover.summary} placeholder="One-sentence summary" onChange={(summary) => onCoverChange({ summary })} />
                {cover.meta}
              </div>
            )}
            {sel.kind === 'block' && selectedBlock && (
              <div className="prose" style={{ maxWidth: 'none' }}>
                <CanvasBlock block={selectedBlock} onChange={(b) => withSelected((s, i) => updateBlocks(s.id, s.blocks.map((x, j) => (j === i ? b : x))))} />
              </div>
            )}
            {sel.kind === 'block' && !selectedBlock && <p className="muted">Select a slide on the left, or insert one from the ribbon.</p>}
            {extra?.canvas}
            {sel.kind === 'files' && (
              <div className="stack">
                <h2>Downloads</h2>
                <p className="muted">Files students can download with this content — slide decks, PDF workbooks, templates.</p>
                {cover.attachments.map((f) => <FileCard key={f.url} file={f} />)}
                {!cover.attachments.length && <p className="subtle">No files yet.</p>}
              </div>
            )}
          </div>
          <p className="subtle slide-hint">Click any text on the slide to edit it. ⌘Z undo · ⌘D duplicate · ↑↓ move between slides · ⌥↑↓ reorder</p>
        </div>

        <aside className="slide-panel" aria-label="Format">
          <h2 className="slide-panel-title">Format</h2>
          {sel.kind === 'cover' && (
            <div className="stack">
              <IllustrationPicker allowAuto value={cover.cover} onChange={(v) => onCoverChange({ cover: v })} />
              {details}
            </div>
          )}
          {sel.kind === 'block' && selectedBlock && (
            <div className="stack" key={`${sel.section}-${sectionKeys[sel.section]?.[sel.index]}`}>
              <span className="badge badge-primary" style={{ width: 'fit-content' }}>{INSERT.find((x) => x.type === selectedBlock.type)?.label}</span>
              <BlockForm block={selectedBlock} onChange={(b) => withSelected((s, i) => updateBlocks(s.id, s.blocks.map((x, j) => (j === i ? b : x))))} />
              {sections.length > 1 && (
                <div className="field">
                  <label htmlFor="move-section">Move to section</label>
                  <select
                    id="move-section"
                    className="select"
                    value={sel.section}
                    onChange={(e) => {
                      const to = e.target.value
                      withSelected((s, i) => {
                        const target = sections.find((x) => x.id === to)!
                        const b = s.blocks[i]
                        updateBlocks(s.id, s.blocks.filter((_, j) => j !== i), sectionKeys[s.id].filter((_, j) => j !== i))
                        updateBlocks(target.id, [...target.blocks, b], [...sectionKeys[target.id], `k${++keySeq.current}`])
                        setSel({ kind: 'block', section: to, index: target.blocks.length })
                      })
                    }}
                  >
                    {sections.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}
          {extra?.panel}
          {sel.kind === 'files' && (
            <div className="stack">
              <DocUploadButton className="btn btn-primary" onUploaded={(f) => onCoverChange({ attachments: [...cover.attachments, f] })} />
              <p className="subtle">PDF, PowerPoint (.ppt/.pptx), Keynote or Word. Students see these as downloads.</p>
              {cover.attachments.map((f, i) => (
                <div key={f.url} className="row" style={{ flexWrap: 'nowrap' }}>
                  <span className="grow small" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <button type="button" className="btn btn-ghost btn-sm" disabled={i === 0} onClick={() => { const a = [...cover.attachments]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; onCoverChange({ attachments: a }) }} aria-label={`Move ${f.name} up`}><ArrowUp size={14} /></button>
                  <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--c-danger)' }} onClick={() => onCoverChange({ attachments: cover.attachments.filter((_, j) => j !== i) })} aria-label={`Remove ${f.name}`}><Trash2 size={14} /></button>
                </div>
              ))}
              <p className="subtle">To show a PDF or deck inside the lesson itself, insert a “PDF / PPT” slide from the ribbon.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
