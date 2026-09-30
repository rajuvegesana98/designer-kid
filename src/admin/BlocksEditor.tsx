import { Eye, Pencil } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { BlockView } from '../components/Blocks'
import { WIDGET_NAMES } from '../components/widgets'
import type { Block, WidgetName } from '../content/types'
import { FileCard } from '../components/Blocks'
import { IllustrationPicker } from './IllustrationPicker'
import { DocUploadButton } from './uploads'
import { AddButton, ImageField, LinesField, NumberField, SelectField, SortableList, TextArea, TextField } from './fields'

const BLOCK_TYPES: { value: Block['type']; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'heading', label: 'Heading' },
  { value: 'callout', label: 'Callout (why / tip / warning)' },
  { value: 'list', label: 'List' },
  { value: 'doDont', label: 'Do / Don’t' },
  { value: 'checklist', label: 'Checklist' },
  { value: 'example', label: 'Example (before / after)' },
  { value: 'quiz', label: 'Quick-check quiz' },
  { value: 'interactive', label: 'Interactive widget' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video (YouTube / Vimeo)' },
  { value: 'link', label: 'Link' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'qa', label: 'Questions & answers' },
  { value: 'file', label: 'PDF / slides file' },
]

export function emptyBlock(type: Block['type']): Block {
  switch (type) {
    case 'text': return { type, body: '' }
    case 'heading': return { type, text: '' }
    case 'callout': return { type, tone: 'why', body: '' }
    case 'list': return { type, items: [] }
    case 'doDont': return { type, do: [], dont: [] }
    case 'checklist': return { type, items: [] }
    case 'example': return { type, title: '', body: '' }
    case 'quiz': return { type, question: '', options: ['', '', '', ''], answer: 0, explanation: '' }
    case 'interactive': return { type, widget: 'contrast-checker' }
    case 'image': return { type, url: '', alt: '' }
    case 'video': return { type, url: '', title: '' }
    case 'link': return { type, url: '', title: '' }
    case 'illustration': return { type, name: 'design-process' }
    case 'qa': return { type, title: 'Questions & answers', items: [{ question: '', answer: '' }] }
    case 'file': return { type, file: { url: '', name: '', mimeType: '' }, display: 'embed' }
  }
}

function blockSummary(b: Block): string {
  switch (b.type) {
    case 'text': return b.body.slice(0, 80)
    case 'heading': return b.text
    case 'callout': return `${b.tone}: ${b.title ?? b.body.slice(0, 60)}`
    case 'list':
    case 'checklist': return `${b.items.length} items`
    case 'doDont': return `${b.do.length} do · ${b.dont.length} don’t`
    case 'example': return b.title
    case 'quiz': return b.question
    case 'interactive': return b.widget
    case 'image': return b.alt || b.url
    case 'video':
    case 'link': return b.title
    case 'illustration': return b.name
    case 'qa': return `${b.items.length} questions${b.title ? ` · ${b.title}` : ''}`
    case 'file': return b.title || b.file.name || 'No file yet'
  }
}

