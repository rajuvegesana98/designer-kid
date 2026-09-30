import { Eye } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { PageHeader, Tabs } from '../../components/ui'
import type { LevelId } from '../../content/types'
import { levelLessons } from '../../lib/content'
import { Icon, ICON_NAMES } from '../../lib/icons'
import { contrastRatio } from '../../lib/theme'
import { ColorField, FormSection, LinesField, SelectField, TextArea, TextField, Toggle } from '../fields'
import { lvl, useAdmin } from '../state'

export function LevelsPage() {
  const { draft, update, openPreview } = useAdmin()
  const [active, setActive] = useState<LevelId>('beginner')
  const level = draft.levels.find((l) => l.id === active)!
  const set = (fn: (l: typeof level) => void) => update((d) => fn(lvl(d, active)))
  const contrast = contrastRatio(level.color, '#FFFFFF')
  const enabledCount = draft.levels.filter((l) => l.enabled).length

  return (
    <>
      <PageHeader title="Levels" eyebrow="Content">Name, describe and colour each learner level, and control its roadmap.</PageHeader>
      <Tabs id="levels" label="Level" value={active} onChange={setActive} tabs={draft.levels.map((l) => ({ value: l.id, label: <><Icon name={l.icon} size={15} /> {l.name}</> }))} />
      <div className="grid admin-split" style={{ marginTop: 'var(--space-5)' }}>
        <aside className="card stack" style={{ alignSelf: 'start', '--c-primary': level.color } as CSSProperties} aria-label="Onboarding card preview">
          <span className="eyebrow">Onboarding card preview</span>
          <span className="icon-tile" style={{ '--tile': level.color } as CSSProperties}><Icon name={level.icon} size={22} /></span>
          <span className="badge badge-level" style={{ '--level-color': level.color, width: 'fit-content' } as CSSProperties}>{level.name}</span>
          <h3>{level.headline}</h3>
          <p className="muted small">{level.description}</p>
          <ol className="small" style={{ paddingLeft: '1.2em', margin: 0 }}>
            {level.recommendedPath.map((p) => <li key={p}>{p}</li>)}
          </ol>
          {!level.enabled && <span className="badge badge-warning">Hidden from students</span>}
          <button className="btn btn-sm" onClick={() => openPreview('/start')}><Eye size={15} aria-hidden /> Preview onboarding</button>
        </aside>
        <div className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
          <FormSection title="Identity">
            <Toggle
              label="Enabled"
              hint={enabledCount === 1 && level.enabled ? 'At least one level must stay enabled.' : 'Disabled levels are hidden from onboarding, search and the level switcher.'}
              checked={level.enabled}
              onChange={(v) => (v || enabledCount > 1) && set((l) => { l.enabled = v })}
            />
            <div className="grid grid-2">
              <TextField label="Name" required value={level.name} onChange={(v) => set((l) => { l.name = v })} />
              <TextField label="Card headline" value={level.headline} onChange={(v) => set((l) => { l.headline = v })} />
            </div>
            <TextArea label="Description" rows={2} value={level.description} onChange={(v) => set((l) => { l.description = v })} />
            <div className="grid grid-2">
              <SelectField label="Icon" value={level.icon} onChange={(v) => set((l) => { l.icon = v })} options={ICON_NAMES.map((n) => ({ value: n, label: n }))} />
              <ColorField label="Colour" value={level.color} onChange={(v) => set((l) => { l.color = v })} hint={`Contrast with white: ${contrast.toFixed(2)}:1${contrast < 4.5 ? ' — below 4.5:1, text on this colour may be hard to read' : ''}`} />
            </div>
          </FormSection>
          <FormSection title="Roadmap & learning path">
            <LinesField label="Recommended learning path" hint="Shown on the onboarding card. One step per line." value={level.recommendedPath} onChange={(v) => set((l) => { l.recommendedPath = v })} />
            <Toggle label="Suggest an order" hint="Content is always open. When on, students see a gentle “suggested after …” hint for modules that build on earlier ones." checked={level.sequential} onChange={(v) => set((l) => { l.sequential = v })} />
            <div>
              <strong className="small">Roadmap order</strong>
              <p className="subtle">
                {level.courses.flatMap((c) => c.modules).map((m) => m.stage).join(' → ') || 'No modules yet'}
              </p>
              <p className="small muted" style={{ marginTop: 6 }}>
                {level.courses.length} courses · {levelLessons(level).length} lessons. <Link to={`/admin/courses?level=${level.id}`}>Add, remove or reorder modules in Courses</Link>.
              </p>
            </div>
          </FormSection>
        </div>
      </div>
    </>
  )
}
