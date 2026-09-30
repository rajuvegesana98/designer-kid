/**
 * Designer Kid content model.
 *
 * Everything a student sees is described by one `SiteContent` document.
 * The admin dashboard edits a draft copy of it, previews it, and publishes it.
 * Hierarchy: Level → Course → Module → Lesson. Challenges, resources and
 * career guides are flat collections tagged with a level.
 */

export type LevelId = 'beginner' | 'intermediate' | 'expert'
/** Content that applies to every level uses 'all'. */
export type LevelScope = LevelId | 'all'
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Advanced'

/** Built-in interactive widgets a lesson can embed. */
export type WidgetName =
  | 'contrast-checker'
  | 'spacing-scale'
  | 'type-scale'
  | 'visual-hierarchy'
  | 'auto-layout'
  | 'grid-playground'
  | 'button-states'

/** Themed Designer Kid illustrations (see src/components/illustrationLibrary.tsx). */
export type IllustrationName =
  | 'ui-vs-ux'
  | 'design-process'
  | 'visual-hierarchy'
  | 'layout-grid'
  | 'spacing'
  | 'typography'
  | 'colour'
  | 'accessibility'
  | 'figma'
  | 'components'
  | 'prototype'
  | 'research'
  | 'persona'
  | 'user-flow'
  | 'wireframe'
  | 'usability-test'
  | 'dashboard'
  | 'mobile'
  | 'portfolio'
  | 'resume'
  | 'linkedin'
  | 'interview'
  | 'networking'
  | 'job-search'
  | 'strategy'
  | 'design-system'
  | 'leadership'
  | 'career-growth'

/** An uploaded document (PDF, PowerPoint…) attached to content. */
export interface FileAsset {
  url: string
  name: string
  mimeType: string
  size?: number
}

/**
 * A lesson is composed of blocks. Text supports a tiny markdown subset:
 * **bold**, *italic*, `code`, [links](https://…) and blank-line paragraphs.
 */
export type Block =
  | { type: 'text'; body: string }
  | { type: 'heading'; text: string }
  | { type: 'callout'; tone: 'tip' | 'why' | 'warning'; title?: string; body: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'doDont'; do: string[]; dont: string[] }
  | { type: 'checklist'; title?: string; items: string[] }
  | { type: 'example'; title: string; body: string; before?: string; after?: string }
  | { type: 'quiz'; question: string; options: string[]; answer: number; explanation: string }
  | { type: 'interactive'; widget: WidgetName; caption?: string }
  | { type: 'image'; url: string; alt: string; caption?: string }
  | { type: 'video'; url: string; title: string }
  | { type: 'link'; url: string; title: string; description?: string }
  | { type: 'illustration'; name: IllustrationName; caption?: string }
  | { type: 'qa'; title?: string; items: { question: string; answer: string; tip?: string }[] }
  | { type: 'file'; file: FileAsset; title?: string; display: 'embed' | 'download' }

export interface Lesson {
  id: string
  title: string
  summary: string
  minutes: number
  difficulty: Difficulty
  published: boolean
  /** Cover illustration; when empty one is chosen from the lesson topic. */
  cover?: IllustrationName
  /** Downloadable files (PDF, slides, templates) shown with the lesson. */
  attachments?: FileAsset[]
  /** ISO date; used for "new lesson" notifications. */
  addedAt?: string
  /** Learn → Example → Practice → Challenge */
  learn: Block[]
  example: Block[]
  practice: { task: string; steps: string[]; deliverable: string }
  challenge: { task: string; successCriteria: string[] }
}

export interface Module {
  id: string
  title: string
  /** Short label shown on the roadmap (e.g. "Figma"). */
  stage: string
  summary: string
  /** Why this module matters — shown before starting. */
  outcome: string
  /** A project module counts towards "projects completed". */
  kind: 'lessons' | 'project'
  published: boolean
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  published: boolean
  modules: Module[]
}

export interface Level {
  id: LevelId
  name: string
  /** First-person card title, e.g. "I'm starting my UI/UX journey". */
  headline: string
  description: string
  /** Bullet points shown on the onboarding card ("Recommended path"). */
  recommendedPath: string[]
  /** lucide icon name, e.g. "Sprout", "Rocket", "Crown". */
  icon: string
  /** Hex colour used for the level accent. */
  color: string
  enabled: boolean
  /** When true, students see a gentle "suggested after" hint. Content is never locked. */
  sequential: boolean
  courses: Course[]
}