export function BlockForm({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const set = (patch: Record<string, unknown>) => onChange({ ...block, ...patch } as Block)
  switch (block.type) {
    case 'text':
      return <TextArea label="Text" rows={5} value={block.body} onChange={(body) => set({ body })} hint="Supports **bold**, *italic*, `code` and [links](https://…). Leave a blank line between paragraphs." />
    case 'heading':
      return <TextField label="Heading" value={block.text} onChange={(text) => set({ text })} />
    case 'callout':
      return (
        <>
          <SelectField label="Tone" value={block.tone} onChange={(tone) => set({ tone })} options={[{ value: 'why', label: 'Why it matters' }, { value: 'tip', label: 'Tip' }, { value: 'warning', label: 'Warning' }]} />
          <TextField label="Title (optional)" value={block.title ?? ''} onChange={(title) => set({ title: title || undefined })} />
          <TextArea label="Body" value={block.body} onChange={(body) => set({ body })} />
        </>
      )
    case 'list':
      return (
        <>
          <SelectField label="Style" value={block.ordered ? 'ol' : 'ul'} onChange={(v) => set({ ordered: v === 'ol' })} options={[{ value: 'ul', label: 'Bullets' }, { value: 'ol', label: 'Numbered' }]} />
          <LinesField label="Items" value={block.items} onChange={(items) => set({ items })} />
        </>
      )
    case 'checklist':
      return (
        <>
          <TextField label="Title (optional)" value={block.title ?? ''} onChange={(title) => set({ title: title || undefined })} />
          <LinesField label="Items" value={block.items} onChange={(items) => set({ items })} />
        </>
      )
    case 'doDont':
      return (
        <div className="grid grid-2">
          <LinesField label="Do" value={block.do} onChange={(v) => set({ do: v })} />
          <LinesField label="Don’t" value={block.dont} onChange={(v) => set({ dont: v })} />
        </div>
      )
    case 'example':
      return (
        <>
          <TextField label="Title" value={block.title} onChange={(title) => set({ title })} />
          <TextArea label="Body" value={block.body} onChange={(body) => set({ body })} />
          <div className="grid grid-2">
            <TextArea label="Before (optional)" rows={2} value={block.before ?? ''} onChange={(before) => set({ before: before || undefined })} />
            <TextArea label="After (optional)" rows={2} value={block.after ?? ''} onChange={(after) => set({ after: after || undefined })} />
          </div>
        </>
      )
    case 'quiz':
      return (
        <>
          <TextField label="Question" value={block.question} onChange={(question) => set({ question })} />
          <LinesField label="Options" value={block.options} onChange={(options) => set({ options, answer: Math.min(block.answer, Math.max(0, options.length - 1)) })} hint="One option per line." />
          <NumberField label="Correct option" hint={`1 = first option. Currently: “${block.options[block.answer] ?? ''}”`} value={block.answer + 1} min={1} max={Math.max(1, block.options.length)} onChange={(v) => set({ answer: v - 1 })} />
          <TextArea label="Explanation" rows={2} value={block.explanation} onChange={(explanation) => set({ explanation })} />
        </>
      )
    case 'interactive':
      return (
        <>
          <SelectField<WidgetName> label="Widget" value={block.widget} onChange={(widget) => set({ widget })} options={WIDGET_NAMES.map((w) => ({ value: w, label: w }))} />
          <TextField label="Caption (optional)" value={block.caption ?? ''} onChange={(caption) => set({ caption: caption || undefined })} />
        </>
      )
    case 'image':
      return (
        <>
          <ImageField label="Image" value={block.url} onChange={(url) => set({ url })} folder="courses" />
          <TextField label="Alt text" required value={block.alt} onChange={(alt) => set({ alt })} hint="Describe what the image shows for screen-reader users." />
          <TextField label="Caption (optional)" value={block.caption ?? ''} onChange={(caption) => set({ caption: caption || undefined })} />
        </>
      )
    case 'video':
      return (
        <>
          <TextField label="Video URL" type="url" value={block.url} onChange={(url) => set({ url })} hint="YouTube or Vimeo links are embedded; other links open in a new tab." />
          <TextField label="Title" required value={block.title} onChange={(title) => set({ title })} />
        </>
      )
    case 'link':
      return (
        <>
          <TextField label="URL" type="url" value={block.url} onChange={(url) => set({ url })} />
          <TextField label="Title" value={block.title} onChange={(title) => set({ title })} />
          <TextField label="Description (optional)" value={block.description ?? ''} onChange={(description) => set({ description: description || undefined })} />
        </>
      )
    case 'illustration':
      return (
        <>
          <IllustrationPicker value={block.name} onChange={(name) => set({ name })} />
          <TextField label="Caption (optional)" value={block.caption ?? ''} onChange={(caption) => set({ caption: caption || undefined })} />
        </>
      )
    case 'qa':
      return (
        <>
          <TextField label="Section title (optional)" value={block.title ?? ''} onChange={(title) => set({ title: title || undefined })} />
          {block.items.map((it, i) => (
            <fieldset key={i} className="card card-flat card-tight stack" style={{ margin: 0 }}>
              <legend className="small" style={{ fontWeight: 700, padding: '0 6px' }}>Question {i + 1}</legend>
              <TextField label="Question" value={it.question} onChange={(question) => set({ items: block.items.map((x, j) => (j === i ? { ...x, question } : x)) })} />
              <TextArea label="Answer" rows={4} value={it.answer} onChange={(answer) => set({ items: block.items.map((x, j) => (j === i ? { ...x, answer } : x)) })} />
              <TextField label="Tip (optional)" value={it.tip ?? ''} onChange={(tip) => set({ items: block.items.map((x, j) => (j === i ? { ...x, tip: tip || undefined } : x)) })} />
              <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--c-danger)', width: 'fit-content' }} onClick={() => set({ items: block.items.filter((_, j) => j !== i) })}>Remove question</button>
            </fieldset>
          ))}
          <button type="button" className="btn btn-soft btn-sm" style={{ width: 'fit-content' }} onClick={() => set({ items: [...block.items, { question: '', answer: '' }] })}>Add question</button>
        </>
      )
    case 'file':
      return (
        <>
          {block.file.url ? <FileCard file={block.file} title={block.title} /> : <p className="muted small">No file yet — upload a PDF or PowerPoint.</p>}
          <DocUploadButton onUploaded={(file) => set({ file, title: block.title || file.name.replace(/\.\w+$/, '') })}>{block.file.url ? 'Replace file' : 'Upload PDF or PPT'}</DocUploadButton>
          <TextField label="Title (optional)" value={block.title ?? ''} onChange={(title) => set({ title: title || undefined })} />
          <SelectField label="Display" value={block.display} onChange={(display) => set({ display })} options={[{ value: 'embed', label: 'Show inside the page + download' }, { value: 'download', label: 'Download button only' }]} hint="PDFs preview in the page. PowerPoint previews need Supabase (a public link); otherwise students download it." />
        </>
      )
  }
}

