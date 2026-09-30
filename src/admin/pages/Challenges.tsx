import { Eye, Plus, Search, Trash2 } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { ConfirmDialog, EmptyState, PageHeader } from '../../components/ui'
import type { Challenge, ChallengeCategory, Difficulty, LevelId } from '../../content/types'
import { CATEGORIES } from '../../pages/Challenges'
import { useToast } from '../../state/ui'
import { FormSection, LinesField, NumberField, SelectField, TextArea, TextField, Toggle } from '../fields'
import { newId, useAdmin } from '../state'

export function ChallengesAdmin() {
  const { draft, update, openPreview } = useAdmin()
  const toast = useToast()
  const [selected, setSelected] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [level, setLevel] = useState<LevelId | 'any'>('any')
  const [confirm, setConfirm] = useState(false)
  const list = draft.challenges.filter((c) => (level === 'any' || c.level === level) && c.title.toLowerCase().includes(q.toLowerCase()))
  const current = draft.challenges.find((c) => c.id === selected)
  const set = (fn: (c: Challenge) => void) => update((d) => fn(d.challenges.find((c) => c.id === selected)!))

  const create = () => {
    const c: Challenge = {
      id: newId('ch', 'new'),
      level: level === 'any' ? 'beginner' : level,
      category: 'UI',
      title: 'New challenge',
      brief: '',
      context: '',
      requirements: [],
      constraints: [],
      expectedOutcome: '',
      difficulty: 'Medium',
      minutes: 60,
      checklist: [],
      published: false,
      addedAt: new Date().toISOString().slice(0, 10),
    }
    update((d) => { d.challenges.unshift(c) })
    setSelected(c.id)
  }

  return (
    <>
      <PageHeader title="Challenges" eyebrow="Content" actions={<button className="btn btn-primary" onClick={create}><Plus size={16} aria-hidden /> New challenge</button>}>
        Briefs, constraints and self-review checklists for each level.
      </PageHeader>
      <div className="grid admin-split">
        <aside className="card card-tight stack" style={{ alignSelf: 'start', '--gap': '10px' } as CSSProperties} aria-label="Challenge list">
          <div className="row" style={{ flexWrap: 'nowrap', '--gap': '6px' } as CSSProperties}>
            <Search size={16} aria-hidden className="subtle" />
            <input className="input" aria-label="Search challenges" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="select" aria-label="Filter by level" value={level} onChange={(e) => setLevel(e.target.value as LevelId | 'any')}>
            <option value="any">All levels</option>
            {draft.levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <ul className="list" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {list.map((c) => (
              <li key={c.id}>
                <button className={`tree-item ${selected === c.id ? 'active' : ''}`} onClick={() => setSelected(c.id)}>
                  <span className="grow" style={{ textAlign: 'left' }}>
                    {c.title}
                    <span className="subtle" style={{ display: 'block', fontSize: '0.78rem' }}>{draft.levels.find((l) => l.id === c.level)?.name} · {c.category}{c.published ? '' : ' · Draft'}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        {!current ? (
          <EmptyState icon="Target" title="Select a challenge">Or create a new one.</EmptyState>
        ) : (
          <div key={current.id} className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
            <div className="row-between">
              <Toggle label="Published" checked={current.published} onChange={(v) => set((c) => { c.published = v })} />
              <div className="row">
                <button className="btn btn-sm" onClick={() => openPreview(`/challenges/${current.id}`)}><Eye size={15} aria-hidden /> Preview</button>
                <button className="btn btn-sm" style={{ color: 'var(--c-danger)' }} onClick={() => setConfirm(true)}><Trash2 size={15} aria-hidden /> Delete</button>
              </div>
            </div>
            <FormSection title="Brief">
              <TextField label="Title" required value={current.title} onChange={(v) => set((c) => { c.title = v })} />
              <div className="grid grid-2">
                <SelectField<LevelId> label="Level" value={current.level} onChange={(v) => set((c) => { c.level = v })} options={draft.levels.map((l) => ({ value: l.id, label: l.name }))} />
                <SelectField<ChallengeCategory> label="Category" value={current.category} onChange={(v) => set((c) => { c.category = v })} options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
                <SelectField<Difficulty> label="Difficulty" value={current.difficulty} onChange={(v) => set((c) => { c.difficulty = v })} options={(['Easy', 'Medium', 'Hard', 'Advanced'] as Difficulty[]).map((d) => ({ value: d, label: d }))} />
                <NumberField label="Estimated time" suffix="minutes" min={5} max={2000} value={current.minutes} onChange={(v) => set((c) => { c.minutes = v })} />
              </div>
              <TextArea label="Brief" rows={2} value={current.brief} onChange={(v) => set((c) => { c.brief = v })} />
              <TextArea label="User & problem context" rows={3} value={current.context} onChange={(v) => set((c) => { c.context = v })} />
            </FormSection>
            <FormSection title="Scope">
              <LinesField label="Requirements" value={current.requirements} onChange={(v) => set((c) => { c.requirements = v })} />
              <LinesField label="Constraints" value={current.constraints} onChange={(v) => set((c) => { c.constraints = v })} />
              <TextArea label="Expected outcome" rows={2} value={current.expectedOutcome} onChange={(v) => set((c) => { c.expectedOutcome = v })} />
              <LinesField label="Self-review checklist" value={current.checklist} onChange={(v) => set((c) => { c.checklist = v })} />
            </FormSection>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={confirm}
        danger
        title={`Delete “${current?.title}”?`}
        body="The challenge is removed from the draft. Students keep seeing it until you publish."
        confirmLabel="Delete challenge"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          update((d) => { d.challenges = d.challenges.filter((c) => c.id !== selected) })
          setSelected(null)
          setConfirm(false)
          toast('Challenge deleted from draft')
        }}
      />
    </>
  )
}