export type ChallengeCategory =
  | 'UI'
  | 'UX'
  | 'Figma'
  | 'UX research'
  | 'Design system'
  | 'Product thinking'
  | 'Portfolio'

export interface Challenge {
  id: string
  level: LevelId
  category: ChallengeCategory
  title: string
  brief: string
  context: string
  requirements: string[]
  constraints: string[]
  expectedOutcome: string
  difficulty: Difficulty
  minutes: number
  checklist: string[]
  published: boolean
  addedAt?: string
}

export type ResourceType = 'Article' | 'Tool' | 'Template' | 'Video' | 'Book' | 'Community' | 'Course'

export interface Resource {
  id: string
  level: LevelScope
  type: ResourceType
  title: string
  description: string
  url: string
  published: boolean
}

export type CareerSection = 'resume' | 'linkedin' | 'portfolio' | 'interviews' | 'job-search' | 'networking'

export interface CareerGuide {
  id: string
  section: CareerSection
  level: LevelScope
  title: string
  summary: string
  minutes: number
  blocks: Block[]
  /** Checklist items feed the Career Centre progress for this section. */
  checklist: string[]
  published: boolean
  cover?: IllustrationName
  attachments?: FileAsset[]
}

export interface Announcement {
  id: string
  title: string
  body: string
  date: string
  levels: LevelScope[]
  kind: 'announcement' | 'career' | 'new-content'
  important: boolean
  published: boolean
}

export type AchievementRule =
  | { type: 'lessons'; count: number }
  | { type: 'module'; moduleId: string }
  | { type: 'challenges'; count: number }
  | { type: 'projects'; count: number }
  | { type: 'streak'; days: number }
  | { type: 'career-section'; section: CareerSection }

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rule: AchievementRule
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
}

export interface Theme {
  mode: 'light' | 'dark' | 'system'
  light: ThemeColors
  dark: ThemeColors
  fonts: {
    heading: string
    body: string
    baseSize: number
    headingWeight: number
    bodyWeight: number
    lineHeight: number
  }
  radius: { base: number; button: number; card: number }
  shadow: 'none' | 'soft' | 'medium' | 'strong'
  border: 'none' | 'subtle' | 'strong'
}

export interface NavItem {
  id: string
  label: string
  path: string
  visible: boolean
}

export interface FooterLink {
  id: string
  label: string
  url: string
}

export interface SiteContent {
  schemaVersion: 1
  brand: { name: string; tagline: string; logoUrl: string; faviconUrl: string }
  theme: Theme
  home: {
    eyebrow: string
    heroTitle: string
    heroDescription: string
    ctaLabel: string
    secondaryCtaLabel: string
    heroImage: string
    features: { id: string; title: string; body: string; icon: string }[]
    /** Leave empty until you have real numbers — never invent them. */
    stats: { id: string; label: string; value: string }[]
    /** Leave empty until you have real, permitted quotes. */
    testimonials: { id: string; quote: string; name: string; role: string; photo: string }[]
    faq: { id: string; question: string; answer: string }[]
  }
  navigation: NavItem[]
  footer: {
    links: FooterLink[]
    social: FooterLink[]
    copyright: string
    email: string
  }
  mentor: {
    name: string
    role: string
    bio: string
    photo: string
    /** External booking tool (Calendly, Cal.com, Topmate…). */
    bookingUrl: string
    ctaLabel: string
    topics: string[]
    enabled: boolean
  }
  reviews: {
    enabled: boolean
    /** New reviews stay hidden until an admin approves them. */
    requireApproval: boolean
    showOnHome: boolean
    title: string
    prompt: string
  }
  notifications: {
    newLesson: boolean
    newChallenge: boolean
    courseCompletion: boolean
    announcements: boolean
    careerUpdates: boolean
  }
  levels: Level[]
  challenges: Challenge[]
  resources: Resource[]
  careerGuides: CareerGuide[]
  announcements: Announcement[]
  achievements: Achievement[]
}
