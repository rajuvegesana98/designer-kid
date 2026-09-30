import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useId, useState, type CSSProperties } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Brand } from '../components/Brand'
import { LevelIllustration } from '../components/Illustrations'
import type { LevelId } from '../content/types'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { useToast } from '../state/ui'

export function Onboarding() {
  const { content } = useContent()
  const { state, setLevel, setName } = useLearner()
  const [params] = useSearchParams()
  const initial = (params.get('level') as LevelId | null) ?? state.level
  const [selected, setSelected] = useState<LevelId | null>(content.levels.some((l) => l.id === initial) ? initial : null)
  const [name, setNameInput] = useState(state.name)
  const navigate = useNavigate()
  const toast = useToast()
  const nameId = useId()
  const level = content.levels.find((l) => l.id === selected)

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = content.levels[(i + dir + content.levels.length) % content.levels.length]
    setSelected(next.id)
    document.getElementById(`level-card-${next.id}`)?.focus()
  }

  const finish = () => {
    if (!level) return
    setLevel(level.id)
    if (name.trim() !== state.name) setName(name.trim())
    toast(`Welcome${name.trim() ? `, ${name.trim()}` : ''}! Your ${level.name} path is ready.`)
    navigate('/')
  }

  return (
    <div className="canvas-bg" style={{ minHeight: '100dvh' }}>
      <header className="page row-between" style={{ paddingTop: 20, paddingBottom: 0 }}>
        <Brand />
        <Link to="/" className="btn btn-ghost">
          <ArrowLeft size={18} aria-hidden /> Back
        </Link>
      </header>
      <main id="main" className="page" style={{ paddingTop: 'var(--space-6)' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stack" style={{ '--gap': '10px', textAlign: 'center', alignItems: 'center', marginBottom: 'var(--space-6)' } as CSSProperties}>
          <span className="eyebrow">Step 1 of 2</span>
          <h1 id="journey-title">Where are you in your design journey?</h1>
          <p className="lead" style={{ maxWidth: 560 }}>Pick the closest match. We’ll tailor your roadmap, lessons, projects and career guidance — and you can switch later.</p>
        </motion.div>

        <div className="grid grid-3" role="radiogroup" aria-labelledby="journey-title" style={{ '--gap': '24px' } as CSSProperties}>
          {content.levels.map((l, i) => {
            const active = selected === l.id
            return (
              <motion.div
                key={l.id}
                id={`level-card-${l.id}`}
                role="radio"
                aria-checked={active}
                tabIndex={active || (!selected && i === 0) ? 0 : -1}
                onClick={() => setSelected(l.id)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault()
                    if (active && e.key === 'Enter') finish()
                    else setSelected(l.id)
                  }
                  onKey(e, i)
                }}
                className={`card stack ${active ? 'frame' : ''}`}
                style={{ cursor: 'pointer', '--gap': '14px', '--c-primary': l.color, borderColor: active ? l.color : undefined } as CSSProperties}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
              >
                {active && (
                  <>
                    <span className="frame-handles" />
                    <span className="frame-label">Selected</span>
                  </>
                )}
                <LevelIllustration level={l.id} color={l.color} active={active} />
                <div className="row-between">
                  <span className="badge badge-level" style={{ '--level-color': l.color } as CSSProperties}>{l.name}</span>
                  <span
                    aria-hidden
                    style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${active ? l.color : 'var(--c-line-strong)'}`, background: active ? l.color : 'transparent', display: 'grid', placeItems: 'center', color: '#fff' }}
                  >
                    {active && <Check size={14} strokeWidth={3} />}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.35rem' }}>{l.headline}</h2>
                <p className="muted">{l.description}</p>
                <div>
                  <div className="subtle" style={{ fontWeight: 600, marginBottom: 6 }}>Recommended path</div>
                  <ol style={{ margin: 0, paddingLeft: '1.2em', fontSize: '0.93rem' }} className="stack">
                    {l.recommendedPath.map((p) => (
                      <li key={p} style={{ marginTop: 0 }}>{p}</li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence>
          {level && (
            <motion.div
              key="continue"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="card glass row"
              style={{ position: 'sticky', bottom: 'calc(16px + env(safe-area-inset-bottom))', marginTop: 'var(--space-6)', gap: 'var(--space-4)', boxShadow: 'var(--shadow-2)', zIndex: 5 }}
            >
              <div className="field grow" style={{ minWidth: 220 }}>
                <label htmlFor={nameId}>
                  What should we call you? <span className="subtle" style={{ fontWeight: 400 }}>(optional)</span>
                </label>
                <input id={nameId} className="input" value={name} onChange={(e) => setNameInput(e.target.value)} placeholder="Your first name" autoComplete="given-name" maxLength={60} onKeyDown={(e) => e.key === 'Enter' && finish()} />
              </div>
              <motion.button layout className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-end' }} onClick={finish} whileTap={{ scale: 0.97 }}>
                Continue as {level.name} <ArrowRight size={18} aria-hidden />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
