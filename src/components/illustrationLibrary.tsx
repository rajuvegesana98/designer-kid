import { useId } from 'react'
import type { JSX } from 'react'
import type { IllustrationName } from '../content/types'

/* ------------------------------------------------------------------------ */
/* Topic illustrations: one flat "creative studio" canvas per lesson topic.  */
/* Static inline SVG (safe for print/PDF). Colours come only from CSS vars.  */
/* ------------------------------------------------------------------------ */

const P = 'var(--c-primary, #4F3FF0)'
const S = 'var(--c-secondary, #E8590C)'
const A = 'var(--c-accent, #0E9F6E)'
const SURF = 'var(--c-surface, #fff)'
const INK = 'var(--c-text, #16171D)'
const LINE = 'var(--c-line-strong, rgba(22,23,29,.22))'
const FONT = 'var(--font-body, system-ui, sans-serif)'
const HFONT = 'var(--font-heading, var(--font-body, system-ui, sans-serif))'
const mix = (c: string, pct: number) => `color-mix(in oklab, ${c} ${pct}%, ${SURF})`
/** Neutral greys derived from the text colour so they follow the theme. */
const G = mix(INK, 12)
const G2 = mix(INK, 26)
const G3 = mix(INK, 60)

export const ILLUSTRATION_NAMES: IllustrationName[] = [
  'ui-vs-ux',
  'design-process',
  'visual-hierarchy',
  'layout-grid',
  'spacing',
  'typography',
  'colour',
  'accessibility',
  'figma',
  'components',
  'prototype',
  'research',
  'persona',
  'user-flow',
  'wireframe',
  'usability-test',
  'dashboard',
  'mobile',
  'portfolio',
  'resume',
  'linkedin',
  'interview',
  'networking',
  'job-search',
  'strategy',
  'design-system',
  'leadership',
  'career-growth',
]

export const ILLUSTRATION_LABELS: Record<IllustrationName, string> = {
  'ui-vs-ux': 'UI vs UX',
  'design-process': 'Design process',
  'visual-hierarchy': 'Visual hierarchy',
  'layout-grid': 'Layout grid',
  spacing: 'Spacing',
  typography: 'Typography',
  colour: 'Colour',
  accessibility: 'Accessibility',
  figma: 'Figma',
  components: 'Components',
  prototype: 'Prototype',
  research: 'User research',
  persona: 'Persona',
  'user-flow': 'User flow',
  wireframe: 'Wireframe',
  'usability-test': 'Usability testing',
  dashboard: 'Dashboard',
  mobile: 'Mobile design',
  portfolio: 'Portfolio',
  resume: 'Resume',
  linkedin: 'LinkedIn profile',
  interview: 'Interview',
  networking: 'Networking',
  'job-search': 'Job search',
  strategy: 'Design strategy',
  'design-system': 'Design system',
  leadership: 'Design leadership',
  'career-growth': 'Career growth',
}

/* ---------- shared primitives ---------- */

type Box = { x: number; y: number; w: number; h: number }

function Card({ x, y, w, h, rx = 8, fill = SURF, stroke = LINE, dash }: Box & { rx?: number; fill?: string; stroke?: string; dash?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray={dash} />
}

function Bar({ x, y, w, h = 6, fill = G }: { x: number; y: number; w: number; h?: number; fill?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />
}

/** The signature dashed "selected frame" with square corner handles. */
function Sel({ x, y, w, h, label, color = P, rx = 6 }: Box & { label?: string; color?: string; rx?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
      {[
        [x, y],
        [x + w, y],
        [x, y + h],
        [x + w, y + h],
      ].map(([cx, cy]) => (
        <rect key={`${cx}-${cy}`} x={cx - 3} y={cy - 3} width="6" height="6" rx="1.5" fill={SURF} stroke={color} strokeWidth="1.5" />
      ))}
      {label && <Label x={x} y={y - 6} fill={color}>{label}</Label>}
    </g>
  )
}

function Label({ x, y, children, fill = G3, size = 8, anchor, weight = 700 }: { x: number; y: number; children: string; fill?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; weight?: number }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} fontFamily={FONT} textAnchor={anchor}>
      {children}
    </text>
  )
}

/** Simple person glyph: head + shoulders, origin at head centre. */
function Person({ x, y, s = 1, fill = P }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="0" r="6" fill={fill} />
      <path d="M-11 22C-11 12-6 9 0 9s11 3 11 13Z" fill={fill} />
    </g>
  )
}

function Check({ x, y, r = 9, fill = A }: { x: number; y: number; r?: number; fill?: string }) {
  const k = r / 9
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} />
      <path d={`M${x - 4 * k} ${y}l${3 * k} ${3 * k} ${5 * k}-${6 * k}`} fill="none" stroke={SURF} strokeWidth={2 * k} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

function Magnifier({ x, y, r, color = P }: { x: number; y: number; r: number; color?: string }) {
  const d = r * 0.72
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={SURF} fillOpacity="0.45" stroke={color} strokeWidth="6" />
      <path d={`M${x + d + 3} ${y + d + 3}l${r * 0.8} ${r * 0.8}`} stroke={color} strokeWidth="10" strokeLinecap="round" />
    </g>
  )
}

