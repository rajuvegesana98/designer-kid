import { Eye, Plus, Trash2 } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router'
import { ConfirmDialog, EmptyState, PageHeader, Tabs } from '../../components/ui'
import type { Announcement, CareerGuide, CareerSection, LevelScope, Resource, ResourceType } from '../../content/types'
import { CAREER_SECTIONS } from '../../lib/content'
import { useToast } from '../../state/ui'
import { EditableSteps, SlideEditor } from '../SlideEditor'
import { coverFor } from '../../lib/covers'
import { AddButton, FormSection, NumberField, SelectField, SortableList, TextArea, TextField, Toggle } from '../fields'
import { newId, useAdmin } from '../state'

type Tab = 'resources' | 'career' | 'announcements'
const TYPES: ResourceType[] = ['Article', 'Tool', 'Template', 'Video', 'Book', 'Community', 'Course']

function useScopeOptions() {
  const { draft } = useAdmin()
  return [{ value: 'all' as LevelScope, label: 'All levels' }, ...draft.levels.map((l) => ({ value: l.id as LevelScope, label: l.name }))]
}

export function LibraryPage() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'resources'
  return (
    <>
      <PageHeader title="Content library" eyebrow="Content">Resources, career guides, announcements and notifications.</PageHeader>
      <Tabs<Tab>
        id="lib"
        label="Content type"
        value={tab}
        onChange={(v) => setParams({ tab: v }, { replace: true })}
        tabs={[
          { value: 'resources', label: 'Resources' },
          { value: 'career', label: 'Career guides' },
          { value: 'announcements', label: 'Announcements & notifications' },
        ]}
      />
      <div id="lib-panel" role="tabpanel" style={{ marginTop: 'var(--space-5)' }}>
        {tab === 'resources' && <ResourcesAdmin />}
        {tab === 'career' && <CareerAdmin />}
        {tab === 'announcements' && <AnnouncementsAdmin />}
      </div>
    </>
  )
}

function ResourcesAdmin() {
  const { draft, update } = useAdmin()
  const toast = useToast()
  const scopes = useScopeOptions()
  const [open, setOpen] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<Resource | null>(null)
  const set = (id: string, fn: (r: Resource) => void) => update((d) => fn(d.resources.find((r) => r.id === id)!))
  return (
    <FormSection
      title={`Resources (${draft.resources.length})`}
      description="Drag to set the order students see."
      actions={
        <AddButton
          onClick={() => {
            const r: Resource = { id: newId('res', 'new'), level: 'all', type: 'Article', title: 'New resource', description: '', url: 'https://', published: false }
            update((d) => { d.resources.unshift(r) })
            setOpen(r.id)
          }}
        >
          Add resource
        </AddButton>
      }
    >
      <SortableList
        label="Resources"
        items={draft.resources}
        keys={draft.resources.map((r) => r.id)}
        onReorder={(next) => update((d) => { d.resources = next })}
        onRemove={(i) => setConfirm(draft.resources[i])}
        removeLabel="Delete resource"
        render={(r) => (
          <div className="stack" style={{ '--gap': '10px' } as CSSProperties}>
            <button type="button" className="tree-item" aria-expanded={open === r.id} onClick={() => setOpen(open === r.id ? null : r.id)}>
              <span className="grow" style={{ textAlign: 'left' }}>
                {r.title}
                <span className="subtle" style={{ display: 'block', fontSize: '0.78rem' }}>{r.type} · {scopes.find((s) => s.value === r.level)?.label}{r.published ? '' : ' · Draft'}</span>
              </span>
            </button>
            {open === r.id && (
              <div className="stack" style={{ padding: '0 8px 8px' }}>
                <TextField label="Title" required value={r.title} onChange={(v) => set(r.id, (x) => { x.title = v })} />
                <TextField label="URL" type="url" value={r.url} onChange={(v) => set(r.id, (x) => { x.url = v })} />
                <TextArea label="Description" rows={2} value={r.description} onChange={(v) => set(r.id, (x) => { x.description = v })} />
                <div className="grid grid-2">
                  <SelectField<ResourceType> label="Type" value={r.type} onChange={(v) => set(r.id, (x) => { x.type = v })} options={TYPES.map((t) => ({ value: t, label: t }))} />
                  <SelectField<LevelScope> label="Level" value={r.level} onChange={(v) => set(r.id, (x) => { x.level = v })} options={scopes} />
                </div>
                <Toggle label="Published" checked={r.published} onChange={(v) => set(r.id, (x) => { x.published = v })} />
              </div>
            )}
          </div>
        )}
      />
      <ConfirmDialog
        open={!!confirm}
        danger
        title={`Delete “${confirm?.title}”?`}
        body="The resource is removed from the draft."
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          update((d) => { d.resources = d.resources.filter((r) => r.id !== confirm?.id) })
          setConfirm(null)
          toast('Resource deleted from draft')
        }}
      />
    </FormSection>
  )
}

