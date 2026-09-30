import { motion } from 'motion/react'
import {
  BookOpen, Briefcase, ChevronRight, ExternalLink, Home, Library, Link2, LogIn, Menu, MessagesSquare, Newspaper, Moon, Search, Settings2, Star, Sun, Target, TrendingUp, UserRound,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import type { NavItem } from '../content/types'
import { store } from '../data'
import { getLevel } from '../lib/content'
import { Icon } from '../lib/icons'
import { useAuth } from '../state/auth'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { useColorMode } from '../state/ui'
import { Brand } from './Brand'
import { LevelSwitcher } from './LevelSwitcher'
import { MentorLink, useMentor } from './MentorLink'
import { NotificationsButton } from './Notifications'
import { SearchPalette } from './Search'
import { Sheet } from './ui'

const NAV_ICONS: Record<string, LucideIcon> = {
  home: Home,
  learn: BookOpen,
  challenges: Target,
  career: Briefcase,
  resources: Library,
  progress: TrendingUp,
  reviews: Star,
  blog: Newspaper,
}

function isExternal(path: string) {
  return /^https?:\/\//.test(path)
}

function NavEntry({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const IconCmp = NAV_ICONS[item.id] ?? Link2
  if (isExternal(item.path))
    return (
      <a className="nav-link" href={item.path} target="_blank" rel="noreferrer" onClick={onNavigate}>
        <IconCmp size={20} aria-hidden />
        {item.label}
        <ExternalLink size={14} aria-hidden className="nav-sub" />
      </a>
    )
  return (
    <NavLink to={item.path} end={item.path === '/'} className="nav-link" onClick={onNavigate}>
      {({ isActive }) => (
        <>
          {isActive && <motion.span className="nav-pill" layoutId="nav-pill" />}
          <IconCmp size={20} aria-hidden />
          {item.label}
        </>
      )}
    </NavLink>
  )
}

function ModeToggle() {
  const { resolved, setPref } = useColorMode()
  const next = resolved === 'dark' ? 'light' : 'dark'
  return (
    <button className="btn btn-ghost btn-icon" onClick={() => setPref(next)} aria-label={`Switch to ${next} mode`}>
      <motion.span key={resolved} initial={{ rotate: -40, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} style={{ display: 'grid' }}>
        {resolved === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </motion.span>
    </button>
  )
}

function Avatar() {
  const { user } = useAuth()
  const { state } = useLearner()
  const name = state.name || user?.name || ''
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('')
  return (
    <Link to="/profile" className="btn btn-ghost btn-icon" aria-label="Profile and settings" style={{ padding: 0 }}>
      <span className="avatar">{initials || <UserRound size={18} aria-hidden />}</span>
    </Link>
  )
}

export function AppShell({ children }: { children?: React.ReactNode }) {
  const { content, isPreview } = useContent()
  const { state } = useLearner()
  const { user } = useAuth()
  const mentor = useMentor()
  const [searchOpen, setSearchOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [levelOpen, setLevelOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const level = getLevel(content, state.level)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
      if (e.key === '/' && !(e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setMoreOpen(false)
  }, [location.pathname])

  const nav = content.navigation
  const primary = ['home', 'learn', 'challenges', 'career']
  const mobilePrimary = nav.filter((n) => primary.includes(n.id)).slice(0, 4)
  const mobileMore = nav.filter((n) => !mobilePrimary.includes(n))

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      {isPreview && (
        <div className="banner banner-preview" role="status">
          <strong>Preview</strong> You are seeing unpublished draft content exactly as students will. Changes in the editor appear here live.
        </div>
      )}
      {store.mode === 'local' && !isPreview && user?.isAdmin && (
        <div className="banner banner-demo" role="status">
          Browser-only mode: progress and admin changes are saved in this browser only. Connect Supabase to go live.
        </div>
      )}
      <div className="shell canvas-bg">
        <aside className="sidebar" aria-label="Main">
          <Brand />
          <nav className="nav" aria-label="Primary">
            {nav.map((item) => (
              <NavEntry key={item.id} item={item} />
            ))}
            {mentor.available && (
              <MentorLink className="nav-link">
                <MessagesSquare size={20} aria-hidden />
                1:1 Connect
              </MentorLink>
            )}
            <NavLink to="/profile" className="nav-link">
              {({ isActive }) => (
                <>
                  {isActive && <motion.span className="nav-pill" layoutId="nav-pill" />}
                  <UserRound size={20} aria-hidden />
                  Profile
                </>
              )}
            </NavLink>
          </nav>

          <div className="sidebar-extra stack" style={{ marginTop: 'auto', '--gap': '12px' } as CSSProperties}>
            {level ? (
              <button className="card card-tight card-link" style={{ textAlign: 'left', cursor: 'pointer', '--c-level': level.color } as CSSProperties} onClick={() => setLevelOpen(true)}>
                <span className="subtle">Your level</span>
                <span className="row-between" style={{ marginTop: 2 }}>
                  <strong className="row" style={{ '--gap': '8px' } as CSSProperties}>
                    <Icon name={level.icon} size={18} style={{ color: level.color }} /> {level.name}
                  </strong>
                  <span className="small muted row" style={{ '--gap': '2px' } as CSSProperties}>Switch <ChevronRight size={14} aria-hidden /></span>
                </span>
              </button>
            ) : (
              <Link to="/start" className="btn btn-primary btn-block">Choose your level</Link>
            )}
            {mentor.available && (
              <div className="card card-tight tinted">
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Stuck? Talk to {mentor.name}</strong>
                <p className="small muted" style={{ margin: '4px 0 10px' }}>Portfolio, resume, interviews or Figma — book a 1:1.</p>
                <MentorLink className="btn btn-soft btn-sm btn-block">Book a session</MentorLink>
              </div>
            )}
          </div>
        </aside>

        <div className="main">
          <header className="topbar glass">
            <Brand />
            <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search (Ctrl or Command + K)">
              <Search size={18} aria-hidden />
              <span className="search-text">Search lessons, challenges, guides…</span>
              <kbd aria-hidden>⌘K</kbd>
            </button>
            <div className="row" style={{ '--gap': '4px', marginLeft: 'auto', flexWrap: 'nowrap' } as CSSProperties}>
              <NotificationsButton />
              <ModeToggle />
              {user?.isAdmin && (
                <Link to="/admin" className="btn btn-ghost btn-icon" aria-label="Open admin dashboard">
                  <Settings2 size={20} />
                </Link>
              )}
              {!user && store.mode === 'supabase' ? (
                <Link to="/account" className="btn btn-soft btn-sm">
                  <LogIn size={16} aria-hidden /> <span>Sign in</span>
                </Link>
              ) : (
                <Avatar />
              )}
            </div>
          </header>

          <motion.main
            id="main"
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            tabIndex={-1}
            style={{ outline: 'none', flex: 1 }}
          >
            {children ?? <Outlet />}
          </motion.main>
          <SiteFooter />
        </div>
      </div>

      <nav className="bottomnav glass" aria-label="Primary">
        {mobilePrimary.map((item) => {
          const IconCmp = NAV_ICONS[item.id] ?? Link2
          return (
            <NavLink key={item.id} to={item.path} end={item.path === '/'}>
              <IconCmp size={22} aria-hidden />
              {item.label}
            </NavLink>
          )
        })}
        <button onClick={() => setMoreOpen(true)} aria-haspopup="dialog">
          <Menu size={22} aria-hidden />
          More
        </button>
      </nav>

      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <nav className="nav" aria-label="More">
          {mobileMore.map((item) => (
            <NavEntry key={item.id} item={item} onNavigate={() => setMoreOpen(false)} />
          ))}
          {mentor.available && (
            <MentorLink className="nav-link" onClick={() => setMoreOpen(false)}>
              <MessagesSquare size={20} aria-hidden /> 1:1 Connect with {mentor.name}
            </MentorLink>
          )}
          <NavLink to="/profile" className="nav-link">
            <UserRound size={20} aria-hidden /> Profile & settings
          </NavLink>
          {level && (
            <button
              className="nav-link"
              style={{ border: 0, background: 'none', cursor: 'pointer', width: '100%' }}
              onClick={() => {
                setMoreOpen(false)
                setLevelOpen(true)
              }}
            >
              <Icon name={level.icon} size={20} /> Switch level ({level.name})
            </button>
          )}
          {user?.isAdmin && (
            <button className="nav-link" style={{ border: 0, background: 'none', cursor: 'pointer', width: '100%' }} onClick={() => navigate('/admin')}>
              <Settings2 size={20} aria-hidden /> Admin dashboard
            </button>
          )}
        </nav>
      </Sheet>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LevelSwitcher open={levelOpen} onClose={() => setLevelOpen(false)} />
    </>
  )
}

export function SiteFooter() {
  const { content } = useContent()
  const f = content.footer
  return (
    <footer className="page" style={{ paddingTop: 0, paddingBottom: 'calc(var(--space-6) + var(--bottomnav-h))' }}>
      <div className="row-between small muted" style={{ borderTop: '1px solid var(--c-line)', paddingTop: 'var(--space-5)' }}>
        <span>{f.copyright}</span>
        <nav className="row" aria-label="Footer" style={{ '--gap': '16px' } as CSSProperties}>
          {f.links.map((l) =>
            isExternal(l.url) ? (
              <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="muted">{l.label}</a>
            ) : (
              <Link key={l.id} to={l.url} className="muted">{l.label}</Link>
            ),
          )}
          {f.social.map((l) => (
            <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="muted">{l.label}</a>
          ))}
          {f.email && <a href={`mailto:${f.email}`} className="muted">{f.email}</a>}
        </nav>
      </div>
    </footer>
  )
}
