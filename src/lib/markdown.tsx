import { Fragment, type ReactNode } from 'react'

/**
 * Tiny, safe markdown subset for admin-authored text:
 * **bold**, *italic*, `code`, [label](https://url) and blank-line paragraphs.
 * Produces React elements (never raw HTML), so content can't inject markup.
 */
const TOKEN = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g

function safeHref(url: string) {
  return /^(https?:|mailto:|\/)/i.test(url) ? url : '#'
}

export function inline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>
    if (part.startsWith('[')) {
      const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part)
      if (m) {
        const external = /^https?:/i.test(m[2])
        return (
          <a key={i} href={safeHref(m[2])} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
            {m[1]}
          </a>
        )
      }
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
    return <Fragment key={i}>{part}</Fragment>
  })
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim())
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i}>{inline(p.trim())}</p>
      ))}
    </div>
  )
}

export function plain(text: string) {
  return text.replace(/\*\*|`|\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}
