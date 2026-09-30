import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { LevelId } from '../content/types'

/** Playful, on-brand level illustrations drawn as design-tool canvases. */
export function LevelIllustration({ level, color, active }: { level: LevelId; color: string; active?: boolean }) {
  const reduce = useReducedMotion()
  const float = reduce ? {} : { y: active ? [-2, 2, -2] : 0 }
  const t = { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const }
  const soft = `color-mix(in oklab, ${color} 16%, var(--c-surface))`
  const mid = `color-mix(in oklab, ${color} 45%, var(--c-surface))`
  return (
    <svg viewBox="0 0 200 120" className="illus" role="img" aria-hidden="true">
      <rect x="1" y="1" width="198" height="118" rx="16" fill={soft} />
      {level === 'beginner' && (
        <>
          <rect x="62" y="22" width="76" height="76" rx="10" fill="var(--c-surface)" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
          {[
            [59, 19],
            [135, 19],
            [59, 95],
            [135, 95],
          ].map(([x, y]) => (
            <rect key={`${x}${y}`} x={x} y={y} width="6" height="6" rx="1.5" fill="var(--c-surface)" stroke={color} strokeWidth="1.5" />
          ))}
          <motion.g animate={float} transition={t}>
            <path d="M100 86V60" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M100 66c-10 0-16-6-17-16 10 0 16 6 17 16Z" fill={color} />
            <path d="M100 60c1-12 8-19 20-19-1 12-8 19-20 19Z" fill={mid} stroke={color} strokeWidth="1.5" />
          </motion.g>
          <rect x="84" y="86" width="32" height="6" rx="3" fill={mid} />
          <text x="62" y="15" fontSize="8" fontWeight="700" fill={color} fontFamily="var(--font-body)">Frame 1</text>
        </>
      )}
      {level === 'intermediate' && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.g key={i} animate={reduce ? {} : { y: active ? [0, -3 * (i + 1), 0] : 0 }} transition={{ ...t, delay: i * 0.15 }}>
              <rect x={46 + i * 14} y={60 - i * 16} width="84" height="40" rx="9" fill="var(--c-surface)" stroke={i === 2 ? color : mid} strokeWidth="1.5" />
              <rect x={56 + i * 14} y={70 - i * 16} width="30" height="6" rx="3" fill={i === 2 ? color : mid} />
              <rect x={56 + i * 14} y={82 - i * 16} width="52" height="5" rx="2.5" fill={soft} />
            </motion.g>
          ))}
          <circle cx="160" cy="28" r="9" fill="none" stroke={color} strokeWidth="1.5" />
          <path d="M156 28h8M160 24v8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {level === 'expert' && (
        <>
          {[
            [100, 60, 40, 30],
            [100, 60, 160, 32],
            [100, 60, 44, 94],
            [100, 60, 156, 92],
            [40, 30, 44, 94],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={mid} strokeWidth="1.5" strokeDasharray="3 3" />
          ))}
          {[
            [40, 30],
            [160, 32],
            [44, 94],
            [156, 92],
          ].map(([cx, cy], i) => (
            <motion.g key={i} animate={reduce ? {} : { scale: active ? [1, 1.08, 1] : 1 }} transition={{ ...t, delay: i * 0.2 }} style={{ transformOrigin: `${cx}px ${cy}px` } as CSSProperties}>
              <rect x={cx - 13} y={cy - 10} width="26" height="20" rx="6" fill="var(--c-surface)" stroke={mid} strokeWidth="1.5" />
            </motion.g>
          ))}
          <motion.g animate={float} transition={t}>
            <rect x="80" y="44" width="40" height="32" rx="9" fill={color} />
            <path d="M90 66l4-12 6 7 6-7 4 12Z" fill="var(--c-surface)" />
          </motion.g>
        </>
      )}
    </svg>
  )
}

/** Hero composition: floating product cards that preview the learning experience. */
export function HeroVisual() {
  const reduce = useReducedMotion()
  const drift = (d: number) => (reduce ? {} : { animate: { y: [0, -8, 0] }, transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const, delay: d } })
  return (
    <div aria-hidden="true" style={{ position: 'relative', minHeight: 380 }}>
      <div
        style={{
          position: 'absolute',
          inset: '8% 4% 6% 10%',
          borderRadius: 28,
          background: 'radial-gradient(80% 80% at 30% 20%, color-mix(in oklab, var(--c-primary) 28%, transparent), transparent 70%), radial-gradient(70% 70% at 90% 90%, color-mix(in oklab, var(--c-secondary) 24%, transparent), transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      <motion.div className="card glass frame" style={{ position: 'absolute', top: '10%', left: '6%', width: '64%', padding: 20 }} {...drift(0)}>
        <span className="frame-handles" />
        <span className="frame-label">Lesson · Auto Layout</span>
        <div className="eyebrow">Figma Fundamentals</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', margin: '6px 0 12px' }}>Build a button that grows with its label</div>
        <div className="row" style={{ '--gap': '6px' } as CSSProperties}>
          {['Learn', 'Example', 'Practice', 'Challenge'].map((s, i) => (
            <span key={s} className={`badge ${i < 2 ? 'badge-primary' : ''}`}>{s}</span>
          ))}
        </div>
      </motion.div>
      <motion.div className="card glass" style={{ position: 'absolute', top: '48%', right: '2%', width: '46%', padding: 18 }} {...drift(0.8)}>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="23" fill="none" stroke="var(--c-surface-3)" strokeWidth="7" />
            <circle cx="28" cy="28" r="23" fill="none" stroke="var(--c-accent)" strokeWidth="7" strokeLinecap="round" strokeDasharray="144.5" strokeDashoffset="52" transform="rotate(-90 28 28)" />
          </svg>
          <div>
            <div className="subtle">Figma module</div>
            <strong style={{ fontSize: '1.1rem' }}>9 of 14 lessons</strong>
          </div>
        </div>
      </motion.div>
      <motion.div className="card glass" style={{ position: 'absolute', bottom: '4%', left: '0%', width: '48%', padding: 16 }} {...drift(1.6)}>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <span className="icon-tile icon-tile-sm" style={{ '--tile': 'var(--c-secondary)' } as CSSProperties}>★</span>
          <div>
            <strong style={{ display: 'block' }}>Achievement unlocked</strong>
            <span className="small muted">Figma Explorer</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
