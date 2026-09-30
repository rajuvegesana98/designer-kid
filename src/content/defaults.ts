import type { SiteContent } from './types'

/**
 * Small default sections, kept apart from the large seed so the live site can
 * backfill settings added after the content was last published without
 * downloading the whole starter content.
 */
export const defaultReviews: SiteContent['reviews'] = {
    enabled: true,
    requireApproval: true,
    showOnHome: true,
    title: 'What learners say about Harikrishna',
    prompt: 'Had a session with Harikrishna or learned with Designer Kid? Share an honest review to help other learners.',
  }

export const defaultNotifications: SiteContent['notifications'] = {
    newLesson: true,
    newChallenge: true,
    courseCompletion: true,
    announcements: true,
    careerUpdates: true,
  }

export const defaultPromos: SiteContent['promos'] = [
    {
      id: 'promo-welcome',
      enabled: false,
      style: 'popup',
      title: 'Free portfolio review week',
      message: 'Book a 1:1 this week and get honest, practical feedback on one case study.',
      ctaLabel: 'Book a session',
      ctaUrl: '/career/portfolio',
      image: '',
      illustration: 'portfolio',
      tone: 'primary',
      startsAt: '',
      endsAt: '',
      audience: 'everyone',
      pages: 'all',
      dismissible: true,
      version: 1,
    },
  ]
