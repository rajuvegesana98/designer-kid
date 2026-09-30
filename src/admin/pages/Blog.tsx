import { Eye, EyeOff, Plus, Star, Trash2 } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { ConfirmDialog, EmptyState, PageHeader, Tabs } from '../../components/ui'
import type { BlogPost } from '../../content/types'
import { useToast } from '../../state/ui'
import { ImageField, LinesField, NumberField, TextField, Toggle } from '../fields'
import { EditableText, SlideEditor } from '../SlideEditor'
import { newId, slugify, useAdmin } from '../state'

type Filter = 'all' | 'published' | 'draft'

export function BlogAdmin() {
  const { draft, update, openPreview } = useAdmin()
  const toast = useToast()
  const posts = [...(draft.blog ?? [])].sort((a, b) => b.date.localeCompare(a.date))
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [q, setQ] = useState('')
  const [confirm, setConfirm] = useState(false)
  const current = posts.find((p) => p.id === selected)
  const set = (fn: (p: BlogPost) => void) => update((d) => fn(d.blog.find((x) => x.id === selected)!))
  const inNav = draft.navigation.some((n) => n.path === '/blog')
  const list = posts.filter((p) => (filter === 'all' || (filter === 'published') === p.published) && p.title.toLowerCase().includes(q.toLowerCase()))

  const create = () => {
    const title = 'Untitled article'
    const p: BlogPost = {
      id: newId('blog', title),
      slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 5)}`,
      title,
      excerpt: '',
      cover: 'design-process',
      coverImage: '',
      author: draft.mentor.name || 'Designer Kid',
      date: new Date().toISOString().slice(0, 10),
      tags: [],
      minutes: 5,
      blocks: [{ type: 'text', body: '' }],
      featured: false,
      published: false,
    }
    update((d) => { d.blog = [p, ...(d.blog ?? [])] })
    setSelected(p.id)
  }

  const slugTaken = (slug: string) => posts.some((p) => p.slug === slug && p.id !== selected)

  return (
    <>
      <PageHeader title="Blog" eyebrow="Content" actions={<button className="btn btn-primary" onClick={create}><Plus size={16} aria-hidden /> New article</button>}>
        Write and edit articles like slides. Drafts stay private until you mark them published and publish the site.
      </PageHeader>

      {!inNav && (
        <div className="callout row-between" style={{ marginBottom: 'var(--space-4)' }}>
          <span>The Blog isn’t in your site menu yet.</span>
          <button className="btn btn-sm" onClick={() => update((d) => { d.navigation.push({ id: 'blog', label: 'Blog', path: '/blog', visible: true }) })}>Add “Blog” to the menu</button>
        </div>
      )}

      {!current ? (
        <div className="stack">
          <div className="row">
            <input className="input" style={{ maxWidth: 300 }} placeholder="Search articles" aria-label="Search articles" value={q} onChange={(e) => setQ(e.target.value)} />
            <Tabs<Filter> id="blogf" label="Filter" value={filter} onChange={setFilter} tabs={[{ value: 'all', label: `All (${posts.length})` }, { value: 'published', label: 'Published' }, { value: 'draft', label: 'Drafts' }]} />
          </div>
          {list.length === 0 ? (
            <EmptyState icon="BookOpen" title="No articles here" action={<button className="btn btn-primary" onClick={create}>Write an article</button>} />
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th scope="col">Article</th><th scope="col">Tags</th><th scope="col">Date</th><th scope="col">Status</th></tr></thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <button className="btn btn-ghost btn-sm" style={{ padding: 0, height: 'auto', minHeight: 0, textAlign: 'left', display: 'block', whiteSpace: 'normal' }} onClick={() => setSelected(p.id)}>
                          <strong>{p.title}</strong> {p.featured && <Star size={13} aria-label="Featured" style={{ color: '#B7791F' }} />}
                          <span className="subtle" style={{ display: 'block', fontWeight: 400 }}>/blog/{p.slug}</span>
                        </button>
                      </td>
                      <td className="small">{p.tags.join(', ') || '—'}</td>
                      <td className="nowrap small">{p.date}</td>
                      <td>{p.published ? <span className="badge badge-success">Published</span> : <span className="badge">Draft</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
          <div className="row-between">
            <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>← All articles</button>
            <div className="row">
              <button className="btn btn-sm" onClick={() => openPreview(`/blog/${current.slug}`)}><Eye size={15} aria-hidden /> Preview</button>
              <button className={`btn btn-sm ${current.published ? '' : 'btn-primary'}`} onClick={() => set((p) => { p.published = !p.published })}>
                {current.published ? <><EyeOff size={15} aria-hidden /> Unpublish</> : <><Eye size={15} aria-hidden /> Mark as published</>}
              </button>
              <button className="btn btn-sm" style={{ color: 'var(--c-danger)' }} onClick={() => setConfirm(true)}><Trash2 size={15} aria-hidden /> Delete</button>
            </div>
          </div>
          <SlideEditor
            key={current.id}
            value={current}
            onReplace={(next) => set((p) => Object.assign(p, next))}
            cover={{
              title: current.title,
              summary: current.excerpt,
              cover: current.cover,
              autoCover: 'design-process',
              attachments: current.attachments ?? [],
              meta: <p className="subtle">By {current.author} · {current.date} · {current.minutes} min read</p>,
            }}
            onCoverChange={(patch) =>
              set((p) => {
                if ('title' in patch) p.title = patch.title!
                if ('summary' in patch) p.excerpt = patch.summary!
                if ('cover' in patch) p.cover = patch.cover
                if ('attachments' in patch) p.attachments = patch.attachments
              })
            }
            sections={[{ id: 'body', label: 'Article', blocks: current.blocks }]}
            onBlocksChange={(_, blocks) => set((p) => { p.blocks = blocks })}
            extras={[
              {
                id: 'seo',
                label: 'Card & tags',
                icon: Eye,
                thumb: <><h2>{current.title}</h2><p>{current.tags.join(' · ')}</p></>,
                canvas: (
                  <div className="stack">
                    <span className="eyebrow">How the article card looks</span>
                    <h2>{current.title}</h2>
                    <EditableText as="p" multiline label="excerpt" value={current.excerpt} placeholder="One or two sentences that make people want to read" onChange={(v) => set((p) => { p.excerpt = v })} />
                    <p className="subtle">{current.tags.join(' · ') || 'No tags yet'}</p>
                  </div>
                ),
              },
            ]}
            previewPath={`/blog/${current.slug}`}
            pdfPath={`/print/blog/${current.id}`}
            onPreview={openPreview}
            details={
              <div className="stack">
                <ImageField label="Cover photo (optional)" folder="thumbnails" hint="Overrides the illustration on cards and at the top of the article." value={current.coverImage} onChange={(v) => set((p) => { p.coverImage = v })} />
                <TextField
                  label="Web address"
                  value={current.slug}
                  hint={slugTaken(current.slug) ? 'Another article already uses this address.' : `/blog/${current.slug}`}
                  onChange={(v) => {
                    const slug = slugify(v)
                    if (slug && !slugTaken(slug)) set((p) => { p.slug = slug })
                    else toast('That address is empty or already used', 'error')
                  }}
                />
                <div className="grid grid-2">
                  <TextField label="Author" value={current.author} onChange={(v) => set((p) => { p.author = v })} />
                  <TextField label="Date" type="date" value={current.date} onChange={(v) => set((p) => { p.date = v })} />
                </div>
                <NumberField label="Reading time" suffix="minutes" min={1} max={60} value={current.minutes} onChange={(v) => set((p) => { p.minutes = v })} />
                <LinesField label="Tags" hint="One tag per line, e.g. Portfolio" value={current.tags} onChange={(v) => set((p) => { p.tags = v })} />
                <Toggle label="Featured" hint="Shown large at the top of the blog." checked={current.featured} onChange={(v) => set((p) => { p.featured = v })} />
              </div>
            }
          />
        </div>
      )}

      <ConfirmDialog
        open={confirm}
        danger
        title={`Delete “${current?.title}”?`}
        body="The article is removed from the draft. Readers keep seeing it until you publish."
        confirmLabel="Delete article"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          update((d) => { d.blog = d.blog.filter((p) => p.id !== selected) })
          setSelected(null)
          setConfirm(false)
          toast('Article deleted from draft')
        }}
      />
    </>
  )
}
