import { defaultNotifications, defaultPromos, defaultReviews } from '../defaults'
import type { Level, SiteContent } from '../types'
import { beginnerFoundations } from './beginnerFoundations'
import { beginnerLaunch } from './beginnerLaunch'
import { expertLeadership, expertStrategy } from './expert'
import { intermediateCraft } from './intermediateCraft'
import { intermediatePractice } from './intermediatePractice'
import { achievements, careerGuides, challenges, resources } from './library'
import { interviewGuides } from './careerInterviews'
import { profileGuides } from './careerProfiles'
import { blogPosts } from './blog'
import { designPosts } from './blogDesign'

const levels: Level[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    headline: "I'm starting my UI/UX journey",
    description: 'Learn the fundamentals, Figma, the UX process and UI design, then build your first projects.',
    recommendedPath: ['UI/UX fundamentals', 'Figma essentials', 'UX process & UI design', 'Four guided projects', 'Portfolio, LinkedIn & first job'],
    icon: 'Sprout',
    color: '#0B7A55',
    enabled: true,
    sequential: true,
    courses: [beginnerFoundations, beginnerLaunch],
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    headline: 'I already know the basics',
    description: 'Sharpen product thinking, research, information architecture, design systems and portfolio quality.',
    recommendedPath: ['Product thinking & research', 'Complex IA and advanced UI', 'Design systems', 'An end-to-end product project', 'Stronger case studies & interviews'],
    icon: 'Rocket',
    color: '#5B4BFF',
    enabled: true,
    sequential: false,
    courses: [intermediateCraft, intermediatePractice],
  },
  {
    id: 'expert',
    name: 'Expert',
    headline: "I'm an experienced designer",
    description: 'Product strategy, systems at scale, design leadership, mentoring and senior career growth.',
    recommendedPath: ['Product & business strategy', 'Enterprise UX and service design', 'Design systems at scale', 'Critique, stakeholders & teams', 'Senior, Lead & Staff paths'],
    icon: 'Crown',
    color: '#C2410C',
    enabled: true,
    sequential: false,
    courses: [expertStrategy, expertLeadership],
  },
]