/** Blocks have no ids, so the editor keeps a parallel list of stable keys. */
let keySeq = 0
const nextKey = () => `b${++keySeq}`

export function BlocksEditor({ blocks, onChange, label }: { blocks: Block[]; onChange: (b: Block[]) => void; label: string }) {
  const [keys, setKeys] = useState<string[]>(() => blocks.map(nextKey))
  const [open, setOpen] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [addType, setAddType] = useState<Block['type']>('text')

  // Content replaced from outside (e.g. switching lesson or restoring a version).
  useEffect(() => {
    if (keys.length !== blocks.length) setKeys(blocks.map(nextKey))
  }, [blocks.length]) // eslint-disable-line react-hooks/exhaustive-deps
  const safeKeys = keys.length === blocks.length ? keys : blocks.map((_, i) => `tmp${i}`)

  const replace = (i: number, b: Block) => {
    const next = [...blocks]
    next[i] = b
    onChange(next)
  }

  return (
    <div className="stack" style={{ '--gap': '10px' } as CSSProperties}>
      {blocks.length === 0 && <p className="muted small">No blocks yet.</p>}
      <SortableList
        label={label}
        items={blocks}
        keys={safeKeys}
        onReorder={(next, nextKeys) => {
          setKeys(nextKeys)
          onChange(next)
        }}
        onRemove={(i) => {
          setKeys(safeKeys.filter((_, j) => j !== i))
          onChange(blocks.filter((_, j) => j !== i))
        }}
        removeLabel="Delete block"
        render={(b, i, k) => {
          const isOpen = open === k
          const isPreview = preview === k
          return (
            <div className="stack" style={{ '--gap': '10px' } as CSSProperties}>
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                <button type="button" className="grow" style={{ textAlign: 'left', background: 'none', border: 0, cursor: 'pointer', padding: '6px 0', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : k)}>
                  <span className="badge badge-primary" style={{ marginRight: 8 }}>{BLOCK_TYPES.find((t) => t.value === b.type)?.label.split(' (')[0]}</span>
                  <span className="small muted">{blockSummary(b) || 'Empty'}</span>
                </button>
                <button type="button" className="btn btn-ghost btn-icon btn-sm" aria-label={isPreview ? 'Hide preview' : 'Preview block'} aria-pressed={isPreview} onClick={() => setPreview(isPreview ? null : k)}>
                  <Eye size={16} />
                </button>
                <button type="button" className="btn btn-ghost btn-icon btn-sm" aria-label={isOpen ? 'Close editor' : 'Edit block'} aria-pressed={isOpen} onClick={() => setOpen(isOpen ? null : k)}>
                  <Pencil size={16} />
                </button>
              </div>
              {isOpen && (
                <div className="stack" style={{ padding: '4px 0 8px' }}>
                  <BlockForm block={b} onChange={(nb) => replace(i, nb)} />
                </div>
              )}
              {isPreview && (
                <div className="prose" style={{ padding: 12, borderRadius: 12, background: 'var(--c-bg)' }}>
                  <BlockView block={b} />
                </div>
              )}
            </div>
          )
        }}
      />
      <div className="row">
        <select className="select" aria-label="Block type to add" value={addType} onChange={(e) => setAddType(e.target.value as Block['type'])} style={{ width: 'auto', minWidth: 220 }}>
          {BLOCK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <AddButton
          onClick={() => {
            const k = nextKey()
            setKeys([...safeKeys, k])
            onChange([...blocks, emptyBlock(addType)])
            setOpen(k)
          }}
        >
          Add block
        </AddButton>
      </div>
    </div>
  )
}
