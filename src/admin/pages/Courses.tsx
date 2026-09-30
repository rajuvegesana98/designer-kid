import { ArrowDown, ArrowUp, ChevronRight, Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useRef, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router'
import { ConfirmDialog, EmptyState, PageHeader, Tabs } from '../../components/ui'
import type { Course, Difficulty, Lesson, LevelId, Module } from '../../content/types'
import { useToast } from '../../state/ui'
import { EditableSteps, EditableText, SlideEditor } from '../SlideEditor'
import { coverFor } from '../../lib/covers'
import { AddButton, FormSection, NumberField, SelectField, SortableList, TextArea, TextField, Toggle } from '../fields'
import { course as findCourse, lesson as findLesson, lvl, mod as findModule, moveItem, newId, useAdmin } from '../state'

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Advanced']

export function newLesson(title = 'Untitled lesson'): Lesson {
  return {
    id: newId('lesson', title),
    title,
    summary: '',
    minutes: 10,
    difficulty: 'Easy',
    published: false,
    addedAt: new Date().toISOString().slice(0, 10),
    learn: [{ type: 'text', body: '' }],
    example: [],
    practice: { task: '', steps: [], deliverable: '' },
    challenge: { task: '', successCriteria: [] },
  }
}

function newModule(title = 'New module'): Module {
  return { id: newId('module', title), title, stage: 'New', summary: '', outcome: '', kind: 'lessons', published: false, lessons: [] }
}

function newCourse(title = 'New course'): Course {
  return { id: newId('course', title), title, description: '', published: false, modules: [] }
}

function Status({ published }: { published: boolean }) {
  return published ? <span className="badge badge-success">Published</span> : <span className="badge">Draft</span>
}

type Sel = { course?: string; module?: string; lesson?: string }

export function CoursesPage() {
  const { draft, update } = useAdmin()
  const [params, setParams] = useSearchParams()
  const levelId = (params.get('level') as LevelId) || 'beginner'
  const sel: Sel = { course: params.get('course') ?? undefined, module: params.get('module') ?? undefined, lesson: params.get('lesson') ?? undefined }
  const level = draft.levels.find((l) => l.id === levelId) ?? draft.levels[0]
  const editorRef = useRef<HTMLDivElement>(null)
  const [showTree, setShowTree] = useState(false)

  const select = (s: Sel & { level?: LevelId }) => {
    const p = new URLSearchParams()
    p.set('level', s.level ?? level.id)
    if (s.course) p.set('course', s.course)
    if (s.module) p.set('module', s.module)
    if (s.lesson) p.set('lesson', s.lesson)
    setParams(p)
    if (window.innerWidth < 1000) window.setTimeout(() => editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const course = level.courses.find((c) => c.id === sel.course)
  const module = course?.modules.find((m) => m.id === sel.module)
  const lesson = module?.lessons.find((l) => l.id === sel.lesson)

  return (
    <>
      <PageHeader title="Courses" eyebrow="Content">Level → Course → Module → Lesson. Drag to reorder, and use Preview to see exactly what students will see.</PageHeader>
      <Tabs id="lvl" label="Level" value={level.id} onChange={(v) => select({ level: v })} tabs={draft.levels.map((l) => ({ value: l.id, label: l.name }))} />
      {lesson && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <button className="btn btn-ghost btn-sm" aria-expanded={showTree} onClick={() => setShowTree((v) => !v)}>
            {showTree ? 'Hide course tree — more room for slides' : 'Show course tree'}
          </button>
        </div>
      )}
      <div className={`grid admin-split ${lesson && !showTree ? 'focus' : ''}`} style={{ marginTop: 'var(--space-4)' }}>
        <aside className="card card-tight stack" style={{ '--gap': '12px', alignSelf: 'start' } as CSSProperties} aria-label={`${level.name} course tree`}>
          <div className="row-between">
            <strong>{level.name} courses</strong>
            <button
              className="btn btn-soft btn-sm"
              onClick={() => {
                const c = newCourse()
                update((d) => lvl(d, level.id).courses.push(c))
                select({ course: c.id })
              }}
            >
              <Plus size={15} aria-hidden /> Course
            </button>
          </div>
          {level.courses.length === 0 && <p className="muted small">No courses yet.</p>}
          {level.courses.map((c, ci) => (
            <section key={c.id} className="stack" style={{ '--gap': '6px' } as CSSProperties} aria-label={c.title}>
              <div className="row" style={{ flexWrap: 'nowrap', '--gap': '2px' } as CSSProperties}>
                <button type="button" className={`tree-item ${sel.course === c.id && !sel.module ? 'active' : ''}`} onClick={() => select({ course: c.id })}>
                  <strong className="grow" style={{ textAlign: 'left' }}>{c.title}</strong>
                  {!c.published && <EyeOff size={14} aria-label="Draft" />}
                </button>
                <button type="button" className="btn btn-ghost btn-icon btn-sm" aria-label={`Move ${c.title} up`} disabled={ci === 0} onClick={() => update((d) => moveItem(lvl(d, level.id).courses, ci, ci - 1))}>
                  <ArrowUp size={15} />
                </button>
                <button type="button" className="btn btn-ghost btn-icon btn-sm" aria-label={`Move ${c.title} down`} disabled={ci === level.courses.length - 1} onClick={() => update((d) => moveItem(lvl(d, level.id).courses, ci, ci + 1))}>
                  <ArrowDown size={15} />
                </button>
              </div>
              {c.modules.length === 0 ? (
                <p className="subtle" style={{ paddingLeft: 10 }}>No modules yet.</p>
              ) : (
                <SortableList
                  label={`Modules in ${c.title}`}
                  items={c.modules}
                  keys={c.modules.map((m) => m.id)}
                  onReorder={(next) => update((d) => { findCourse(d, level.id, c.id).modules = next })}
                  render={(m) => (
                    <button type="button" className={`tree-item ${sel.module === m.id ? 'active' : ''}`} onClick={() => select({ course: c.id, module: m.id })}>
                      <span className="grow" style={{ textAlign: 'left' }}>
                        {m.title}
                        <span className="subtle" style={{ display: 'block', fontSize: '0.78rem' }}>{m.lessons.length} lessons{m.kind === 'project' ? ' · projects' : ''}{m.published ? '' : ' · draft'}</span>
                      </span>
                    </button>
                  )}
                />
              )}
            </section>
          ))}
        </aside>

        <div ref={editorRef} style={{ scrollMarginTop: 80, minWidth: 0 }}>
          {lesson && course && module ? (
            <LessonEditor key={lesson.id} levelId={level.id} course={course} module={module} lesson={lesson} onSelect={select} />
          ) : module && course ? (
            <ModuleEditor key={module.id} levelId={level.id} course={course} module={module} onSelect={select} />
          ) : course ? (
            <CourseEditor key={course.id} levelId={level.id} course={course} onSelect={select} />
          ) : (
            <EmptyState icon="BookOpen" title="Select a course or module">Choose something from the tree to edit it, or add a new course.</EmptyState>
          )}
        </div>
      </div>
    </>
  )
}

function Crumbs({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="row small muted" style={{ '--gap': '6px', marginBottom: 12 } as CSSProperties}>
      {items.map((it, i) => (
        <span key={i} className="row" style={{ '--gap': '6px' } as CSSProperties}>
          {i > 0 && <ChevronRight size={14} aria-hidden />}
          {it.onClick ? <button className="btn btn-ghost btn-sm" style={{ padding: '0 6px', minHeight: 28 }} onClick={it.onClick}>{it.label}</button> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}

function CourseEditor({ levelId, course, onSelect }: { levelId: LevelId; course: Course; onSelect: (s: Sel) => void }) {
  const { update } = useAdmin()
  const toast = useToast()
  const [confirm, setConfirm] = useState(false)
  const set = (fn: (c: Course) => void) => update((d) => fn(findCourse(d, levelId, course.id)))
  return (
    <div className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
      <Crumbs items={[{ label: 'Course' }]} />
      <FormSection title="Course details" actions={<Status published={course.published} />}>
        <TextField label="Title" required value={course.title} onChange={(v) => set((c) => { c.title = v })} />
        <TextArea label="Description" rows={2} value={course.description} onChange={(v) => set((c) => { c.description = v })} />
        <Toggle label="Published" hint="Unpublished courses are hidden from students." checked={course.published} onChange={(v) => set((c) => { c.published = v })} />
      </FormSection>
      <FormSection
        title="Modules"
        description="Drag to reorder. The order here is the order on the student roadmap."
        actions={
          <AddButton
            onClick={() => {
              const m = newModule()
              set((c) => { c.modules.push(m) })
              onSelect({ course: course.id, module: m.id })
            }}
          >
            Add module
          </AddButton>
        }
      >
        {course.modules.length === 0 ? (
          <p className="muted small">No modules yet.</p>
        ) : (
          <ul className="list">
            {course.modules.map((m) => (
              <li key={m.id} className="list-item">
                <button className="tree-item grow" onClick={() => onSelect({ course: course.id, module: m.id })}>
                  <span className="grow" style={{ textAlign: 'left' }}>{m.title}</span>
                  <Status published={m.published} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </FormSection>
      <div className="row">
        <button className="btn" style={{ color: 'var(--c-danger)' }} onClick={() => setConfirm(true)}><Trash2 size={16} aria-hidden /> Delete course</button>
      </div>
      <ConfirmDialog
        open={confirm}
        danger
        title={`Delete “${course.title}”?`}
        body={`This removes the course and its ${course.modules.length} modules and ${course.modules.reduce((s, m) => s + m.lessons.length, 0)} lessons from the draft. Nothing changes for students until you publish, and you can restore older versions from Publishing.`}
        confirmLabel="Delete course"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          update((d) => { const l = lvl(d, levelId); l.courses = l.courses.filter((c) => c.id !== course.id) })
          setConfirm(false)
          onSelect({})
          toast('Course deleted from draft')
        }}
      />
    </div>
  )
}

function ModuleEditor({ levelId, course, module, onSelect }: { levelId: LevelId; course: Course; module: Module; onSelect: (s: Sel) => void }) {
  const { update, openPreview } = useAdmin()
  const toast = useToast()
  const [confirm, setConfirm] = useState<null | { type: 'module' } | { type: 'lesson'; lesson: Lesson }>(null)
  const set = (fn: (m: Module) => void) => update((d) => fn(findModule(d, levelId, course.id, module.id)))
  return (
    <div className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
      <Crumbs items={[{ label: course.title, onClick: () => onSelect({ course: course.id }) }, { label: module.title }]} />
      <FormSection
        title="Module details"
        actions={
          <div className="row">
            <Status published={module.published} />
            <button className="btn btn-sm" onClick={() => openPreview(`/learn/${levelId}/${module.id}`)}><Eye size={15} aria-hidden /> Preview</button>
          </div>
        }
      >
        <div className="grid grid-2">
          <TextField label="Title" required value={module.title} onChange={(v) => set((m) => { m.title = v })} />
          <TextField label="Roadmap label" hint="Short label on the roadmap, e.g. “Figma”." value={module.stage} maxLength={18} onChange={(v) => set((m) => { m.stage = v })} />
        </div>
        <TextArea label="Summary" rows={2} value={module.summary} onChange={(v) => set((m) => { m.summary = v })} />
        <TextArea label="Outcome — what students will be able to do" rows={2} value={module.outcome} onChange={(v) => set((m) => { m.outcome = v })} />
        <SelectField label="Type" value={module.kind} onChange={(v) => set((m) => { m.kind = v })} options={[{ value: 'lessons', label: 'Lessons' }, { value: 'project', label: 'Projects (counts towards projects completed)' }]} />
        <Toggle label="Published" hint="Unpublished modules and their lessons are hidden from students." checked={module.published} onChange={(v) => set((m) => { m.published = v })} />
      </FormSection>
      <FormSection
        title="Lessons"
        description="Drag or use the arrows to reorder."
        actions={
          <AddButton
            onClick={() => {
              const l = newLesson()
              set((m) => { m.lessons.push(l) })
              onSelect({ course: course.id, module: module.id, lesson: l.id })
            }}
          >
            Add lesson
          </AddButton>
        }
      >
        {module.lessons.length === 0 ? (
          <p className="muted small">No lessons yet. Modules without published lessons are hidden from students.</p>
        ) : (
          <SortableList
            label="Lessons"
            items={module.lessons}
            keys={module.lessons.map((l) => l.id)}
            onReorder={(next) => set((m) => { m.lessons = next })}
            onRemove={(i) => setConfirm({ type: 'lesson', lesson: module.lessons[i] })}
            removeLabel="Delete lesson"
            render={(l, i) => (
              <button type="button" className="tree-item" onClick={() => onSelect({ course: course.id, module: module.id, lesson: l.id })}>
                <span className="subtle" style={{ width: 22 }}>{i + 1}</span>
                <span className="grow" style={{ textAlign: 'left' }}>{l.title}</span>
                <Status published={l.published} />
              </button>
            )}
          />
        )}
      </FormSection>
      <div className="row">
        <button className="btn" style={{ color: 'var(--c-danger)' }} onClick={() => setConfirm({ type: 'module' })}><Trash2 size={16} aria-hidden /> Delete module</button>
      </div>
      <ConfirmDialog
        open={!!confirm}
        danger
        title={confirm?.type === 'lesson' ? `Delete “${confirm.lesson.title}”?` : `Delete “${module.title}”?`}
        body={confirm?.type === 'lesson' ? 'The lesson is removed from the draft. Students keep seeing it until you publish.' : `This removes the module and its ${module.lessons.length} lessons from the draft.`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.type === 'lesson') {
            const id = confirm.lesson.id
            set((m) => { m.lessons = m.lessons.filter((l) => l.id !== id) })
            toast('Lesson deleted from draft')
          } else {
            update((d) => { const c = findCourse(d, levelId, course.id); c.modules = c.modules.filter((m) => m.id !== module.id) })
            onSelect({ course: course.id })
            toast('Module deleted from draft')
          }
          setConfirm(null)
        }}
      />
    </div>
  )
}

type LessonTab = 'slides' | 'details'

function LessonEditor({ levelId, course, module, lesson, onSelect }: { levelId: LevelId; course: Course; module: Module; lesson: Lesson; onSelect: (s: Sel) => void }) {
  const { draft, update, openPreview } = useAdmin()
  const toast = useToast()
  const [tab, setTab] = useState<LessonTab>('slides')
  const [confirm, setConfirm] = useState(false)
  const set = (fn: (l: Lesson) => void) => update((d) => fn(findLesson(d, levelId, course.id, module.id, lesson.id)))
  const allModules = draft.levels.flatMap((l) => l.courses.flatMap((c) => c.modules.map((m) => ({ level: l, course: c, module: m }))))

  const moveTo = (target: string) => {
    const dest = allModules.find((x) => x.module.id === target)
    if (!dest || dest.module.id === module.id) return
    update((d) => {
      const from = findModule(d, levelId, course.id, module.id)
      const item = from.lessons.find((l) => l.id === lesson.id)!
      from.lessons = from.lessons.filter((l) => l.id !== lesson.id)
      findModule(d, dest.level.id, dest.course.id, dest.module.id).lessons.push(item)
    })
    onSelect({ level: dest.level.id, course: dest.course.id, module: dest.module.id, lesson: lesson.id } as Sel)
    toast(`Moved to ${dest.module.title}`)
  }

  const detailsFields = (
    <>
      <div className="grid grid-2">
        <NumberField label="Estimated time" suffix="minutes" min={1} max={600} value={lesson.minutes} onChange={(v) => set((l) => { l.minutes = v })} />
        <SelectField<Difficulty> label="Difficulty" value={lesson.difficulty} onChange={(v) => set((l) => { l.difficulty = v })} options={DIFFICULTIES.map((d) => ({ value: d, label: d }))} />
      </div>
      <SelectField
        label="Module"
        hint="Move this lesson to another module."
        value={module.id}
        onChange={moveTo}
        options={allModules.map((x) => ({ value: x.module.id, label: `${x.level.name} · ${x.course.title} · ${x.module.title}` }))}
      />
    </>
  )

  return (
    <div className="stack" style={{ '--gap': 'var(--space-4)' } as CSSProperties}>
      <Crumbs items={[{ label: course.title, onClick: () => onSelect({ course: course.id }) }, { label: module.title, onClick: () => onSelect({ course: course.id, module: module.id }) }, { label: lesson.title }]} />
      <div className="row-between">
        <div className="row">
          <Status published={lesson.published} />
          <Tabs<LessonTab> id="lesson-edit" label="Editor view" value={tab} onChange={setTab} tabs={[{ value: 'slides', label: 'Slides' }, { value: 'details', label: 'Details' }]} />
        </div>
        <div className="row">
          <button className="btn btn-sm" onClick={() => openPreview(`/lesson/${lesson.id}`)}><Eye size={15} aria-hidden /> Preview lesson</button>
          <button className={`btn btn-sm ${lesson.published ? '' : 'btn-primary'}`} onClick={() => set((l) => { l.published = !l.published })}>
            {lesson.published ? <><EyeOff size={15} aria-hidden /> Unpublish</> : <><Eye size={15} aria-hidden /> Mark as published</>}
          </button>
        </div>
      </div>
      <div id="lesson-edit-panel" role="tabpanel">
        {tab === 'slides' ? (
          <SlideEditor
            key={lesson.id}
            value={lesson}
            onReplace={(next) => set((l) => Object.assign(l, next))}
            cover={{ title: lesson.title, summary: lesson.summary, cover: lesson.cover, autoCover: coverFor(lesson.title, module.id), attachments: lesson.attachments ?? [], meta: <p className="subtle">{lesson.minutes} min · {lesson.difficulty}</p> }}
            onCoverChange={(patch) =>
              set((l) => {
                if ('title' in patch) l.title = patch.title!
                if ('summary' in patch) l.summary = patch.summary!
                if ('cover' in patch) l.cover = patch.cover
                if ('attachments' in patch) l.attachments = patch.attachments
              })
            }
            sections={[
              { id: 'learn', label: '1 · Learn', blocks: lesson.learn },
              { id: 'example', label: '2 · Example', blocks: lesson.example },
            ]}
            onBlocksChange={(id, blocks) => set((l) => { if (id === 'learn') l.learn = blocks; else l.example = blocks })}
            extras={[
              {
                id: 'practice',
                label: '3 · Practice',
                icon: Eye,
                thumb: <><h2>Practice</h2><p>{lesson.practice.task}</p></>,
                canvas: (
                  <div className="stack">
                    <h2>3 · Practice</h2>
                    <EditableText as="p" multiline label="practice task" value={lesson.practice.task} placeholder="What should the learner do?" onChange={(v) => set((l) => { l.practice.task = v })} style={{ fontWeight: 600 }} />
                    <EditableSteps label="step" items={lesson.practice.steps} onChange={(v) => set((l) => { l.practice.steps = v })} />
                    <p className="small"><strong>Deliverable: </strong></p>
                    <EditableText multiline label="deliverable" value={lesson.practice.deliverable} placeholder="What they hand in" onChange={(v) => set((l) => { l.practice.deliverable = v })} />
                  </div>
                ),
                panel: <p className="subtle">Steps appear as a checklist students tick off. Click any text on the slide to edit it.</p>,
              },
              {
                id: 'challenge',
                label: '4 · Challenge',
                icon: Eye,
                thumb: <><h2>Challenge</h2><p>{lesson.challenge.task}</p></>,
                canvas: (
                  <div className="stack">
                    <h2>4 · Challenge</h2>
                    <EditableText as="p" multiline label="challenge task" value={lesson.challenge.task} placeholder="A stretch task" onChange={(v) => set((l) => { l.challenge.task = v })} style={{ fontWeight: 600 }} />
                    <h3 style={{ fontSize: '1rem' }}>You’ve nailed it when…</h3>
                    <EditableSteps label="success criterion" items={lesson.challenge.successCriteria} onChange={(v) => set((l) => { l.challenge.successCriteria = v })} />
                  </div>
                ),
                panel: <p className="subtle">Success criteria help learners self-assess. Keep them checkable.</p>,
              },
            ]}
            previewPath={`/lesson/${lesson.id}`}
            pdfPath={`/print/lesson/${lesson.id}`}
            onPreview={openPreview}
            details={detailsFields}
          />
        ) : (
          <FormSection title="Lesson details">
            <TextField label="Title" required value={lesson.title} onChange={(v) => set((l) => { l.title = v })} />
            <TextArea label="Summary" rows={2} hint="One sentence shown on cards and in search." value={lesson.summary} onChange={(v) => set((l) => { l.summary = v })} />
            {detailsFields}
            <p className="subtle mono">ID: {lesson.id}</p>
          </FormSection>
        )}
      </div>
      <div className="row">
        <button
          className="btn"
          onClick={() => {
            const copy: Lesson = { ...structuredClone(lesson), id: newId('lesson', lesson.title), title: `${lesson.title} (copy)`, published: false }
            update((d) => {
              const m = findModule(d, levelId, course.id, module.id)
              const i = m.lessons.findIndex((l) => l.id === lesson.id)
              m.lessons.splice(i + 1, 0, copy)
            })
            onSelect({ course: course.id, module: module.id, lesson: copy.id })
            toast('Lesson duplicated as a draft')
          }}
        >
          <Copy size={16} aria-hidden /> Duplicate
        </button>
        <button className="btn" style={{ color: 'var(--c-danger)' }} onClick={() => setConfirm(true)}><Trash2 size={16} aria-hidden /> Delete lesson</button>
      </div>
      <ConfirmDialog
        open={confirm}
        danger
        title={`Delete “${lesson.title}”?`}
        body="The lesson is removed from the draft. Students keep seeing it until you publish, and you can restore previous versions."
        confirmLabel="Delete lesson"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          update((d) => { const m = findModule(d, levelId, course.id, module.id); m.lessons = m.lessons.filter((l) => l.id !== lesson.id) })
          setConfirm(false)
          onSelect({ course: course.id, module: module.id })
          toast('Lesson deleted from draft')
        }}
      />
    </div>
  )
}
