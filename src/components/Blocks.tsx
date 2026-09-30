import { motion } from 'motion/react'
import { Check, ChevronDown, CircleAlert, Download, ExternalLink, FileText, Lightbulb, MessageCircleQuestion, Presentation, Sparkles, X } from 'lucide-react'
import { createContext, useContext, useState } from 'react'
import type { Block, FileAsset } from '../content/types'
import { inline, Markdown } from '../lib/markdown'
import { Illustration } from './illustrationLibrary'
import { InteractiveWidget } from './widgets'

/** True when rendering for print / PDF: Q&A expands, interactive parts become static. */
export const PrintMode = createContext(false)

export function isPdf(f: FileAsset) {
  return f.mimeType === 'application/pdf' || /\.pdf($|\?)/i.test(f.name)
}
export function isSlides(f: FileAsset) {
  return /powerpoint|presentation|keynote/i.test(f.mimeType) || /\.(pptx?|key|odp)($|\?)/i.test(f.name)
}
export function formatBytes(n?: number) {
  if (!n) return ''
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

/** Opens or downloads an uploaded file. Data-URL files (browser-only mode) get a proper filename. */
export function FileCard({ file, title }: { file: FileAsset; title?: string }) {
  const IconCmp = isSlides(file) ? Presentation : FileText
  const kind = isPdf(file) ? 'PDF' : isSlides(file) ? 'Slides' : 'File'
  return (
    <a href={file.url} download={file.name} target="_blank" rel="noreferrer" className="card card-flat card-tight card-link row file-card" style={{ flexWrap: 'nowrap' }}>
      <span className="icon-tile" style={{ '--tile': isSlides(file) ? 'var(--c-secondary)' : 'var(--c-danger)' } as React.CSSProperties}>
        <IconCmp size={20} aria-hidden />
      </span>
      <span className="grow" style={{ minWidth: 0 }}>
        <strong style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title || file.name}</strong>
        <span className="subtle">{kind}{file.size ? ` · ${formatBytes(file.size)}` : ''}</span>
      </span>
      <Download size={18} aria-hidden />
      <span className="sr-only">Download {title || file.name}</span>
    </a>
  )
}

