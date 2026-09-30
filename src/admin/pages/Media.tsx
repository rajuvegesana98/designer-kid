import { Copy, FileText, RefreshCw, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ConfirmDialog, EmptyState, formatDate, PageHeader, Spinner } from '../../components/ui'
import { store, type MediaItem } from '../../data'
import { useToast } from '../../state/ui'
import { useAdmin } from '../state'
import { DOC_ACCEPT, optimise } from '../uploads'

const FOLDERS = [
  { value: 'documents', label: 'PDFs & slides' },
  { value: 'general', label: 'General' },
  { value: 'thumbnails', label: 'Thumbnails' },
  { value: 'illustrations', label: 'Illustrations' },
  { value: 'profiles', label: 'Profile images' },
  { value: 'courses', label: 'Course media' },
  { value: 'brand', label: 'Brand' },
]

const MAX_BYTES = 5 * 1024 * 1024

function formatBytes(n: number) {
  if (!n) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

function usageOf(url: string, json: string) {
  return json.includes(url.split('?')[0])
}

export function MediaPage() {
  const { draft, published } = useAdmin()
  const toast = useToast()
  const [items, setItems] = useState<MediaItem[] | null>(null)
  const [folder, setFolder] = useState('general')
  const [filter, setFilter] = useState<string>('all')
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState<MediaItem | null>(null)
  const [dims, setDims] = useState<Record<string, string>>({})
  const replaceRef = useRef<HTMLInputElement>(null)
  const replaceTarget = useRef<MediaItem | null>(null)
  const json = JSON.stringify(draft) + JSON.stringify(published)

  const load = () => store.listMedia().then(setItems).catch((e) => { setItems([]); toast(e.message, 'error') })
  useEffect(() => { void load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true)
    try {
      for (const f of Array.from(files)) {
        if (f.size > MAX_BYTES * 10) {
          toast(`${f.name} is too large (max 50 MB).`, 'error')
          continue
        }
        const optimised = await optimise(f)
        await store.uploadMedia(optimised, folder)
      }
      toast('Upload complete')
      await load()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed', 'error')
    } finally {
      setBusy(false)
    }
  }

  const replace = async (file?: File) => {
    const target = replaceTarget.current
    if (!file || !target) return
    setBusy(true)
    try {
      await store.replaceMedia(target, await optimise(file))
      toast('Image replaced everywhere it’s used')
      await load()
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Replace failed', 'error')
    } finally {
      setBusy(false)
    }
  }

  const visible = (items ?? []).filter((i) => filter === 'all' || i.folder === filter)

  return (
    <>
      <PageHeader title="Media" eyebrow="Content">Upload and manage images, PDFs and slide decks. Large images are resized automatically.</PageHeader>
      <div className="card row" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="field" style={{ minWidth: 200 }}>
          <label htmlFor="up-folder">Upload to</label>
          <select id="up-folder" className="select" value={folder} onChange={(e) => setFolder(e.target.value)}>
            {FOLDERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <label className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
          <Upload size={17} aria-hidden /> {busy ? 'Working…' : 'Upload images, PDFs or slides'}
          <input type="file" accept={`image/*,${DOC_ACCEPT}`} multiple className="sr-only" disabled={busy} onChange={(e) => { void upload(e.target.files); e.target.value = '' }} />
        </label>
        <span className="subtle" style={{ alignSelf: 'flex-end' }}>{store.mode === 'local' ? 'Browser-only mode: max 1.5 MB per image after resizing.' : 'Stored in Supabase Storage.'}</span>
      </div>
      <div className="chip-group" role="radiogroup" aria-label="Filter by folder" style={{ marginBottom: 'var(--space-4)' }}>
        <button type="button" role="radio" className="chip" aria-checked={filter === 'all'} onClick={() => setFilter('all')}>All</button>
        {FOLDERS.map((f) => (
          <button key={f.value} type="button" role="radio" className="chip" aria-checked={filter === f.value} onClick={() => setFilter(f.value)}>{f.label}</button>
        ))}
      </div>
      {!items ? (
        <Spinner />
      ) : visible.length === 0 ? (
        <EmptyState icon="Palette" title="No media yet">Upload images to use them in lessons, the homepage and your brand.</EmptyState>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {visible.map((m) => {
            const used = usageOf(m.url, json)
            return (
              <article key={m.id} className="card card-tight stack" style={{ '--gap': '8px' } as CSSProperties}>
                <div style={{ aspectRatio: '4 / 3', borderRadius: 12, overflow: 'hidden', background: 'var(--c-surface-3)', display: 'grid', placeItems: 'center' }}>
                  {m.mimeType.startsWith('image/') ? (
                    <img
                      src={m.url}
                      alt={m.name}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onLoad={(e) => {
                        const img = e.currentTarget
                        setDims((d) => (d[m.id] ? d : { ...d, [m.id]: `${img.naturalWidth}×${img.naturalHeight}` }))
                      }}
                    />
                  ) : (
                    <span className="stack" style={{ alignItems: 'center', '--gap': '6px' } as CSSProperties}>
                      <FileText size={34} aria-hidden />
                      <span className="badge">{/pdf/i.test(m.mimeType + m.name) ? 'PDF' : /ppt|presentation|key/i.test(m.mimeType + m.name) ? 'Slides' : 'File'}</span>
                    </span>
                  )}
                </div>
                <strong className="small" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={m.name}>{m.name}</strong>
                <span className="subtle" style={{ fontSize: '0.78rem' }}>
                  {FOLDERS.find((f) => f.value === m.folder)?.label ?? m.folder} · {formatBytes(m.size)}{dims[m.id] ? ` · ${dims[m.id]}` : ''} · {formatDate(m.createdAt)}
                </span>
                {used ? <span className="badge badge-primary" style={{ width: 'fit-content' }}>In use</span> : <span className="badge" style={{ width: 'fit-content' }}>Not used</span>}
                <div className="row" style={{ '--gap': '4px' } as CSSProperties}>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(m.url).then(() => toast('Image URL copied'))}><Copy size={14} aria-hidden /> URL</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { replaceTarget.current = m; replaceRef.current?.click() }}><RefreshCw size={14} aria-hidden /> Replace</button>
                  <button className="btn btn-ghost btn-icon btn-sm" aria-label={`Delete ${m.name}`} style={{ color: 'var(--c-danger)' }} onClick={() => setConfirm(m)}><Trash2 size={15} /></button>
                </div>
              </article>
            )
          })}
        </div>
      )}
      <input ref={replaceRef} type="file" accept={`image/*,${DOC_ACCEPT}`} className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { void replace(e.target.files?.[0]); e.target.value = '' }} />
      <ConfirmDialog
        open={!!confirm}
        danger
        title={`Delete ${confirm?.name}?`}
        body={confirm && usageOf(confirm.url, json) ? 'This image is used in your content. Deleting it will leave a broken image until you replace it. This can’t be undone.' : 'This permanently deletes the file. This can’t be undone.'}
        confirmLabel="Delete image"
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          const m = confirm!
          setConfirm(null)
          try {
            await store.deleteMedia(m)
            toast('Image deleted')
            await load()
          } catch (e) {
            toast(e instanceof Error ? e.message : 'Delete failed', 'error')
          }
        }}
      />
    </>
  )
}
