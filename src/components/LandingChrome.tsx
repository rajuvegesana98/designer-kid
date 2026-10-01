import { useEffect, useState } from 'react'

const UX_TERMS = [
  'User Research', '·', 'Wireframing', '·', 'Prototyping', '·',
  'Usability Testing', '·', 'Information Architecture', '·', 'Interaction Design', '·',
  'Visual Hierarchy', '·', 'Gestalt Principles', '·', 'Accessibility', '·',
  'Design Systems', '·', 'Component Library', '·', 'Auto Layout', '·',
  'Grid & Spacing', '·', 'Typography Scale', '·', 'Colour Theory', '·',
  'Contrast Ratio', '·', 'Affordance', '·', 'Mental Model', '·',
  'Card Sorting', '·', 'Journey Mapping', '·', 'Persona', '·',
  'Empathy Map', '·', 'Heuristic Eval', '·', 'A/B Testing', '·',
  'Eye Tracking', '·', "Fitts's Law", '·', "Miller's Law", '·',
  "Jakob's Law", '·', "Hick's Law", '·', 'F-Pattern', '·',
  'Z-Pattern', '·', 'CTA', '·', 'Above the Fold', '·',
  'Progressive Disclosure', '·', 'Microinteraction', '·', 'Motion Design', '·',
  'Dark Mode', '·', 'Responsive Design', '·', 'Mobile First', '·',
]

export function UXMarquee() {
  const items = [...UX_TERMS, ...UX_TERMS]
  return (
    <div className="ux-marquee" aria-hidden="true">
      <div className="ux-marquee__inner">
        {items.map((term, i) =>
          term === '·' ? (
            <span key={i} className="ux-marquee__item ux-marquee__item--dot" />
          ) : (
            <span key={i} className={`ux-marquee__item${i % 7 === 0 ? ' ux-marquee__item--accent' : ''}`}>
              {term}
            </span>
          )
        )}
      </div>
    </div>
  )
}

function Ruler({ position }: { position: 'top' | 'bottom' }) {
  const [mouseX, setMouseX] = useState<number | null>(null)
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouseX(e.clientX)
    const onLeave = () => setMouseX(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const step = width > 800 ? 100 : 200
  const ticks: { x: number; major: boolean }[] = []
  for (let x = 0; x <= width; x += 50) {
    ticks.push({ x, major: x % step === 0 })
  }

  const pct = mouseX != null ? Math.round((mouseX / width) * 100) : null

  return (
    <div
      className={`design-ruler${position === 'bottom' ? ' design-ruler--bottom' : ''}`}
      aria-hidden="true"
    >
      <div className="design-ruler__track">
        {ticks.map(({ x, major }) => (
          <span
            key={x}
            className="design-ruler__tick"
            style={{ left: x, height: major ? 12 : 5 }}
          >
            {major && x > 0 && (
              <span className="design-ruler__label">{x}</span>
            )}
          </span>
        ))}
      </div>
      {mouseX != null && (
        <div className="design-ruler__cursor" style={{ left: mouseX }}>
          <span className="design-ruler__cursor-label">{mouseX}px · {pct}%</span>
        </div>
      )}
    </div>
  )
}

export function DesignRulers() {
  return (
    <>
      <Ruler position="top" />
      <Ruler position="bottom" />
    </>
  )
}
