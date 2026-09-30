import { ExternalLink } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { BookmarkButton } from '../components/BookmarkButton'
import { LevelFilter } from '../components/Search'
import { EmptyState, LevelBadge, PageHeader, Reveal } from '../components/ui'
import type { LevelId, ResourceType } from '../content/types'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'

const TYPES: ResourceType[] = ['Article', 'Tool', 'Template', 'Video', 'Book', 'Community', 'Course']

export function ResourcesPage() {
  const { content } = useContent()
  const { state } = useLearner()
  const [level, setLevel] = useState<LevelId | 'any'>(state.level ?? 'any')
  const [type, setType] = useState<ResourceType | null>(null)
  const available = TYPES.filter((t) => content.resources.some((r) => r.type === t))
  const list = content.resources.filter((r) => (level === 'any' || r.level === level || r.level === 'all') && (!type || r.type === type))

  return (
    <div className="page">
      <PageHeader eyebrow="Resources" title="Hand-picked resources">
        Trusted references, tools and reading — filtered to your level so you only see what’s useful now.
      </PageHeader>
      <div className="stack" style={{ '--gap': '12px', marginBottom: 'var(--space-5)' } as CSSProperties}>
        <LevelFilter value={level} onChange={setLevel} />
        <div className="chip-group" role="radiogroup" aria-label="Filter by type">
          <button type="button" role="radio" className="chip" aria-checked={!type} onClick={() => setType(null)}>All types</button>
          {available.map((t) => (
            <button key={t} type="button" role="radio" className="chip" aria-checked={type === t} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
      </div>
      {list.length === 0 ? (
        <EmptyState icon="Library" title="No resources match" />
      ) : (
        <div className="grid grid-3">
          {list.map((r, i) => {
            const lvl = content.levels.find((l) => l.id === r.level)
            return (
              <Reveal key={r.id} delay={(i % 3) * 0.04}>
                <div className="card stack" style={{ height: '100%', '--gap': '10px' } as CSSProperties}>
                  <div className="row-between">
                    <span className="badge">{r.type}</span>
                    <BookmarkButton kind="resource" id={r.id} title={r.title} compact />
                  </div>
                  <h2 style={{ fontSize: '1.1rem' }}>{r.title}</h2>
                  <p className="muted small">{r.description}</p>
                  <div className="row-between" style={{ marginTop: 'auto' }}>
                    {lvl ? <LevelBadge level={lvl} /> : <span className="badge">All levels</span>}
                    <a href={r.url} target="_blank" rel="noreferrer" className="btn btn-soft btn-sm">
                      Open <ExternalLink size={14} aria-hidden />
                      <span className="sr-only">{r.title} (opens in a new tab)</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
