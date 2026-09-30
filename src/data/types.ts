import type { LevelId, SiteContent } from '../content/types'

export type BookmarkKind = 'lesson' | 'challenge' | 'resource' | 'guide'

export interface ChallengeWork {
  link: string
  notes: string
  checks: boolean[]
  submittedAt?: string
  updatedAt: string
}

/** Everything we know about one learner. Stored per user as a single JSON document. */
export interface LearnerState {
  name: string
  level: LevelId | null
  completedLessons: Record<string, string>
  completedChallenges: Record<string, string>
  /** `${guideId}:${itemIndex}` → checked */
  careerChecks: Record<string, boolean>
  bookmarks: { kind: BookmarkKind; id: string; at: string }[]
  notes: Record<string, { text: string; updatedAt: string }>
  /** Local calendar days (YYYY-MM-DD) with learning activity — drives the streak. */
  activeDays: string[]
  lastLesson?: { id: string; at: string }
  challengeWork: Record<string, ChallengeWork>
  notificationsSeenAt?: string
  updatedAt: string
}

export interface AppUser {
  id: string
  email: string
  name: string
  isAdmin: boolean
  /** Suspended by an admin. */
  blocked?: boolean
}

export interface LearnerRow {
  id: string
  name: string
  email: string
  level: LevelId | null
  state: LearnerState
  createdAt: string
  lastActiveAt: string
  blocked: boolean
  isAdmin: boolean
}

export interface ContentVersion {
  id: string
  note: string
  createdAt: string
  author: string
}

export type EventType =
  | 'signup'
  | 'level_selected'
  | 'lesson_completed'
  | 'module_completed'
  | 'challenge_submitted'
  | 'booking_clicked'
  | 'content_published'

export interface ActivityEvent {
  id: string
  type: EventType
  detail: string
  userName: string
  createdAt: string
}

export interface Submission {
  id: string
  userId: string
  userName: string
  challengeId: string
  link: string
  notes: string
  createdAt: string
}

export interface MediaItem {
  id: string
  name: string
  url: string
  size: number
  mimeType: string
  folder: string
  createdAt: string
}

export type ReviewStatus = 'pending' | 'approved' | 'hidden'

export interface Review {
  id: string
  userId: string | null
  name: string
  role: string
  rating: number
  text: string
  status: ReviewStatus
  featured: boolean
  reply: string
  createdAt: string
}

export type NewReview = Pick<Review, 'name' | 'role' | 'rating' | 'text'>

export type SignUpResult = { user: AppUser } | { needsConfirmation: true }

export interface DataStore {
  mode: 'local' | 'supabase'

  currentUser(): Promise<AppUser | null>
  onAuthChange(cb: (user: AppUser | null, event?: string) => void): () => void
  signUp(name: string, email: string, password: string): Promise<SignUpResult>
  signIn(email: string, password: string): Promise<AppUser>
  signOut(): Promise<void>
  /** Emails a password-reset link. */
  requestPasswordReset(email: string): Promise<void>
  /** Sets a new password for the signed-in user (also used after a reset link). */
  updatePassword(password: string): Promise<void>
  /** Local mode only: open the admin panel for this browser. */
  enterDemoAdmin?(): Promise<AppUser>

  loadPublished(): Promise<SiteContent | null>
  loadDraft(): Promise<{ content: SiteContent; updatedAt: string } | null>
  saveDraft(content: SiteContent): Promise<string>
  publish(content: SiteContent, note: string): Promise<void>
  listVersions(): Promise<ContentVersion[]>
  loadVersion(id: string): Promise<SiteContent>

  loadLearner(userId: string): Promise<LearnerState | null>
  saveLearner(userId: string, state: LearnerState): Promise<void>

  track(type: EventType, detail: string, user?: { id: string; name: string } | null): Promise<void>
  submitChallenge(user: AppUser, challengeId: string, link: string, notes: string): Promise<void>

  listLearners(): Promise<LearnerRow[]>
  /** Admin: edit a learner's name, level or suspension. */
  updateLearnerProfile(id: string, patch: { name?: string; level?: LevelId | null; blocked?: boolean }): Promise<void>
  resetLearnerProgress(id: string): Promise<void>
  setAdmin(id: string, admin: boolean): Promise<void>
  listEvents(limit: number): Promise<ActivityEvent[]>
  listSubmissions(): Promise<Submission[]>

  /** Public: approved reviews. Admin (all = true): every review. */
  listReviews(all?: boolean): Promise<Review[]>
  submitReview(review: NewReview, user: AppUser | null, autoApprove: boolean): Promise<Review>
  updateReview(id: string, patch: Partial<Pick<Review, 'status' | 'featured' | 'reply'>>): Promise<void>
  deleteReview(id: string): Promise<void>

  listMedia(): Promise<MediaItem[]>
  uploadMedia(file: File, folder: string): Promise<MediaItem>
  replaceMedia(item: MediaItem, file: File): Promise<MediaItem>
  deleteMedia(item: MediaItem): Promise<void>
}