function FileBlock({ block }: { block: Extract<Block, { type: 'file' }> }) {
  const print = useContext(PrintMode)
  const { file } = block
  const publicUrl = /^https?:\/\//.test(file.url)
  const embedSrc =
    block.display === 'embed' && !print
      ? isPdf(file)
        ? file.url
        : isSlides(file) && publicUrl
          ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`
          : null
      : null
  return (
    <div className="stack" style={{ '--gap': '10px' } as React.CSSProperties}>
      {embedSrc && (
        <div style={{ aspectRatio: isSlides(file) ? '16 / 10' : '4 / 5', maxHeight: '80vh', borderRadius: 'var(--r-card)', overflow: 'hidden', border: '1px solid var(--c-line)', background: 'var(--c-surface-2)' }}>
          <iframe src={embedSrc} title={block.title || file.name} loading="lazy" style={{ width: '100%', height: '100%', border: 0 }} />
        </div>
      )}
      <FileCard file={file} title={block.title} />
    </div>
  )
}

function InteractiveBlock({ widget, caption }: { widget: Extract<Block, { type: 'interactive' }>['widget']; caption?: string }) {
  const print = useContext(PrintMode)
  if (print)
    return (
      <p className="callout callout-tip">
        <Sparkles size={18} aria-hidden /> <span>Interactive example ({widget.replace(/-/g, ' ')}) — open this lesson on Designer Kid to try it.{caption ? ` ${caption}` : ''}</span>
      </p>
    )
  return <InteractiveWidget widget={widget} caption={caption} />
}

function QA({ block }: { block: Extract<Block, { type: 'qa' }> }) {
  const print = useContext(PrintMode)
  return (
    <section className="qa" aria-label={block.title ?? 'Questions and answers'}>
      {block.title && (
        <h3 className="row" style={{ '--gap': '8px', marginBottom: 12 } as React.CSSProperties}>
          <MessageCircleQuestion size={20} aria-hidden style={{ color: 'var(--c-primary-text)' }} /> {block.title}
        </h3>
      )}
      <div className="stack" style={{ '--gap': '8px' } as React.CSSProperties}>
        {block.items.map((it, i) => (
          <details key={i} className="qa-item" open={print || undefined}>
            <summary>
              <span className="qa-q" aria-hidden>Q{i + 1}</span>
              <span className="grow">{inline(it.question)}</span>
              <ChevronDown size={18} aria-hidden className="faq-chevron" />
            </summary>
            <div className="qa-a">
              <Markdown text={it.answer} className="stack" />
              {it.tip && (
                <p className="qa-tip">
                  <Lightbulb size={15} aria-hidden /> <span><strong>Tip:</strong> {inline(it.tip)}</span>
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

function Quiz({ block }: { block: Extract<Block, { type: 'quiz' }> }) {
  const print = useContext(PrintMode)
  const [picked, setPicked] = useState<number | null>(print ? block.answer : null)
  const answered = picked !== null
  return (
    <div className="card card-flat" role="group" aria-label="Quick check">
      <div className="eyebrow" style={{ marginBottom: 8 }}>Quick check</div>
      <h3 style={{ marginBottom: 14 }}>{block.question}</h3>
      <div className="stack" style={{ '--gap': '8px' } as React.CSSProperties}>
        {block.options.map((opt, i) => {
          const state = !answered ? '' : i === block.answer ? 'correct' : i === picked ? 'wrong' : ''
          return (
            <button key={i} type="button" className={`quiz-option ${state}`} disabled={answered} onClick={() => setPicked(i)} aria-pressed={picked === i}>
              <span className="quiz-letter" aria-hidden>
                {state === 'correct' ? <Check size={14} /> : state === 'wrong' ? <X size={14} /> : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
      {answered && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 14 }} aria-live="polite">
          <strong>{picked === block.answer ? 'Correct. ' : 'Not quite. '}</strong>
          <span className="muted">{block.explanation}</span>
          {picked !== block.answer && (
            <div style={{ marginTop: 10 }}>
              <button className="btn btn-sm" onClick={() => setPicked(null)}>Try again</button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return <Markdown text={block.body} className="stack" />
    case 'heading':
      return <h3>{block.text}</h3>
    case 'callout': {
      const IconCmp = block.tone === 'tip' ? Lightbulb : block.tone === 'warning' ? CircleAlert : Sparkles
      const title = block.title ?? (block.tone === 'why' ? 'Why this matters' : block.tone === 'tip' ? 'Tip' : 'Watch out')
      return (
        <aside className={`callout callout-${block.tone}`}>
          <IconCmp size={20} className="callout-icon" aria-hidden />
          <div>
            <strong className="callout-title">{title}</strong>
            <Markdown text={block.body} className="stack" />
          </div>
        </aside>
      )
    }
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag>
          {block.items.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </Tag>
      )
    }
    case 'doDont':
      return (
        <div className="dodont">
          <div className="do">
            <h4><Check size={18} aria-hidden /> Do</h4>
            <ul>
              {block.do.map((d, i) => (
                <li key={i}><Check size={16} aria-hidden style={{ flexShrink: 0, marginTop: 4, color: 'var(--c-accent)' }} /><span>{inline(d)}</span></li>
              ))}
            </ul>
          </div>
          <div className="dont">
            <h4><X size={18} aria-hidden /> Don’t</h4>
            <ul>
              {block.dont.map((d, i) => (
                <li key={i}><X size={16} aria-hidden style={{ flexShrink: 0, marginTop: 4, color: 'var(--c-danger)' }} /><span>{inline(d)}</span></li>
              ))}
            </ul>
          </div>
        </div>
      )
    case 'checklist':
      return (
        <div className="card card-flat card-tight">
          {block.title && <h4 style={{ marginBottom: 8 }}>{block.title}</h4>}
          <ul className="list">
            {block.items.map((item, i) => (
              <li key={i} className="row" style={{ padding: '6px 0', flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                <span className="icon-tile icon-tile-sm" style={{ width: 24, height: 24, borderRadius: 7, '--tile': 'var(--c-accent)' } as React.CSSProperties} aria-hidden>
                  <Check size={14} />
                </span>
                <span>{inline(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    case 'example':
      return (
        <div className="card card-flat tinted">
          <div className="eyebrow" style={{ marginBottom: 6 }}>Example</div>
          <h3 style={{ marginBottom: 10 }}>{block.title}</h3>
          <Markdown text={block.body} className="stack" />
          {(block.before || block.after) && (
            <div className="compare">
              {block.before && (
                <div className="before">
                  <span className="tag">Before</span>
                  {inline(block.before)}
                </div>
              )}
              {block.after && (
                <div className="after">
                  <span className="tag">After</span>
                  {inline(block.after)}
                </div>
              )}
            </div>
          )}
        </div>
      )
    case 'quiz':
      return <Quiz block={block} />
    case 'interactive':
      return <InteractiveBlock widget={block.widget} caption={block.caption} />
    case 'illustration':
      return (
        <figure className="illustration-block">
          <Illustration name={block.name} title={block.caption ?? ''} />
          {block.caption && <figcaption className="subtle">{block.caption}</figcaption>}
        </figure>
      )
    case 'qa':
      return <QA block={block} />
    case 'file':
      return <FileBlock block={block} />
    case 'image':
      return block.url ? (
        <figure style={{ margin: 0 }}>
          <img src={block.url} alt={block.alt} loading="lazy" decoding="async" style={{ borderRadius: 'var(--r-card)', border: '1px solid var(--c-line)' }} />
          {block.caption && <figcaption className="subtle" style={{ marginTop: 8 }}>{block.caption}</figcaption>}
        </figure>
      ) : null
    case 'video': {
      const embed = toEmbed(block.url)
      return embed ? (
        <div style={{ aspectRatio: '16 / 9', borderRadius: 'var(--r-card)', overflow: 'hidden', border: '1px solid var(--c-line)' }}>
          <iframe src={embed} title={block.title} loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', border: 0 }} />
        </div>
      ) : (
        <a href={block.url} target="_blank" rel="noreferrer" className="btn">
          Watch: {block.title} <ExternalLink size={16} aria-hidden />
        </a>
      )
    }
    case 'link':
      return (
        <a href={block.url} target="_blank" rel="noreferrer" className="card card-flat card-tight card-link row" style={{ flexWrap: 'nowrap' }}>
          <span className="grow">
            <strong style={{ display: 'block' }}>{block.title}</strong>
            {block.description && <span className="small muted">{block.description}</span>}
          </span>
          <ExternalLink size={18} aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )
  }
}

function toEmbed(url: string): string | null {
  const yt = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/.exec(url)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vimeo = /vimeo\.com\/(\d+)/.exec(url)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  )
}