export const seedContent: SiteContent = {
  schemaVersion: 1,
  brand: {
    name: 'Designer Kid',
    tagline: 'Learn. Design. Build. Grow.',
    logoUrl: '',
    faviconUrl: '',
  },
  theme: {
    mode: 'system',
    light: {
      primary: '#4F3FF0',
      secondary: '#E8590C',
      accent: '#0E9F6E',
      background: '#F5F4EF',
      surface: '#FFFFFF',
      text: '#16171D',
    },
    dark: {
      primary: '#9D94FF',
      secondary: '#FF9E6B',
      accent: '#3DD6A3',
      background: '#0D0E13',
      surface: '#171820',
      text: '#F1F1F4',
    },
    fonts: {
      heading: 'Bricolage Grotesque',
      body: 'Instrument Sans',
      baseSize: 16,
      headingWeight: 700,
      bodyWeight: 400,
      lineHeight: 1.6,
    },
    radius: { base: 12, button: 12, card: 20 },
    shadow: 'soft',
    border: 'subtle',
  },
  home: {
    eyebrow: 'UI/UX learning & career platform',
    heroTitle: 'Become the designer you want to hire.',
    heroDescription:
      'Designer Kid takes you from your first frame in Figma to a portfolio, a resume and interviews — with a learning path that adapts to where you are today.',
    ctaLabel: 'Find my starting point',
    secondaryCtaLabel: 'See the learning paths',
    heroImage: '',
    features: [
      { id: 'f1', title: 'A path made for your level', body: 'Beginner, Intermediate and Expert tracks each have their own roadmap, lessons and projects — never the same content with a new label.', icon: 'Route' },
      { id: 'f2', title: 'Learn → Example → Practice → Challenge', body: 'Every lesson explains why, shows a real example, then asks you to do the work yourself.', icon: 'Layers' },
      { id: 'f3', title: 'Projects and design challenges', body: 'Realistic briefs with constraints and a self-review checklist, so you build work worth showing.', icon: 'Target' },
      { id: 'f4', title: 'Career Centre', body: 'Honest, practical guidance for your portfolio, resume, LinkedIn, job search and interviews.', icon: 'Briefcase' },
      { id: 'f5', title: '1:1 with Harikrishna', body: 'Stuck on your portfolio or preparing for an interview? Book a session when you need a human eye.', icon: 'MessagesSquare' },
      { id: 'f6', title: 'Progress you can see', body: 'Streaks, module progress and achievements that reflect real milestones — not busywork.', icon: 'TrendingUp' },
    ],
    stats: [],
    testimonials: [],
    faq: [
      { id: 'q1', question: 'Do I need any experience to start?', answer: 'No. Choose Beginner and you will start with what UI and UX are, then learn Figma step by step.' },
      { id: 'q2', question: 'Can I change my level later?', answer: 'Yes. You can switch level at any time from your profile or the level switcher. Your progress on every level is kept.' },
      { id: 'q3', question: 'Do I need an account?', answer: 'You can start learning straight away. Create a free account when you want your progress, notes and bookmarks saved across devices.' },
      { id: 'q4', question: 'Will this guarantee me a job?', answer: 'No course can honestly promise that. Designer Kid helps you build real skills, real projects and a clear portfolio — the things hiring teams look for.' },
      { id: 'q5', question: 'How do 1:1 sessions work?', answer: 'Use the “Connect 1:1” button to open the booking page, pick a topic and a time that suits you.' },
    ],
  },
  navigation: [
    { id: 'home', label: 'Home', path: '/', visible: true },
    { id: 'learn', label: 'Learn', path: '/learn', visible: true },
    { id: 'challenges', label: 'Challenges', path: '/challenges', visible: true },
    { id: 'career', label: 'Career', path: '/career', visible: true },
    { id: 'resources', label: 'Resources', path: '/resources', visible: true },
    { id: 'progress', label: 'My Progress', path: '/progress', visible: true },
    { id: 'blog', label: 'Blog', path: '/blog', visible: true },
    { id: 'reviews', label: 'Reviews', path: '/reviews', visible: true },
  ],
  footer: {
    links: [
      { id: 'l1', label: 'Learning paths', url: '/learn' },
      { id: 'l2', label: 'Challenges', url: '/challenges' },
      { id: 'l3', label: 'Career Centre', url: '/career' },
      { id: 'l4', label: 'Resources', url: '/resources' },
    ],
    social: [
      { id: 'social-linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/harikrishnam-raju/' },
      { id: 'social-whatsapp', label: 'WhatsApp', url: 'https://wa.me/919686959787' },
    ],
    copyright: '© 2026 Designer Kid. All rights reserved.',
    email: '',
  },
  mentor: {
    name: 'Harikrishna',
    role: 'Founder, Designer Kid',
    bio: 'Book a one-to-one session for portfolio, resume or LinkedIn reviews, career guidance, Figma help, interview preparation or project feedback.',
    photo: '',
    bookingUrl: 'https://topmate.io/harikrishnam_raju/',
    ctaLabel: 'Request a 1:1 session',
    topics: ['Portfolio review', 'Resume review', 'LinkedIn review', 'Career guidance', 'UI/UX doubts', 'Figma help', 'Interview preparation', 'Project feedback', 'General mentorship'],
    enabled: true,
  },
  reviews: defaultReviews,
  notifications: defaultNotifications,
  levels,
  challenges,
  resources,
  careerGuides: [...careerGuides, ...profileGuides, ...interviewGuides],
  announcements: [
    {
      id: 'ann-welcome',
      title: 'Welcome to Designer Kid',
      body: 'Pick your level, follow the roadmap and use “Continue learning” on your dashboard to always know what to do next.',
      date: '2026-09-01',
      levels: ['all'],
      kind: 'announcement',
      important: false,
      published: true,
    },
  ],
  achievements,
  promos: defaultPromos,
  blog: [...blogPosts, ...designPosts],
}