function CareerAdmin() {
  const { draft, update, openPreview } = useAdmin()
  const toast = useToast()
  const scopes = useScopeOptions()
  const [section, setSection] = useState<CareerSection>('resume')
  const [selected, setSelected] = useState<string | null>(null)
  const [confirm, setConfirm] = useState(false)
  const guides = draft.careerGuides.filter((g) => g.section === section)
  const current = draft.careerGuides.find((g) => g.id === selected)
  const set = (fn: (g: CareerGuide) => void) => update((d) => fn(d.careerGuides.find((g) => g.id === selected)!))
  return (
    <div className="stack">
      <aside className="card card-tight stack" style={{ '--gap': '10px' } as CSSProperties}>
        <SelectField<CareerSection> label="Section" value={section} onChange={(v) => { setSection(v); setSelected(null) }} options={CAREER_SECTIONS.map((s) => ({ value: s.id, label: s.title }))} />
        <ul className="list guide-picker">
          {guides.map((g) => (
            <li key={g.id}>
              <button className={`tree-item ${selected === g.id ? 'active' : ''}`} onClick={() => setSelected(g.id)}>
                <span className="grow" style={{ textAlign: 'left' }}>
                  {g.title}
                  <span className="subtle" style={{ display: 'block', fontSize: '0.78rem' }}>{scopes.find((s) => s.value === g.level)?.label}{g.published ? '' : ' · Draft'}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button
          className="btn btn-soft btn-sm"
          onClick={() => {
            const g: CareerGuide = { id: newId('cg', section), section, level: 'all', title: 'New guide', summary: '', minutes: 10, blocks: [], checklist: [], published: false }
            update((d) => { d.careerGuides.push(g) })
            setSelected(g.id)
          }}
        >
          <Plus size={15} aria-hidden /> Add guide
        </button>
      </aside>
      {!current ? (
        <EmptyState icon="Briefcase" title="Select a guide">Guides appear in the Career Centre for the level you choose.</EmptyState>
      ) : (
        <div key={current.id} className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
          <div className="row-between">
            <Toggle label="Published" checked={current.published} onChange={(v) => set((g) => { g.published = v })} />
            <div className="row">
              <button className="btn btn-sm" onClick={() => openPreview(`/career/${current.section}#${current.id}`)}><Eye size={15} aria-hidden /> Preview</button>
              <button className="btn btn-sm" style={{ color: 'var(--c-danger)' }} onClick={() => setConfirm(true)}><Trash2 size={15} aria-hidden /> Delete</button>
            </div>
          </div>
          <SlideEditor
            key={current.id}
            value={current}
            onReplace={(next) => set((g) => Object.assign(g, next))}
            cover={{ title: current.title, summary: current.summary, cover: current.cover, autoCover: coverFor(current.title, current.section), attachments: current.attachments ?? [] }}
            onCoverChange={(patch) =>
              set((g) => {
                if ('title' in patch) g.title = patch.title!
                if ('summary' in patch) g.summary = patch.summary!
                if ('cover' in patch) g.cover = patch.cover
                if ('attachments' in patch) g.attachments = patch.attachments
              })
            }
            sections={[{ id: 'blocks', label: 'Guide', blocks: current.blocks }]}
            onBlocksChange={(_, blocks) => set((g) => { g.blocks = blocks })}
            extras={[
              {
                id: 'checklist',
                label: 'Checklist',
                icon: Eye,
                thumb: <><h2>Checklist</h2>{current.checklist.map((c) => <p key={c}>☐ {c}</p>)}</>,
                canvas: (
                  <div className="stack">
                    <h2>Checklist</h2>
                    <p className="muted small">These items drive the student’s Career Centre progress.</p>
                    <EditableSteps label="checklist item" items={current.checklist} onChange={(v) => set((g) => { g.checklist = v })} />
                  </div>
                ),
              },
            ]}
            previewPath={`/career/${current.section}#${current.id}`}
            pdfPath={`/print/guide/${current.id}`}
            onPreview={openPreview}
            details={
              <div className="grid grid-2">
                <SelectField<LevelScope> label="Level" value={current.level} onChange={(v) => set((g) => { g.level = v })} options={scopes} />
                <NumberField label="Reading time" suffix="minutes" min={1} max={240} value={current.minutes} onChange={(v) => set((g) => { g.minutes = v })} />
              </div>
            }
          />
        </div>
      )}
      <ConfirmDialog
        open={confirm}
        danger
        title={`Delete “${current?.title}”?`}
        body="The guide is removed from the draft."
        confirmLabel="Delete guide"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          update((d) => { d.careerGuides = d.careerGuides.filter((g) => g.id !== selected) })
          setSelected(null)
          setConfirm(false)
          toast('Guide deleted from draft')
        }}
      />
    </div>
  )
}

function AnnouncementsAdmin() {
  const { draft, update } = useAdmin()
  const toast = useToast()
  const [open, setOpen] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<Announcement | null>(null)
  const set = (id: string, fn: (a: Announcement) => void) => update((d) => fn(d.announcements.find((a) => a.id === id)!))
  const n = draft.notifications
  const setN = (k: keyof typeof n, v: boolean) => update((d) => { d.notifications[k] = v })
  return (
    <div className="stack" style={{ '--gap': 'var(--space-5)' } as CSSProperties}>
      <FormSection title="Notification settings" description="Choose which in-app notifications students receive in the bell menu.">
        <div className="grid grid-2">
          <Toggle label="New lessons" hint="Lessons added in the last 30 days in the student’s level." checked={n.newLesson} onChange={(v) => setN('newLesson', v)} />
          <Toggle label="New challenges" checked={n.newChallenge} onChange={(v) => setN('newChallenge', v)} />
          <Toggle label="Course completion" hint="Congratulate students when they finish a course." checked={n.courseCompletion} onChange={(v) => setN('courseCompletion', v)} />
          <Toggle label="Announcements" checked={n.announcements} onChange={(v) => setN('announcements', v)} />
          <Toggle label="Career updates" hint="Announcements marked as career updates." checked={n.careerUpdates} onChange={(v) => setN('careerUpdates', v)} />
        </div>
        <p className="subtle">New 1:1 bookings are handled by your booking tool, which can email you directly.</p>
      </FormSection>
      <FormSection
        title="Announcements"
        description="Important announcements are also pinned to the top of the student dashboard."
        actions={
          <AddButton
            onClick={() => {
              const a: Announcement = { id: newId('ann', 'new'), title: 'New announcement', body: '', date: new Date().toISOString().slice(0, 10), levels: ['all'], kind: 'announcement', important: false, published: false }
              update((d) => { d.announcements.unshift(a) })
              setOpen(a.id)
            }}
          >
            New announcement
          </AddButton>
        }
      >
        {draft.announcements.length === 0 && <p className="muted small">No announcements yet.</p>}
        <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0, '--gap': '8px' } as CSSProperties}>
          {draft.announcements.map((a) => (
            <li key={a.id} className="sortable-row" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 8 }}>
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                <button className="tree-item grow" aria-expanded={open === a.id} onClick={() => setOpen(open === a.id ? null : a.id)}>
                  <span className="grow" style={{ textAlign: 'left' }}>
                    {a.title}
                    <span className="subtle" style={{ display: 'block', fontSize: '0.78rem' }}>{a.date}{a.important ? ' · Important' : ''}{a.published ? '' : ' · Draft'}</span>
                  </span>
                </button>
                <button className="btn btn-ghost btn-icon btn-sm" aria-label={`Delete ${a.title}`} style={{ color: 'var(--c-danger)' }} onClick={() => setConfirm(a)}><Trash2 size={16} /></button>
              </div>
              {open === a.id && (
                <div className="stack" style={{ padding: 8 }}>
                  <TextField label="Title" required value={a.title} onChange={(v) => set(a.id, (x) => { x.title = v })} />
                  <TextArea label="Message" rows={3} value={a.body} onChange={(v) => set(a.id, (x) => { x.body = v })} />
                  <div className="grid grid-2">
                    <TextField label="Date" type="date" value={a.date} onChange={(v) => set(a.id, (x) => { x.date = v })} />
                    <SelectField label="Type" value={a.kind} onChange={(v) => set(a.id, (x) => { x.kind = v })} options={[{ value: 'announcement', label: 'Announcement' }, { value: 'career', label: 'Career update' }, { value: 'new-content', label: 'New content' }]} />
                  </div>
                  <fieldset className="stack" style={{ border: 0, padding: 0, margin: 0, '--gap': '8px' } as CSSProperties}>
                    <legend className="label" style={{ marginBottom: 6 }}>Audience</legend>
                    <div className="chip-group">
                      {(['all', ...draft.levels.map((l) => l.id)] as LevelScope[]).map((s) => {
                        const on = a.levels.includes(s)
                        return (
                          <button
                            key={s}
                            type="button"
                            className="chip"
                            aria-pressed={on}
                            onClick={() =>
                              set(a.id, (x) => {
                                x.levels = s === 'all' ? ['all'] : on ? x.levels.filter((y) => y !== s) : [...x.levels.filter((y) => y !== 'all'), s]
                                if (!x.levels.length) x.levels = ['all']
                              })
                            }
                          >
                            {s === 'all' ? 'Everyone' : draft.levels.find((l) => l.id === s)?.name}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                  <div className="row">
                    <Toggle label="Important (pin to dashboard)" checked={a.important} onChange={(v) => set(a.id, (x) => { x.important = v })} />
                    <Toggle label="Published" checked={a.published} onChange={(v) => set(a.id, (x) => { x.published = v })} />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </FormSection>
      <ConfirmDialog
        open={!!confirm}
        danger
        title={`Delete “${confirm?.title}”?`}
        body="The announcement is removed from the draft."
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          update((d) => { d.announcements = d.announcements.filter((a) => a.id !== confirm?.id) })
          setConfirm(null)
          toast('Announcement deleted from draft')
        }}
      />
    </div>
  )
}
