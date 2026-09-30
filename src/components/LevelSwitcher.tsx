import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '../lib/icons'
import { levelProgress } from '../lib/progress'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { useToast } from '../state/ui'
import { Modal, ProgressBar } from './ui'

export function LevelSwitcher({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { content } = useContent()
  const { state, setLevel } = useLearner()
  const toast = useToast()
  const navigate = useNavigate()
  return (
    <Modal open={open} onClose={onClose} title="Switch level" description="Your progress on every level is kept, so you can move between them freely.">
      <div className="stack" style={{ '--gap': '10px' } as CSSProperties} role="radiogroup" aria-label="Level">
        {content.levels.map((l) => {
          const p = levelProgress(l, state)
          const active = state.level === l.id
          return (
            <motion.button
              key={l.id}
              whileTap={{ scale: 0.98 }}
              role="radio"
              aria-checked={active}
              className="card card-tight card-link"
              style={{ textAlign: 'left', cursor: 'pointer', borderColor: active ? l.color : undefined, '--c-level': l.color } as CSSProperties}
              onClick={() => {
                if (!active) {
                  setLevel(l.id)
                  toast(`You’re now on the ${l.name} path`)
                  navigate('/')
                }
                onClose()
              }}
            >
              <div className="row" style={{ flexWrap: 'nowrap' }}>
                <span className="icon-tile" style={{ '--tile': l.color } as CSSProperties}>
                  <Icon name={l.icon} size={22} />
                </span>
                <span className="grow">
                  <strong style={{ display: 'block' }}>{l.name}</strong>
                  <span className="small muted">{l.headline}</span>
                </span>
                {active && <Check size={20} style={{ color: l.color }} aria-hidden />}
              </div>
              <div className="row" style={{ marginTop: 10, flexWrap: 'nowrap' }}>
                <div className="grow">
                  <ProgressBar value={p.pct} label={`${l.name} progress`} thin color={l.color} />
                </div>
                <span className="subtle nowrap">{p.done}/{p.total} lessons</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </Modal>
  )
}
