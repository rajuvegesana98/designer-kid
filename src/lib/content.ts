import type { CareerGuide, CareerSection, Course, Lesson, Level, LevelId, LevelScope, Module, SiteContent } from '../content/types'

export interface LessonRef {
  level: Level
  course: Course
  module: Module
  lesson: Lesson
  /** Position within the level's ordered lesson list. */
  index: number
}

/** Removes everything an admin has unpublished, so students only ever see live content. */
export function studentView(content: SiteContent): SiteContent {
  return {
    ...content,
    levels: content.levels
      .filter((l) => l.enabled)
      .map((l) => ({
        ...l,
        courses: l.courses
          .filter((c) => c.published)
          .map((c) => ({
            ...c,
            modules: c.modules
              .filter((m) => m.published)
              .map((m) => ({ ...m, lessons: m.lessons.filter((x) => x.published) }))
              .filter((m) => m.lessons.length > 0),
          }))
          .filter((c) => c.modules.length > 0),
      })),
    challenges: content.challenges.filter((c) => c.published),
    resources: content.resources.filter((r) => r.published),
    careerGuides: content.careerGuides.filter((g) => g.published),
    announcements: content.announcements.filter((a) => a.published),
    blog: (content.blog ?? []).filter((b) => b.published),
    promos: (content.promos ?? []).filter((p) => p.enabled),
    navigation: content.navigation.filter((n) => n.visible),
  }
}

export function getLevel(content: SiteContent, id: LevelId | null | undefined): Level | undefined {
  return content.levels.find((l) => l.id === id)
}

export function levelModules(level: Level): (Module & { courseId: string; courseTitle: string })[] {
  return level.courses.flatMap((c) => c.modules.map((m) => ({ ...m, courseId: c.id, courseTitle: c.title })))
}

export function levelLessons(level: Level): LessonRef[] {
  const out: LessonRef[] = []
  for (const course of level.courses)
    for (const module of course.modules)
      for (const lesson of module.lessons) out.push({ level, course, module, lesson, index: out.length })
  return out
}

export function findLesson(content: SiteContent, lessonId: string): LessonRef | undefined {
  for (const level of content.levels) {
    const found = levelLessons(level).find((r) => r.lesson.id === lessonId)
    if (found) return found
  }
  return undefined
}

export function findModule(content: SiteContent, moduleId: string) {
  for (const level of content.levels)
    for (const course of level.courses) {
      const module = course.modules.find((m) => m.id === moduleId)
      if (module) return { level, course, module }
    }
  return undefined
}

export function inScope(scope: LevelScope, level: LevelId | null | undefined) {
  return scope === 'all' || !level || scope === level
}

export function guidesFor(content: SiteContent, section: CareerSection, level: LevelId | null | undefined): CareerGuide[] {
  const guides = content.careerGuides.filter((g) => g.section === section)
  const matching = guides.filter((g) => g.level === level || g.level === 'all')
  return matching.length ? matching : guides
}

export const CAREER_SECTIONS: { id: CareerSection; title: string; icon: string; blurb: string }[] = [
  { id: 'resume', title: 'Resume', icon: 'FileText', blurb: 'Structure, honest bullet points and a final checklist.' },
  { id: 'linkedin', title: 'LinkedIn', icon: 'IdCard', blurb: 'Set up each profile section and plan what to post.' },
  { id: 'portfolio', title: 'Portfolio', icon: 'LayoutTemplate', blurb: 'Homepage, case studies, about and contact — with templates.' },
  { id: 'job-search', title: 'Job Search', icon: 'Search', blurb: 'Where to look, how to apply and how to track it.' },
  { id: 'interviews', title: 'Interview Prep', icon: 'MessagesSquare', blurb: 'Portfolio walkthroughs, app critiques and design exercises.' },
  { id: 'networking', title: 'Networking', icon: 'Users', blurb: 'Build real relationships without feeling salesy.' },
]
