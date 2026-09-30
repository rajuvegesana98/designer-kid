import { Download, Eye, RotateCcw, Upload } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { ConfirmDialog, EmptyState, formatDate, PageHeader, Spinner } from '../../components/ui'
import type { SiteContent } from '../../content/types'
import { store, type ContentVersion } from '../../data'
import { useToast } from '../../state/ui'
import { FormSection } from '../fields'
import { diffSections, useAdmin } from '../state'

export function PublishingPage() {
  const admin = useAdmin()
  const toast = useToast()
  const [versions, setVersions] = useState<ContentVersion[] | null>(null)
  const [restore, setRestore] = useState<ContentVersion | null>(null)

  useEffect(() => {
    admin.listVersions().then(setVersions).catch(() => setVersions([]))
  }, [admin.published]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeader title="Publishing" eyebrow="Site">Every edit is saved as a draft. Preview it, then publish. Each publish is kept as a version you can restore.</PageHeader>
      <div className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
        <FormSection title="Current draft" description="Draft → Preview → Publish.">
          {admin.hasUnpublished ? (
            <>
              <p>Unpublished changes in:</p>
              <div className="chip-group">{admin.changedSections.map((s) => <span key={s} className="badge badge-warning">{s}</span>)}</div>
            </>
          ) : (
            <p className="muted">The draft matches what students see. Nothing to publish.</p>
          )}
          <div className="row">
            <button className="btn" onClick={() => admin.openPreview('/')}><Eye size={16} aria-hidden /> Preview draft</button>
          </div>
        </FormSection>
        <FormSection title="Version history" description="Restoring loads that version into your draft. Review it, then publish to make it live.">
          {!versions ? (
            <Spinner />
          ) : versions.length === 0 ? (
            <EmptyState icon="History" title="No versions yet">Your first publish will appear here.</EmptyState>
          ) : (
            <ul className="list">
              {versions.map((v, i) => (
                <li key={v.id} className="list-item">
                  <span className="grow">
                    <strong style={{ display: 'block' }}>{v.note || 'Published changes'}</strong>
                    <span className="subtle">{formatDate(v.createdAt, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}{v.author ? ` · ${v.author}` : ''}</span>
                  </span>
                  {i === 0 && <span className="badge badge-success">Live</span>}
                  <button className="btn btn-sm" onClick={() => setRestore(v)}><RotateCcw size={15} aria-hidden /> Restore</button>
                </li>
              ))}
            </ul>
          )}
        </FormSection>
        <BackupSection />
      </div>
      <ConfirmDialog
        open={!!restore}
        title="Restore this version into your draft?"
        body="Your current draft will be replaced with this version. Nothing changes for students until you publish."
        confirmLabel="Restore to draft"
        onCancel={() => setRestore(null)}
        onConfirm={async () => {
          const v = restore!
          setRestore(null)
          try {
            const content = await admin.loadVersion(v.id)
            admin.replaceDraft(content)
            toast('Version restored to draft — preview, then publish')
          } catch (e) {
            toast(e instanceof Error ? e.message : 'Could not restore', 'error')
          }
        }}
      />
    </>
  )
}

function BackupSection() {
  const admin = useAdmin()
  const toast = useToast()
  const [pending, setPending] = useState<SiteContent | null>(null)
  const download = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(admin.draft, null, 2)], { type: 'application/json' }))
    a.download = `designer-kid-content-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const load = async (file?: File) => {
    if (!file) return
    try {
      const data = JSON.parse(await file.text()) as SiteContent
      if (data.schemaVersion !== 1 || !Array.isArray(data.levels)) throw new Error('This file isn’t a Designer Kid content export.')
      setPending(data)
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not read file', 'error')
    }
  }
  return (
    <FormSection title="Backup" description="Download all content as JSON, or import a backup into your draft.">
      <div className="row">
        <button className="btn" onClick={download}><Download size={16} aria-hidden /> Download draft as JSON</button>
        <label className="btn">
          <Upload size={16} aria-hidden /> Import JSON
          <input type="file" accept="application/json" className="sr-only" onChange={(e) => { void load(e.target.files?.[0]); e.target.value = '' }} />
        </label>
      </div>
      <ConfirmDialog
        open={!!pending}
        title="Import this backup into your draft?"
        body={pending ? `Changes compared with your draft: ${diffSections(admin.draft, pending).join(', ') || 'none'}. Nothing is published until you publish.` : ''}
        confirmLabel="Import to draft"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          admin.replaceDraft(pending!)
          setPending(null)
          toast('Backup imported into draft')
        }}
      />
    </FormSection>
  )
}

export function SettingsPage() {
  const { draft } = useAdmin()
  return (
    <>
      <PageHeader title="Settings" eyebrow="Site">Connections and where each setting lives.</PageHeader>
      <div className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
        <FormSection title="Data connection">
          {store.mode === 'supabase' ? (
            <p><span className="badge badge-success">Connected</span> Content, learners, submissions and media are stored in Supabase.</p>
          ) : (
            <>
              <p><span className="badge badge-warning">Browser-only mode</span> Everything is saved in this browser. To go live:</p>
              <ol className="small" style={{ paddingLeft: '1.2em' }}>
                <li>Run <code>supabase/schema.sql</code> in the Supabase SQL editor.</li>
                <li>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> (the publishable key) to <code>.env.local</code>, and as GitHub repository variables for deploys.</li>
                <li>Sign up on the site, then make your account an admin (see README).</li>
              </ol>
            </>
          )}
        </FormSection>
        <FormSection title="Where to change things">
          <ul className="list small">
            {[
              ['Brand name, logo, favicon, colours, fonts', 'Theme'],
              ['Homepage, navigation, footer', 'Website'],
              ['Notification types and announcements', 'Content library → Announcements'],
              ['1:1 booking link and mentor profile', '1:1 Connect'],
              ['Levels, roadmap order and sequential unlocking', 'Levels and Courses'],
            ].map(([what, where]) => (
              <li key={what} className="list-item"><span className="grow">{what}</span><strong>{where}</strong></li>
            ))}
          </ul>
        </FormSection>
        <FormSection title="Content summary">
          <p className="small muted">Schema version {draft.schemaVersion} · {draft.levels.length} levels · {draft.challenges.length} challenges · {draft.resources.length} resources · {draft.careerGuides.length} career guides · {draft.achievements.length} achievements</p>
        </FormSection>
      </div>
    </>
  )
}
