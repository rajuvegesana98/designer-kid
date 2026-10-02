import { motion } from 'motion/react'
import { ArrowRight, BookOpen, Flame, Gamepad2, Shield, Star, Swords, Trophy, Zap } from 'lucide-react'
import { useMemo, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { ProgressBar } from '../components/ui'
import { getLevel, levelLessons, levelModules } from '../lib/content'
import { nextLesson, streak } from '../lib/progress'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'

// XP values
const XP_PER_LESSON = 50
const XP_PER_MODULE = 100
const RANK_THRESHOLDS = [
  { name: 'Apprentice', min: 0,    icon: Shield, color: '#6b7280' },
  { name: 'Journeyman', min: 500,  icon: BookOpen, color: '#0B7A55' },
  { name: 'Designer',   min: 1500, icon: Star,    color: '#5B4BFF' },
  { name: 'Artisan',    min: 3000, icon: Swords,  color: '#C2410C' },
  { name: 'Lead',       min: 6000, icon: Trophy,  color: '#b45309' },
]

function getRank(xp: number) {
  let rank = RANK_THRESHOLDS[0]!
  for (const r of RANK_THRESHOLDS) {
    if (xp >= r.min) rank = r
  }
  const idx = RANK_THRESHOLDS.indexOf(rank)
  const next = RANK_THRESHOLDS[idx + 1]
  const progressToNext = next ? Math.round(((xp - rank.min) / (next.min - rank.min)) * 100) : 100
  return { rank, next, progressToNext }
}

function makeQuests(level: ReturnType<typeof getLevel>, state: ReturnType<typeof useLearner>['state'], content: ReturnType<typeof useContent>['content']) {
  if (!level) return []
  const modules = levelModules(level)
  const quests = []

  // Quest 1: complete next lesson
  const next = nextLesson(level, state)
  if (next) {
    quests.push({
      id: 'next-lesson',
      title: `Complete: ${next.lesson.title}`,
      description: next.module.title,
      xp: XP_PER_LESSON,
      done: !!state.completedLessons[next.lesson.id],
      href: `/learn/${level.id}/${next.module.id}/${next.lesson.id}`,
      icon: BookOpen,
    })
  }

  // Quest 2: finish a module if close
  const inProgressModule = modules.find((m) => {
    const done = m.lessons.filter((l) => state.completedLessons[l.id]).length
    return done > 0 && done < m.lessons.length
  })
  if (inProgressModule) {
    const done = inProgressModule.lessons.filter((l) => state.completedLessons[l.id]).length
    quests.push({
      id: `module-${inProgressModule.id}`,
      title: `Finish module: ${inProgressModule.title}`,
      description: `${done}/${inProgressModule.lessons.length} lessons done`,
      xp: XP_PER_MODULE,
      done: false,
      href: `/learn/${level.id}/${inProgressModule.id}`,
      icon: Zap,
    })
  }

  // Quest 3: keep streak alive
  const days = streak(state)
  quests.push({
    id: 'streak',
    title: days > 0 ? `Keep your ${days}-day streak alive` : 'Start a learning streak',
    description: 'Learn something today to extend your streak',
    xp: 25,
    done: state.activeDays.includes(new Date().toISOString().slice(0, 10)),
    href: `/learn`,
    icon: Flame,
  })

  // Quest 4: open challenge
  const challenge = content.challenges.find((c) => c.level === level.id && !state.completedChallenges[c.id])
  if (challenge) {
    quests.push({
      id: `challenge-${challenge.id}`,
      title: `Challenge: ${challenge.title}`,
      description: 'Design challenge — earn bonus XP',
      xp: 200,
      done: false,
      href: `/challenges/${challenge.id}`,
      icon: Swords,
    })
  }

  return quests.slice(0, 4)
}

export function GameDashboard() {
  const { content } = useContent()
  const { state } = useLearner()
  const level = getLevel(content, state.level)!
  const allLessons = useMemo(() => levelLessons(level), [level])
  const completedCount = allLessons.filter((r) => state.completedLessons[r.lesson.id]).length
  const modules = levelModules(level)
  const completedModules = modules.filter((m) => m.lessons.every((l) => state.completedLessons[l.id])).length

  const xp = completedCount * XP_PER_LESSON + completedModules * XP_PER_MODULE
  const { rank, next: nextRank, progressToNext } = getRank(xp)
  const RankIcon = rank.icon
  const days = streak(state)
  const quests = useMemo(() => makeQuests(level, state, content), [level, state, content])

  const greeting = () => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  }

  return (
    <div className="page game-dashboard" style={{ '--c-level': level.color } as CSSProperties}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-header"
        style={{ marginBottom: 'var(--space-6)' }}
      >
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <div className="game-icon-wrap" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            <Gamepad2 size={24} style={{ color: '#fff' }} />
          </div>
          <div>
            <div className="muted small">{greeting()}{state.name ? `, ${state.name}` : ''}</div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Game Mode</h1>
          </div>
        </div>
        <Link to="/start" className="btn btn-ghost btn-sm">Switch mode</Link>
      </motion.header>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 'var(--space-6)' }}>
        {/* XP */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }} className="card card-tight game-stat-card" style={{ borderColor: '#7c3aed33' }}>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <Zap size={18} style={{ color: '#7c3aed' }} />
            <span className="subtle small">Total XP</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: '#7c3aed' }}>{xp}</div>
        </motion.div>

        {/* Rank */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="card card-tight game-stat-card" style={{ borderColor: `${rank.color}33` }}>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <RankIcon size={18} style={{ color: rank.color }} />
            <span className="subtle small">Rank</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: rank.color }}>{rank.name}</div>
          {nextRank && (
            <div style={{ marginTop: 6 }}>
              <ProgressBar value={progressToNext} label={`${progressToNext}% to ${nextRank.name}`} thin />
            </div>
          )}
        </motion.div>

        {/* Streak */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} className="card card-tight game-stat-card" style={{ borderColor: days > 0 ? '#f97316' : undefined }}>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <Flame size={18} style={{ color: days > 0 ? '#f97316' : 'var(--c-muted)' }} />
            <span className="subtle small">Streak</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: days > 0 ? '#f97316' : 'var(--c-muted)' }}>{days}</div>
          <div className="subtle small" style={{ marginTop: 4 }}>day{days !== 1 ? 's' : ''}</div>
        </motion.div>

        {/* Lessons */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} className="card card-tight game-stat-card" style={{ borderColor: `${level.color}33` }}>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <BookOpen size={18} style={{ color: level.color }} />
            <span className="subtle small">Lessons</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: level.color }}>{completedCount}</div>
          <div className="subtle small" style={{ marginTop: 4 }}>of {allLessons.length}</div>
        </motion.div>
      </div>

      {/* Daily Quests */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }} style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 'var(--space-4)' }}>Daily Quests</h2>
        <div className="stack" style={{ '--gap': '12px' } as CSSProperties}>
          {quests.map((q, i) => {
            const QIcon = q.icon
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.25 + i * 0.06 } }}
                className={`card card-tight row-between quest-card ${q.done ? 'quest-done' : ''}`}
                style={{ opacity: q.done ? 0.6 : 1 }}
              >
                <div className="row" style={{ gap: 14, flex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: q.done ? 'var(--c-surface-2)' : 'rgba(124,58,237,0.12)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <QIcon size={20} style={{ color: q.done ? 'var(--c-muted)' : '#7c3aed' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', textDecoration: q.done ? 'line-through' : 'none' }}>{q.title}</div>
                    <div className="muted small">{q.description}</div>
                  </div>
                </div>
                <div className="row" style={{ gap: 10, flexShrink: 0 }}>
                  <span className="badge" style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed', fontWeight: 700 }}>+{q.xp} XP</span>
                  {!q.done && (
                    <Link to={q.href} className="btn btn-ghost btn-sm btn-icon" aria-label={`Go to ${q.title}`}>
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* XP per lesson note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} className="card card-tight tinted" style={{ textAlign: 'center' }}>
        <p className="muted small" style={{ margin: 0 }}>
          Earn <strong style={{ color: '#7c3aed' }}>{XP_PER_LESSON} XP</strong> per lesson · <strong style={{ color: '#7c3aed' }}>{XP_PER_MODULE} XP</strong> per module · <strong style={{ color: '#f97316' }}>Streak bonus</strong> on daily activity
        </p>
      </motion.div>
    </div>
  )
}