function Cursor({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y}v15l4-4 3.5 6.5 3-1.5-3.5-6.5h5.5Z`} fill={INK} stroke={SURF} strokeWidth="1.2" strokeLinejoin="round" />
}

type Ctx = { arrow: string }

/* ---------- the 28 scenes ---------- */

const scenes: Record<IllustrationName, (c: Ctx) => JSX.Element> = {
  'ui-vs-ux': () => (
    <>
      <Card x={34} y={36} w={108} h={118} rx={10} />
      <Bar x={44} y={46} w={40} h={5} fill={G2} />
      <circle cx={130} cy={48.5} r={3} fill={G2} />
      <rect x={44} y={58} width={88} height={40} rx={6} fill={mix(P, 20)} />
      <path d="M50 94l16-17 10 10 9-8 16 15Z" fill={mix(P, 45)} />
      <circle cx={118} cy={70} r={5} fill={mix(S, 55)} />
      <Bar x={44} y={106} w={70} fill={G2} />
      <Bar x={44} y={117} w={52} h={5} />
      <rect x={44} y={130} width={46} height={14} rx={7} fill={P} />
      <Sel x={30} y={32} w={116} h={126} rx={12} label="UI" />
      <circle cx={160} cy={95} r={11} fill={SURF} stroke={LINE} strokeWidth="1.5" />
      <Label x={160} y={98} anchor="middle" size={9}>vs</Label>
      <Card x={176} y={36} w={116} h={118} rx={10} />
      <Label x={176} y={26} fill={S}>UX</Label>
      <path d="M188 138h92" stroke={G2} strokeWidth="1.5" strokeLinecap="round" />
      {[196, 222, 248, 274].map((x) => (
        <path key={x} d={`M${x} 135v6`} stroke={G2} strokeWidth="1.5" strokeLinecap="round" />
      ))}
      <path d="M192 104C204 82 214 82 222 104s18 30 28 12 16-50 30-56" fill="none" stroke={S} strokeWidth="3" strokeLinecap="round" />
      <circle cx={192} cy={104} r={4.5} fill={SURF} stroke={P} strokeWidth="2" />
      <circle cx={236} cy={124} r={4.5} fill={SURF} stroke={S} strokeWidth="2" />
      <circle cx={280} cy={60} r={9} fill={A} />
      <circle cx={277} cy={58} r={1.3} fill={SURF} />
      <circle cx={283} cy={58} r={1.3} fill={SURF} />
      <path d="M276 62.5q4 3.5 8 0" fill="none" stroke={SURF} strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),

  'design-process': () => {
    const cx = 160
    const cy = 96
    const rx = 96
    const ry = 50
    const steps = ['Empathise', 'Define', 'Ideate', 'Prototype', 'Test']
    const cols = [P, S, A, P, S]
    const at = (deg: number) => {
      const t = (deg * Math.PI) / 180
      return { x: cx + rx * Math.cos(t), y: cy + ry * Math.sin(t), t }
    }
    return (
      <>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={mix(P, 45)} strokeWidth="2" strokeDasharray="5 4" />
        {steps.map((_, i) => {
          const m = at(-54 + i * 72)
          const rot = (Math.atan2(ry * Math.cos(m.t), -rx * Math.sin(m.t)) * 180) / Math.PI
          return <path key={i} d="M-3.5-4.5L2 0l-5.5 4.5" transform={`translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) rotate(${rot.toFixed(1)})`} fill="none" stroke={P} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        })}
        {steps.map((s, i) => {
          const n = at(-90 + i * 72)
          const ly = i === 0 ? n.y + 27 : i === 1 || i === 4 ? n.y - 21 : n.y + 27
          return (
            <g key={s}>
              <circle cx={n.x} cy={n.y} r={15} fill={SURF} stroke={cols[i]} strokeWidth="2" />
              <circle cx={n.x} cy={n.y} r={6} fill={cols[i]} />
              <Label x={n.x} y={ly} anchor="middle" size={7.5} fill={G3}>{s}</Label>
            </g>
          )
        })}
        <Label x={cx} y={cy + 3} anchor="middle" size={9} fill={P}>Iterate</Label>
      </>
    )
  },

  'visual-hierarchy': () => (
    <>
      <Card x={62} y={28} w={160} h={128} rx={12} />
      <rect x={78} y={48} width={128} height={16} rx={5} fill={P} />
      <Bar x={78} y={76} w={94} h={9} fill={G2} />
      <Bar x={78} y={94} w={116} h={5} />
      <Bar x={78} y={104} w={100} h={5} />
      <Bar x={78} y={114} w={108} h={5} />
      <rect x={78} y={128} width={52} height={16} rx={8} fill={S} />
      <Sel x={74} y={44} w={136} h={24} label="H1" />
      {[
        [56, 12, P, '1'],
        [80.5, 9, S, '2'],
        [104, 7, A, '3'],
      ].map(([y, r, c, n]) => (
        <g key={n as string}>
          <path d={`M224 ${y}h${258 - (r as number) - 224}`} stroke={LINE} strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx={258} cy={y as number} r={r as number} fill={c as string} />
          <Label x={258} y={(y as number) + (r as number) / 3 + 0.5} anchor="middle" size={(r as number) * 0.95} fill={SURF}>{n as string}</Label>
        </g>
      ))}
    </>
  ),

  'layout-grid': () => {
    const x0 = 54
    const cw = (212 - 5 * 8) / 6
    const colX = (i: number) => x0 + i * (cw + 8)
    const span = (n: number) => n * cw + (n - 1) * 8
    return (
      <>
        <Card x={42} y={30} w={236} h={126} rx={10} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={colX(i)} y={38} width={cw} height={110} fill={mix(S, 16)} />
        ))}
        <rect x={colX(0)} y={46} width={span(6)} height={12} rx={4} fill={G2} />
        <rect x={colX(0)} y={66} width={span(4)} height={40} rx={6} fill={mix(P, 45)} />
        <rect x={colX(4)} y={66} width={span(2)} height={40} rx={6} fill={mix(A, 45)} />
        {[0, 2, 4].map((i) => (
          <rect key={i} x={colX(i)} y={114} width={span(2)} height={26} rx={6} fill={SURF} stroke={LINE} strokeWidth="1.5" />
        ))}
        <path d={`M${colX(0) + cw} 32v4M${colX(1)} 32v4M${colX(0) + cw} 34h8`} stroke={S} strokeWidth="1.2" />
        <Sel x={38} y={26} w={244} h={134} rx={12} label="Grid · 6 col" />
      </>
    )
  },

  spacing: () => (
    <>
      <Card x={34} y={40} w={252} h={100} rx={12} fill={mix(P, 4)} />
      <rect x={106} y={62} width={26} height={56} fill={mix(S, 22)} />
      <rect x={188} y={62} width={26} height={56} fill={mix(S, 22)} />
      <rect x={34} y={40} width={252} height={22} rx={0} fill={mix(P, 14)} opacity="0.7" />
      {[50, 132, 214].map((x, i) => (
        <g key={x}>
          <rect x={x} y={62} width={56} height={56} rx={10} fill={SURF} stroke={LINE} strokeWidth="1.5" />
          <rect x={x + 16} y={78} width={24} height={24} rx={6} fill={[P, S, A][i]} opacity="0.85" />
        </g>
      ))}
      {[108, 190].map((x) => (
        <g key={x}>
          <path d={`M${x} 90h22M${x} 85v10M${x + 22} 85v10`} stroke={S} strokeWidth="1.5" />
          <Label x={x + 11} y={80} anchor="middle" fill={S}>24</Label>
        </g>
      ))}
      <path d="M160 42v18M155 42h10M155 60h10" stroke={P} strokeWidth="1.5" />
      <Label x={166} y={54} fill={P}>16</Label>
      <Sel x={34} y={40} w={252} h={100} rx={12} label="Auto layout" />
    </>
  ),

  typography: () => (
    <>
      <path d="M44 128h116" stroke={S} strokeWidth="1" strokeDasharray="3 3" />
      <path d="M44 76h116" stroke={mix(S, 60)} strokeWidth="1" strokeDasharray="3 3" />
      <text x={102} y={128} fontSize="70" fontWeight="700" fill={P} fontFamily={HFONT} textAnchor="middle">Aa</text>
      <Sel x={50} y={52} w={104} h={88} rx={8} label="Heading" />
      <Card x={172} y={38} w={124} h={108} rx={10} />
      <Bar x={184} y={52} w={84} h={14} fill={G3} />
      <Bar x={184} y={76} w={70} h={10} fill={G2} />
      <Bar x={184} y={96} w={80} h={6} fill={G2} />
      <Bar x={184} y={110} w={74} h={5} />
      <Bar x={184} y={121} w={62} h={5} />
      <Bar x={184} y={132} w={70} h={5} />
      {[
        ['32', 62],
        ['24', 84],
        ['16', 102],
        ['12', 128],
      ].map(([t, y]) => (
        <Label key={t} x={288} y={y as number} anchor="end" size={7} weight={600}>{t as string}</Label>
      ))}
    </>
  ),

  colour: () => (
    <>
      <Card x={28} y={30} w={196} h={66} rx={10} />
      {[P, S, A, INK, mix(P, 30)].map((c, i) => (
        <rect key={i} x={38 + i * 36} y={40} width={32} height={46} rx={6} fill={c} />
      ))}
      <Sel x={35} y={37} w={38} h={52} rx={8} />
      {[100, 75, 50, 30, 14].map((p, i) => (
        <circle key={p} cx={48 + i * 28} cy={124} r={11} fill={mix(P, p)} stroke={LINE} strokeWidth="1" />
      ))}
      <Label x={36} y={150} size={7} weight={600}>Tints</Label>
      <rect x={236} y={30} width={60} height={42} rx={8} fill={INK} />
      <text x={266} y={57} fontSize="16" fontWeight="700" fill={SURF} fontFamily={HFONT} textAnchor="middle">Aa</text>
      <rect x={236} y={78} width={60} height={42} rx={8} fill={SURF} stroke={LINE} strokeWidth="1.5" />
      <text x={266} y={105} fontSize="16" fontWeight="700" fill={INK} fontFamily={HFONT} textAnchor="middle">Aa</text>
      <Label x={236} y={142} size={8}>4.5 : 1</Label>
      <Check x={284} y={139} r={8} />
    </>
  ),

  accessibility: () => (
    <>
      <Card x={24} y={36} w={132} h={112} rx={12} />
      <rect x={34} y={58} width={112} height={42} rx={21} fill="none" stroke={A} strokeWidth="3" />
      <rect x={40} y={64} width={100} height={30} rx={15} fill={P} />
      <Bar x={66} y={76} w={48} h={6} fill={SURF} />
      <rect x={40} y={112} width={40} height={24} rx={5} fill={SURF} stroke={LINE} strokeWidth="1.5" />
      <path d="M40 132h40" stroke={LINE} strokeWidth="2.5" />
      <Label x={60} y={127} anchor="middle" size={8}>Tab</Label>
      <Cursor x={128} y={108} />
      <Label x={34} y={30} fill={A}>Focus visible</Label>
      <rect x={168} y={62} width={50} height={50} rx={10} fill={SURF} stroke={LINE} strokeWidth="1.5" />
      <text x={193} y={93} fontSize="17" fontWeight="800" fill={INK} fontFamily={HFONT} textAnchor="middle">AA</text>
      <Check x={216} y={64} r={8} />
      <circle cx={260} cy={90} r={34} fill={mix(P, 16)} stroke={P} strokeWidth="2" />
      <circle cx={260} cy={70} r={6} fill={P} />
      <path d="M240 82h40M260 82v18M260 100l-10 16M260 100l10 16" stroke={P} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),

  figma: () => (
    <>
      <Card x={22} y={22} w={276} h={20} rx={7} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={32 + i * 14} y={28} width={8} height={8} rx={2} fill={i === 1 ? P : G2} />
      ))}
      <rect x={262} y={27} width={28} height={10} rx={5} fill={P} />
      <Card x={22} y={50} w={78} h={108} rx={8} />
      <rect x={26} y={70} width={70} height={14} rx={4} fill={mix(P, 18)} />
      {[40, 34, 44, 30, 38, 28].map((w, i) => (
        <g key={i}>
          <rect x={32 + (i > 1 ? 8 : 0)} y={60 + i * 16 - 2} width={7} height={7} rx={1.5} fill={i === 1 ? P : G2} />
          <Bar x={44 + (i > 1 ? 8 : 0)} y={60 + i * 16 - 1} w={w} h={5} fill={i === 1 ? mix(P, 60) : G} />
        </g>
      ))}
      <Card x={268} y={50} w={30} h={108} rx={8} />
      {[62, 76, 90, 104].map((y) => (
        <Bar key={y} x={274} y={y} w={18} h={5} />
      ))}
      <Card x={130} y={70} w={116} h={78} rx={4} />
      <rect x={140} y={80} width={96} height={26} rx={4} fill={mix(S, 30)} />
      <Bar x={140} y={114} w={70} h={6} fill={G2} />
      <Bar x={140} y={126} w={50} h={5} />
      <rect x={196} y={124} width={40} height={14} rx={7} fill={P} />
      <Sel x={130} y={70} w={116} h={78} rx={4} label="Frame 1" />
      <Cursor x={236} y={132} />
    </>
  ),

  components: () => (
    <>
      <Card x={30} y={58} w={104} h={64} rx={10} />
      <rect x={46} y={80} width={72} height={22} rx={11} fill={P} />
      <Bar x={64} y={88} w={36} h={6} fill={SURF} />
      <path d="M124 66l3 3-3 3-3-3ZM118 72l3 3-3 3-3-3ZM130 72l3 3-3 3-3-3ZM124 78l3 3-3 3-3-3Z" fill={P} />
      <Sel x={30} y={58} w={104} h={64} rx={10} label="Main component" />
      {[
        [28, P],
        [74, S],
        [120, A],
      ].map(([y, c]) => (
        <g key={y as number}>
          <path d={`M134 90C166 90 164 ${(y as number) + 18} 194 ${(y as number) + 18}`} fill="none" stroke={mix(P, 50)} strokeWidth="1.5" strokeDasharray="4 3" />
          <Card x={194} y={y as number} w={96} h={36} rx={8} />
          <rect x={206} y={(y as number) + 10} width={56} height={16} rx={8} fill={c as string} />
          <Bar x={218} y={(y as number) + 15.5} w={32} h={5} fill={SURF} />
          <path d={`M279 ${(y as number) + 8}l4 4-4 4-4-4Z`} fill="none" stroke={P} strokeWidth="1.3" />
        </g>
      ))}
      <circle cx={134} cy={90} r={3.5} fill={P} />
    </>
  ),

  prototype: ({ arrow }) => (
    <>
      <Card x={52} y={24} w={76} h={134} rx={14} />
      <Bar x={66} y={36} w={22} h={4} fill={G2} />
      <rect x={62} y={48} width={56} height={34} rx={6} fill={mix(P, 22)} />
      <Bar x={62} y={90} w={50} h={6} fill={G2} />
      <Bar x={62} y={101} w={40} h={5} />
      <Bar x={62} y={110} w={46} h={5} />
      <rect x={62} y={128} width={56} height={18} rx={9} fill={P} />
      <circle cx={90} cy={137} r={13} fill={P} opacity="0.18" />
      <Card x={192} y={24} w={76} h={134} rx={14} />
      <Bar x={206} y={36} w={22} h={4} fill={G2} />
      <rect x={202} y={48} width={56} height={46} rx={6} fill={mix(S, 32)} />
      <Check x={230} y={71} r={10} />
      <Bar x={202} y={102} w={50} h={6} fill={G2} />
      <Bar x={202} y={113} w={36} h={5} />
      <Bar x={202} y={122} w={44} h={5} />
      <Sel x={188} y={20} w={84} h={142} rx={16} label="Screen 2" />
      <path d="M120 137C160 137 150 62 184 62" fill="none" stroke={P} strokeWidth="2" markerEnd={arrow} />
      <circle cx={120} cy={137} r={3.5} fill={SURF} stroke={P} strokeWidth="2" />
      <Label x={134} y={156} fill={P} size={7.5}>On tap</Label>
    </>
  ),

  research: () => (
    <>
      <Card x={26} y={24} w={196} h={132} rx={10} />
      {[
        [40, 36, -4, mix(S, 38)],
        [96, 38, 3, mix(A, 38)],
        [152, 34, -2, mix(P, 30)],
        [48, 94, 2, mix(P, 30)],
        [106, 96, -3, mix(S, 26)],
      ].map(([x, y, r, c], i) => (
        <g key={i} transform={`rotate(${r} ${(x as number) + 22} ${(y as number) + 22})`}>
          <rect x={x as number} y={y as number} width={46} height={46} rx={3} fill={c as string} />
          <Bar x={(x as number) + 7} y={(y as number) + 12} w={30} h={4} fill={G2} />
          <Bar x={(x as number) + 7} y={(y as number) + 21} w={22} h={4} fill={G2} />
        </g>
      ))}
      <Sel x={148} y={30} w={54} h={54} rx={4} />
      <Magnifier x={226} y={96} r={32} />
      <Bar x={210} y={90} w={32} h={5} fill={G3} />
      <Bar x={210} y={100} w={22} h={5} fill={G2} />
    </>
  ),

  persona: () => (
    <>
      <Card x={60} y={26} w={200} h={130} rx={12} />
      <circle cx={100} cy={66} r={22} fill={mix(P, 22)} />
      <Person x={100} y={60} s={1} fill={P} />
      <Bar x={132} y={52} w={74} h={9} fill={G3} />
      <Bar x={132} y={67} w={50} h={6} />
      <rect x={132} y={80} width={36} height={11} rx={5.5} fill={mix(A, 35)} />
      <rect x={172} y={80} width={30} height={11} rx={5.5} fill={mix(S, 35)} />
      {[
        [106, 92, P],
        [120, 60, S],
        [134, 104, A],
      ].map(([y, w, c]) => (
        <g key={y as number}>
          <Bar x={76} y={y as number} w={38} h={5} />
          <Bar x={124} y={(y as number) - 0.5} w={120} h={6} />
          <Bar x={124} y={(y as number) - 0.5} w={w as number} h={6} fill={c as string} />
        </g>
      ))}
      <Sel x={56} y={22} w={208} h={138} rx={14} label="Persona" />
    </>
  ),

  'user-flow': ({ arrow }) => (
    <>
      <rect x={18} y={80} width={46} height={22} rx={11} fill={A} />
      <Bar x={29} y={88.5} w={24} h={5} fill={SURF} />
      <Card x={84} y={76} w={54} h={30} rx={6} />
      <Bar x={94} y={85} w={34} h={5} fill={G2} />
      <Bar x={94} y={94} w={24} h={4} />
      <path d="M180 67l24 24-24 24-24-24Z" fill={mix(S, 28)} stroke={S} strokeWidth="1.5" />
      <Label x={180} y={95} anchor="middle" size={11} fill={S}>?</Label>
      <Sel x={152} y={63} w={56} h={56} rx={4} label="Decision" />
      <Card x={234} y={34} w={66} h={30} rx={6} />
      <Bar x={244} y={43} w={40} h={5} fill={G2} />
      <Bar x={244} y={52} w={28} h={4} />
      <Card x={234} y={118} w={66} h={30} rx={6} />
      <Bar x={244} y={127} w={40} h={5} fill={G2} />
      <Bar x={244} y={136} w={28} h={4} />
      <path d="M64 91h16M138 91h14" fill="none" stroke={P} strokeWidth="1.5" markerEnd={arrow} />
      <path d="M204 91h10V49h16" fill="none" stroke={P} strokeWidth="1.5" markerEnd={arrow} />
      <path d="M214 91v42h16" fill="none" stroke={P} strokeWidth="1.5" markerEnd={arrow} />
      <Label x={218} y={44} size={7} fill={A}>yes</Label>
      <Label x={218} y={146} size={7} fill={S}>no</Label>
    </>
  ),

  wireframe: () => (
    <>
      <Card x={40} y={24} w={240} h={136} rx={10} />
      <rect x={52} y={34} width={26} height={9} rx={2} fill={G2} />
      {[206, 226, 246].map((x) => (
        <Bar key={x} x={x} y={36} w={16} h={4} />
      ))}
      <path d="M40 50h240" stroke={G} strokeWidth="1.5" />
      <rect x={52} y={60} width={128} height={54} rx={4} fill="none" stroke={G2} strokeWidth="1.5" />
      <path d="M52 60l128 54M180 60L52 114" stroke={G2} strokeWidth="1.2" />
      <Sel x={52} y={60} w={128} h={54} rx={4} label="Lo-fi" />
      <Bar x={194} y={64} w={72} h={8} fill={G2} />
      <Bar x={194} y={78} w={60} h={5} />
      <Bar x={194} y={88} w={66} h={5} />
      <rect x={194} y={99} width={42} height={14} rx={7} fill="none" stroke={G2} strokeWidth="1.5" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={52 + i * 74} y={124} width={66} height={26} rx={4} fill="none" stroke={G2} strokeWidth="1.5" />
          <circle cx={64 + i * 74} cy={137} r={5} fill={G} />
          <Bar x={74 + i * 74} y={134.5} w={36} h={5} />
        </g>
      ))}
    </>
  ),

  'usability-test': () => (
    <>
      <Card x={24} y={28} w={164} h={124} rx={10} />
      <path d="M24 44h164" stroke={LINE} strokeWidth="1.5" />
      {[34, 42, 50].map((x) => (
        <circle key={x} cx={x} cy={36} r={2.5} fill={G2} />
      ))}
      <rect x={36} y={54} width={140} height={34} rx={6} fill={mix(P, 18)} />
      <Bar x={36} y={96} w={96} h={6} fill={G2} />
      <Bar x={36} y={108} w={120} h={5} />
      <circle cx={132} cy={130} r={16} fill={S} opacity="0.18" />
      <circle cx={132} cy={130} r={9} fill={S} opacity="0.3" />
      <rect x={108} y={122} width={50} height={16} rx={8} fill={P} />
      <Sel x={104} y={118} w={58} h={24} rx={10} color={S} />
      <Cursor x={142} y={130} />
      <path d="M226 40q20-16 40 0q-20 16-40 0Z" fill={SURF} stroke={INK} strokeWidth="1.5" />
      <circle cx={246} cy={40} r={6} fill={P} />
      <circle cx={246} cy={40} r={2.2} fill={INK} />
      <Card x={204} y={62} w={92} h={90} rx={10} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          {i < 2 ? <Check x={220} y={82 + i * 24} r={7} /> : <circle cx={220} cy={82 + i * 24} r={6.5} fill="none" stroke={G2} strokeWidth="1.5" />}
          <Bar x={234} y={79.5 + i * 24} w={48 - i * 8} h={5} fill={i < 2 ? G2 : G} />
        </g>
      ))}
    </>
  ),

  dashboard: () => (
    <>
      <Card x={22} y={22} w={40} h={136} rx={10} />
      <rect x={32} y={32} width={20} height={20} rx={6} fill={P} />
      {[66, 84, 102, 120].map((y, i) => (
        <rect key={y} x={34} y={y} width={16} height={10} rx={3} fill={i === 0 ? mix(P, 35) : G} />
      ))}
      {[P, S, A].map((c, i) => (
        <g key={i}>
          <Card x={72 + i * 76} y={22} w={68} h={38} rx={8} />
          <Bar x={82 + i * 76} y={31} w={28} h={4} />
          <Bar x={82 + i * 76} y={42} w={36} h={9} fill={c} />
          <path d={`M${124 + i * 76} ${50 - (i === 1 ? 0 : 6)}l4 ${i === 1 ? 5 : -5} 4 ${i === 1 ? -3 : 3}`} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
      <Sel x={72} y={22} w={68} h={38} rx={8} label="KPI" />
      <Card x={72} y={68} w={140} h={90} rx={10} />
      {[34, 50, 42, 62, 56, 72].map((h, i) => (
        <rect key={i} x={86 + i * 20} y={146 - h} width={11} height={h} rx={3} fill={i === 5 ? P : mix(P, 40)} />
      ))}
      <path d="M80 146h124" stroke={LINE} strokeWidth="1.5" />
      <Card x={220} y={68} w={78} h={90} rx={10} />
      <circle cx={259} cy={113} r={24} fill="none" stroke={G} strokeWidth="10" />
      <circle cx={259} cy={113} r={24} fill="none" stroke={A} strokeWidth="10" strokeDasharray="95 151" transform="rotate(-90 259 113)" />
      <circle cx={259} cy={113} r={24} fill="none" stroke={S} strokeWidth="10" strokeDasharray="30 151" strokeDashoffset="-97" transform="rotate(-90 259 113)" />
    </>
  ),

  mobile: () => (
    <>
      <rect x={122} y={12} width={76} height={156} rx={16} fill={SURF} stroke={G3} strokeWidth="2.5" />
      <rect x={148} y={19} width={24} height={5} rx={2.5} fill={G2} />
      <rect x={131} y={32} width={58} height={38} rx={8} fill={mix(P, 32)} />
      <Bar x={138} y={56} w={30} h={5} fill={SURF} />
      {[80, 98, 116].map((y, i) => (
        <g key={y}>
          <circle cx={138} cy={y + 5} r={5} fill={[S, A, P][i]} />
          <Bar x={148} y={y + 1} w={36} h={4} fill={G2} />
          <Bar x={148} y={y + 7} w={24} h={3} />
        </g>
      ))}
      <path d="M124 146h72" stroke={LINE} strokeWidth="1.5" />
      {[138, 154, 170, 186].map((x, i) => (
        <circle key={x} cx={x} cy={156} r={3.5} fill={i === 0 ? P : G2} />
      ))}
      <circle cx={172} cy={62} r={9} fill={S} opacity="0.3" />
      <circle cx={172} cy={62} r={4} fill={S} opacity="0.6" />
      <Card x={34} y={44} w={74} h={32} rx={10} />
      <circle cx={50} cy={60} r={7} fill={A} />
      <Bar x={62} y={54} w={36} h={5} fill={G2} />
      <Bar x={62} y={63} w={24} h={4} />
      <path d="M108 60h10" stroke={LINE} strokeWidth="1.5" strokeDasharray="2 2" />
      <Card x={212} y={100} w={76} h={30} rx={15} />
      <path d="M232 110.5c-2.5-3-7-1-5 3l5 4.5 5-4.5c2-4-2.5-6-5-3Z" fill={S} />
      <Bar x={244} y={112.5} w={32} h={5} fill={G2} />
      <path d="M198 115h14" stroke={LINE} strokeWidth="1.5" strokeDasharray="2 2" />
      <Sel x={117} y={7} w={86} h={166} rx={19} />
    </>
  ),

  portfolio: () => (
    <>
      <Card x={26} y={20} w={268} h={142} rx={10} />
      <path d="M26 30a10 10 0 0 1 10-10h248a10 10 0 0 1 10 10v8H26Z" fill={G} />
      {[S, A, P].map((c, i) => (
        <circle key={i} cx={38 + i * 9} cy={29} r={2.7} fill={c} />
      ))}
      <rect x={80} y={25} width={140} height={8} rx={4} fill={SURF} />
      <Bar x={40} y={50} w={116} h={12} fill={G3} />
      <Bar x={40} y={68} w={82} h={6} />
      <circle cx={264} cy={60} r={14} fill={mix(A, 40)} />
      <Person x={264} y={56} s={0.62} fill={A} />
      {[P, S, A].map((c, i) => (
        <g key={i}>
          <Card x={40 + i * 84} y={88} w={76} h={62} rx={8} />
          <rect x={44 + i * 84} y={92} width={68} height={32} rx={5} fill={mix(c, 40)} />
          <Bar x={48 + i * 84} y={131} w={46} h={5} fill={G2} />
          <Bar x={48 + i * 84} y={140} w={30} h={4} />
        </g>
      ))}
      <Sel x={36} y={84} w={84} h={70} rx={10} label="Case study" />
    </>
  ),

  resume: () => (
    <>
      <Card x={98} y={14} w={124} h={152} rx={6} />
      <circle cx={118} cy={38} r={10} fill={mix(P, 35)} />
      <Person x={118} y={35} s={0.45} fill={P} />
      <Bar x={134} y={31} w={62} h={7} fill={G3} />
      <Bar x={134} y={43} w={44} h={5} />
      <path d="M108 56h104" stroke={LINE} strokeWidth="1.2" />
      {[
        [66, P],
        [100, S],
        [134, A],
      ].map(([y, c]) => (
        <g key={y as number}>
          <Bar x={108} y={y as number} w={30} h={5} fill={c as string} />
          <Bar x={108} y={(y as number) + 10} w={98} h={4} />
          <Bar x={108} y={(y as number) + 18} w={80} h={4} />
        </g>
      ))}
      <Sel x={104} y={62} w={112} h={28} rx={4} />
      <Check x={216} y={146} r={15} />
      <Card x={22} y={58} w={62} h={58} rx={10} />
      <Label x={32} y={76} size={8}>ATS</Label>
      <Bar x={32} y={86} w={42} h={6} />
      <Bar x={32} y={86} w={34} h={6} fill={A} />
      <Bar x={32} y={100} w={30} h={4} />
      <path d="M84 87h14" stroke={LINE} strokeWidth="1.5" strokeDasharray="2 2" />
    </>
  ),

  linkedin: () => (
    <>
      <Card x={60} y={18} w={200} h={146} rx={12} />
      <path d="M60 30a12 12 0 0 1 12-12h176a12 12 0 0 1 12 12v32H60Z" fill={mix(P, 40)} />
      <path d="M150 62c20-26 60-34 110-26v26Z" fill={mix(S, 45)} />
      <circle cx={100} cy={66} r={23} fill={SURF} />
      <circle cx={100} cy={66} r={19} fill={mix(A, 30)} />
      <Person x={100} y={60} s={0.9} fill={A} />
      <circle cx={100} cy={66} r={21} fill="none" stroke={A} strokeWidth="3.5" strokeDasharray="70 132" transform="rotate(100 100 66)" />
      <Bar x={78} y={98} w={92} h={9} fill={G3} />
      <Bar x={78} y={113} w={150} h={6} fill={G2} />
      <Bar x={78} y={124} w={110} h={5} />
      <Sel x={74} y={109} w={158} h={24} rx={4} />
      <rect x={78} y={140} width={56} height={16} rx={8} fill={P} />
      <rect x={140} y={140} width={56} height={16} rx={8} fill="none" stroke={P} strokeWidth="1.5" />
    </>
  ),

  interview: () => (
    <>
      <Card x={34} y={24} w={90} h={36} rx={12} />
      <path d="M70 60l-6 9 14-9" fill={SURF} stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M66.5 59h13" stroke={SURF} strokeWidth="2.5" />
      <Bar x={46} y={35} w={62} h={5} fill={G2} />
      <Bar x={46} y={45} w={44} h={5} />
      <rect x={194} y={38} width={92} height={32} rx={12} fill={mix(P, 20)} />
      <path d="M244 70l8 9-2-9" fill={mix(P, 20)} />
      {[222, 240, 258].map((x, i) => (
        <circle key={x} cx={x} cy={54} r={4} fill={i === 1 ? P : mix(P, 55)} />
      ))}
      <Sel x={30} y={20} w={98} h={44} rx={14} label="Q&A" />
      <Person x={96} y={98} s={1.6} fill={P} />
      <Person x={228} y={98} s={1.6} fill={S} />
      <rect x={52} y={128} width={216} height={10} rx={5} fill={G2} />
      <path d="M72 138v24M248 138v24" stroke={G2} strokeWidth="4" strokeLinecap="round" />
      <rect x={146} y={112} width={30} height={16} rx={2} fill={SURF} stroke={LINE} strokeWidth="1.5" />
      <rect x={180} y={120} width={20} height={8} rx={1.5} fill={mix(A, 40)} />
    </>
  ),

  networking: () => {
    const nodes = [0, 60, 120, 180, 240, 300].map((d) => {
      const t = (d * Math.PI) / 180
      return [160 + 112 * Math.cos(t), 92 + 54 * Math.sin(t)]
    })
    const cols = [P, S, A, S, A, P]
    return (
      <>
        {nodes.map(([x, y], i) => (
          <path key={`l${i}`} d={`M160 92L${x.toFixed(1)} ${y.toFixed(1)}`} stroke={mix(P, 45)} strokeWidth="1.5" strokeDasharray={i % 2 ? '4 3' : undefined} />
        ))}
        <path d={`M${nodes[0][0]} ${nodes[0][1]}L${nodes[1][0].toFixed(1)} ${nodes[1][1].toFixed(1)}M${nodes[3][0]} ${nodes[3][1]}L${nodes[4][0].toFixed(1)} ${nodes[4][1].toFixed(1)}`} stroke={LINE} strokeWidth="1.5" />
        {nodes.map(([x, y], i) => (
          <g key={`n${i}`}>
            <circle cx={x} cy={y} r={14} fill={mix(cols[i], 22)} stroke={cols[i]} strokeWidth="1.5" />
            <Person x={x} y={y - 4} s={0.5} fill={cols[i]} />
          </g>
        ))}
        <circle cx={160} cy={92} r={22} fill={P} />
        <Person x={160} y={85} s={0.85} fill={SURF} />
        <Sel x={134} y={66} w={52} h={52} rx={8} label="You" />
        <circle cx={nodes[5][0] + 12} cy={nodes[5][1] - 11} r={7} fill={A} />
        <path d={`M${nodes[5][0] + 9} ${nodes[5][1] - 11}h6M${nodes[5][0] + 12} ${nodes[5][1] - 14}v6`} stroke={SURF} strokeWidth="1.6" strokeLinecap="round" />
      </>
    )
  },

  'job-search': () => (
    <>
      {[
        [22, P],
        [68, S],
        [114, A],
      ].map(([y, c], i) => (
        <g key={i}>
          <Card x={34} y={y as number} w={180} h={38} rx={9} />
          <rect x={44} y={(y as number) + 9} width={20} height={20} rx={5} fill={c as string} />
          <Bar x={72} y={(y as number) + 10} w={70} h={6} fill={G2} />
          <Bar x={72} y={(y as number) + 22} w={48} h={5} />
          <rect x={164} y={(y as number) + 13} width={38} height={12} rx={6} fill={mix(A, 30)} />
        </g>
      ))}
      <Sel x={30} y={64} w={188} h={46} rx={11} />
      <Magnifier x={236} y={82} r={28} />
      <Check x={260} y={60} r={9} />
    </>
  ),

  strategy: ({ arrow }) => (
    <>
      <circle cx={80} cy={96} r={48} fill={mix(S, 18)} stroke={S} strokeWidth="1.5" />
      <circle cx={80} cy={96} r={33} fill={SURF} stroke={S} strokeWidth="1.5" />
      <circle cx={80} cy={96} r={19} fill={mix(S, 40)} />
      <circle cx={80} cy={96} r={7} fill={S} />
      <path d="M122 50L84 92" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M122 50l2-10M122 50l10-2" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M156 140C196 140 196 104 226 100S262 62 276 56" fill="none" stroke={P} strokeWidth="2.5" strokeDasharray="6 4" markerEnd={arrow} />
      {[
        [156, 140, A, 'Q1'],
        [226, 100, P, 'Q2'],
      ].map(([x, y, c, t]) => (
        <g key={t as string}>
          <circle cx={x as number} cy={y as number} r={7} fill={SURF} stroke={c as string} strokeWidth="3" />
          <Label x={x as number} y={(y as number) + 20} anchor="middle" size={7.5}>{t as string}</Label>
        </g>
      ))}
      <path d="M284 50V26" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M284 26l-18 5 18 6Z" fill={A} />
      <Sel x={146} y={20} w={154} h={146} rx={10} label="Roadmap" />
    </>
  ),

  'design-system': ({ arrow }) => (
    <>
      <Label x={24} y={18}>Tokens</Label>
      <Card x={22} y={24} w={96} h={134} rx={10} />
      {[P, S, A, INK].map((c, i) => (
        <circle key={i} cx={38 + i * 18} cy={42} r={7} fill={c} />
      ))}
      <text x={32} y={80} fontSize="20" fontWeight="700" fill={INK} fontFamily={HFONT}>Aa</text>
      <Bar x={64} y={66} w={40} h={5} fill={G2} />
      <Bar x={64} y={75} w={28} h={4} />
      <path d="M34 118v-10a10 10 0 0 1 10-10h10" fill="none" stroke={P} strokeWidth="2.5" strokeLinecap="round" />
      {[4, 8, 12, 16].map((w, i) => (
        <rect key={w} x={66 + i * 11} y={146 - w * 2} width={7} height={w * 2} rx={1.5} fill={mix(S, 30 + i * 15)} />
      ))}
      <path d="M124 91h22" stroke={P} strokeWidth="2" markerEnd={arrow} />
      <Card x={156} y={24} w={142} h={134} rx={10} />
      <rect x={168} y={38} width={56} height={20} rx={10} fill={P} />
      <Bar x={180} y={45.5} w={32} h={5} fill={SURF} />
      <Card x={232} y={38} w={54} h={20} rx={6} />
      <Bar x={240} y={45.5} w={28} h={5} />
      <rect x={168} y={72} width={32} height={18} rx={9} fill={A} />
      <circle cx={191} cy={81} r={6.5} fill={SURF} />
      <rect x={232} y={75} width={12} height={12} rx={3} fill={S} />
      <path d="M235 81l2.5 2.5 4-5" fill="none" stroke={SURF} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Bar x={250} y={78.5} w={32} h={5} />
      <Card x={168} y={102} w={118} h={44} rx={8} />
      <rect x={176} y={110} width={28} height={28} rx={6} fill={mix(P, 30)} />
      <Bar x={212} y={114} w={60} h={6} fill={G2} />
      <Bar x={212} y={126} w={44} h={5} />
      <Sel x={156} y={24} w={142} h={134} rx={10} label="Components" />
    </>
  ),

  leadership: () => (
    <>
      <Card x={26} y={24} w={124} h={78} rx={8} />
      {[22, 34, 30, 48].map((h, i) => (
        <rect key={i} x={40 + i * 20} y={90 - h} width={12} height={h} rx={3} fill={i === 3 ? P : mix(P, 40)} />
      ))}
      <path d="M40 60l20-10 20 4 22-18 22-6" fill="none" stroke={S} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 102l-8 22M118 102l8 22" stroke={G2} strokeWidth="3" strokeLinecap="round" />
      <path d="M152 58h22" stroke={LINE} strokeWidth="1.5" strokeDasharray="3 3" />
      <Person x={200} y={50} s={1.35} fill={P} />
      <path d="M216 30l2.2 4.6 5 .6-3.7 3.4 1 5-4.5-2.5-4.5 2.5 1-5-3.7-3.4 5-.6Z" fill={S} />
      <Sel x={176} y={34} w={48} h={50} rx={8} label="Lead" />
      {[
        [130, A],
        [200, S],
        [270, A],
      ].map(([x, c]) => (
        <g key={x as number}>
          <path d={`M200 86L${x} 124`} stroke={mix(P, 45)} strokeWidth="1.5" />
          <circle cx={x as number} cy={142} r={17} fill={mix(c as string, 20)} stroke={c as string} strokeWidth="1.5" />
          <Person x={x as number} y={137} s={0.62} fill={c as string} />
        </g>
      ))}
    </>
  ),

  'career-growth': ({ arrow }) => (
    <>
      {[0, 1, 2, 3].map((i) => {
        const x = 46 + i * 54
        const top = 128 - i * 26
        return (
          <g key={i}>
            <rect x={x} y={top} width={54} height={156 - top} rx={4} fill={mix(P, 18 + i * 20)} stroke={SURF} strokeWidth="1.5" />
            <Label x={x + 27} y={top + 16} anchor="middle" size={8} fill={i > 1 ? SURF : P}>{`L${i + 1}`}</Label>
          </g>
        )
      })}
      <path d="M40 156h234" stroke={G2} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M244 50V16" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M244 16l24 7-24 8Z" fill={S} />
      <Person x={127} y={82} s={0.9} fill={S} />
      <path d="M58 102C92 70 150 48 214 38" fill="none" stroke={A} strokeWidth="2" strokeDasharray="5 4" markerEnd={arrow} />
      <Sel x={206} y={46} w={62} h={114} rx={6} />
      {[
        [284, 64],
        [60, 44],
      ].map(([x, y]) => (
        <path key={x} d={`M${x} ${y - 6}v12M${x - 6} ${y}h12`} stroke={mix(A, 70)} strokeWidth="2" strokeLinecap="round" />
      ))}
    </>
  ),
}

/**
 * Themed topic illustration (static inline SVG, 320×180). Pass `title=""`
 * to render it decoratively (hidden from assistive tech).
 */
export function Illustration({ name, className, title }: { name: IllustrationName; className?: string; title?: string }): JSX.Element {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const dots = `dk-dots-${uid}`
  const arrowId = `dk-arrow-${uid}`
  const label = title ?? ILLUSTRATION_LABELS[name] ?? name
  const decorative = title === ''
  const draw = scenes[name] ?? scenes['ui-vs-ux']
  return (
    <svg
      viewBox="0 0 320 180"
      width="100%"
      className={className}
      style={{ display: 'block', height: 'auto' }}
      xmlns="http://www.w3.org/2000/svg"
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label })}
    >
      <defs>
        <pattern id={dots} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="0.9" fill={LINE} />
        </pattern>
        <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10Z" fill={P} />
        </marker>
      </defs>
      <rect x="1" y="1" width="318" height="178" rx="18" fill={mix(P, 10)} />
      <rect x="1" y="1" width="318" height="178" rx="18" fill={`url(#${dots})`} />
      {draw({ arrow: `url(#${arrowId})` })}
    </svg>
  )
}
