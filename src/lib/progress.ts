import type { Achievement, CareerSection, Level, Module, SiteContent } from '../content/types'
import type { LearnerState } from '../data/types'
import { guidesFor, levelLessons, levelModules, type LessonRef } from './content'

export function today(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function emptyLearner(): LearnerState {
  return {
    name: '',
    level: null,
    completedLessons: {},
    completedChallenges: {},
    careerChecks: {},
    bookmarks: [],
    notes: {},
    activeDays: [],
    challengeWork: {},
    updatedAt: new Date().toISOString(),
  }
}

export function moduleProgress(module: Module, state: LearnerState) {
  const total = module.lessons.length
  const done = module.lessons.filter((l) => state.completedLessons[l.id]).length
  return { done, total, pct: total ? done / total : 0, complete: total > 0 && done === total }
}

export function levelProgress(level: Level, state: LearnerState) {
  const lessons = levelLessons(level)
  const done = lessons.filter((r) => state.completedLessons[r.lesson.id]).length
  const modules = levelModules(level)
  const modulesDone = modules.filter((m) => moduleProgress(m, state).complete).length
  const projectLessons = modules.filter((m) => m.kind === 'project').flatMap((m) => m.lessons)
  return {
    done,
    total: lessons.length,
    pct: lessons.length ? done / lessons.length : 0,
    modulesDone,
    modulesTotal: modules.length,
    projectsDone: projectLessons.filter((l) => state.completedLessons[l.id]).length,
    projectsTotal: projectLessons.length,
    coursesDone: level.courses.filter((c) => c.modules.every((m) => moduleProgress(m, state).complete)).length,
    coursesTotal: level.courses.length,
  }
}

/**
 * All content is always open. When a level has "suggested order" switched on,
 * this returns the previous unfinished module as a gentle recommendation —
 * it never blocks access (`locked` is always false).
 */
export function moduleLock(level: Level, moduleId: string, state: LearnerState): { locked: false; suggestedAfter?: Module } {
  if (!level.sequential) return { locked: false }
  const modules = levelModules(level)
  const i = modules.findIndex((m) => m.id === moduleId)
  if (i <= 0) return { locked: false }
  const prev = modules[i - 1]
  return moduleProgress(prev, state).complete ? { locked: false } : { locked: false, suggestedAfter: prev }
}

/** The single most useful next lesson: resume the last one, otherwise the first incomplete unlocked lesson. */
export function nextLesson(level: Level, state: LearnerState): LessonRef | undefined {
  const lessons = levelLessons(level)
  const last = state.lastLesson && lessons.find((r) => r.lesson.id === state.lastLesson!.id)
  if (last && !state.completedLessons[last.lesson.id]) return last
  return lessons.find((r) => !state.completedLessons[r.lesson.id] && !moduleLock(level, r.module.id, state).locked)
}

export function streak(state: LearnerState, now = new Date()): number {
  const days = new Set(state.activeDays)
  const cursor = new Date(now)
  // A streak survives until the end of the day after the last active day.
  if (!days.has(today(cursor))) cursor.setDate(cursor.getDate() - 1)
  let count = 0
  while (days.has(today(cursor))) {
    count++
    cursor.setDate(cursor.getDate() - 1)
  }
  return count
}

export function careerSectionProgress(content: SiteContent, section: CareerSection, state: LearnerState) {
  const guides = guidesFor(content, section, state.level)
  let total = 0
  let done = 0
  for (const g of guides)
    g.checklist.forEach((_, i) => {
      total++
      if (state.careerChecks[`${g.id}:${i}`]) done++
    })
  return { done, total, pct: total ? done / total : 0, complete: total > 0 && done === total }
}

export function achievementUnlocked(a: Achievement, content: SiteContent, state: LearnerState): boolean {
  const rule = a.rule
  switch (rule.type) {
    case 'lessons':
      return Object.keys(state.completedLessons).length >= rule.count
    case 'challenges':
      return Object.keys(state.completedChallenges).length >= rule.count
    case 'streak':
      return longestStreak(state) >= rule.days
    case 'projects': {
      const projectIds = content.levels.flatMap((l) => levelModules(l).filter((m) => m.kind === 'project').flatMap((m) => m.lessons.map((x) => x.id)))
      return projectIds.filter((id) => state.completedLessons[id]).length >= rule.count
    }
    case 'module': {
      for (const level of content.levels) {
        const m = levelModules(level).find((mm) => mm.id === rule.moduleId)
        if (m) return moduleProgress(m, state).complete
      }
      return false
    }
    case 'career-section':
      return careerSectionProgress(content, rule.section, state).complete
  }
}

export function longestStreak(state: LearnerState): number {
  const sorted = [...new Set(state.activeDays)].sort()
  let best = 0
  let run = 0
  let prev: Date | null = null
  for (const d of sorted) {
    const cur = new Date(d + 'T12:00:00')
    run = prev && Math.round((cur.getTime() - prev.getTime()) / 86_400_000) === 1 ? run + 1 : 1
    best = Math.max(best, run)
    prev = cur
  }
  return best
}

/** Merge two learner states (e.g. guest progress into a freshly signed-in account). */
export function mergeLearner(a: LearnerState, b: LearnerState): LearnerState {
  const pickNewer = <T extends { updatedAt: string }>(x?: T, y?: T) => (!x ? y : !y ? x : x.updatedAt >= y.updatedAt ? x : y)
  const notes: LearnerState['notes'] = { ...a.notes }
  for (const [k, v] of Object.entries(b.notes)) notes[k] = pickNewer(notes[k], v)!
  const work: LearnerState['challengeWork'] = { ...a.challengeWork }
  for (const [k, v] of Object.entries(b.challengeWork)) work[k] = pickNewer(work[k], v)!
  const bookmarks = [...a.bookmarks]
  for (const bm of b.bookmarks) if (!bookmarks.some((x) => x.kind === bm.kind && x.id === bm.id)) bookmarks.push(bm)
  const newer = a.updatedAt >= b.updatedAt ? a : b
  return {
    ...newer,
    name: a.name || b.name,
    level: newer.level ?? a.level ?? b.level,
    completedLessons: { ...b.completedLessons, ...a.completedLessons },
    completedChallenges: { ...b.completedChallenges, ...a.completedChallenges },
    careerChecks: { ...b.careerChecks, ...a.careerChecks },
    bookmarks,
    notes,
    challengeWork: work,
    activeDays: [...new Set([...a.activeDays, ...b.activeDays])].sort(),
    updatedAt: new Date().toISOString(),
  }
}
