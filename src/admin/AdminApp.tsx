import { motion } from 'motion/react'
import {
  ArrowLeft, BarChart3, BookOpen, Brush, CircleAlert, Eye, FolderOpen, History, Image, LayoutDashboard, Layers, Library, LogOut, Menu,
  MessagesSquare, Moon, Rocket, Settings, Star, Sun, Target, Users, type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { BrandMark } from '../components/Brand'
import { ConfirmDialog, FullPageLoader, Modal, Sheet, timeAgo } from '../components/ui'
import { store } from '../data'
import { useAuth } from '../state/auth'
import { useColorMode, useToast } from '../state/ui'
import { AdminProvider, useAdmin } from './state'
import { AdminDashboard, AnalyticsPage } from './pages/Dashboard'
import { CoursesPage } from './pages/Courses'
import { LevelsPage } from './pages/Levels'
import { ChallengesAdmin } from './pages/Challenges'
import { LibraryPage } from './pages/Library'
import { WebsitePage } from './pages/Website'
import { ThemePage } from './pages/Theme'
import { MediaPage } from './pages/Media'
import { UsersPage } from './pages/Users'
import { ConnectAdmin } from './pages/Connect'
import { PublishingPage, SettingsPage } from './pages/Settings'
import { ReviewsAdmin } from './pages/Reviews'

const NAV: { to: string; label: string; icon: LucideIcon; group: string }[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, group: 'Overview' },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen, group: 'Content' },
  { to: '/admin/challenges', label: 'Challenges', icon: Target, group: 'Content' },
  { to: '/admin/content', label: 'Content library', icon: Library, group: 'Content' },
  { to: '/admin/levels', label: 'Levels', icon: Layers, group: 'Content' },
  { to: '/admin/media', label: 'Media', icon: Image, group: 'Content' },
  { to: '/admin/users', label: 'Users', icon: Users, group: 'People' },
  { to: '/admin/connect', label: '1:1 Connect', icon: MessagesSquare, group: 'People' },
  { to: '/admin/reviews', label: 'Reviews', icon: Star, group: 'People' },
  { to: '/admin/website', label: 'Website', icon: FolderOpen, group: 'Site' },
  { to: '/admin/theme', label: 'Theme', icon: Brush, group: 'Site' },
  { to: '/admin/publishing', label: 'Publishing', icon: History, group: 'Site' },
  { to: '/admin/settings', label: 'Settings', icon: Settings, group: 'Site' },
]

export default function AdminApp() {
  const { user, ready } = useAuth()
  if (!ready) return <FullPageLoader />
  if (!user) return <AdminLogin />
  if (!user.isAdmin) return <NotAdmin />
  return (
    <AdminProvider fallback={<FullPageLoader />}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="challenges" element={<ChallengesAdmin />} />
          <Route path="content" element={<LibraryPage />} />
          <Route path="levels" element={<LevelsPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="connect" element={<ConnectAdmin />} />
          <Route path="reviews" element={<ReviewsAdmin />} />
          <Route path="website" element={<WebsitePage />} />
          <Route path="theme" element={<ThemePage />} />
          <Route path="publishing" element={<PublishingPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AdminProvider>
  )
}

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const groups = [...new Set(NAV.map((n) => n.group))]
  return (
    <nav className="nav" aria-label="Admin">
      {groups.map((g) => (
        <div key={g}>
          <div className="nav-label">{g}</div>
          {NAV.filter((n) => n.group === g).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/admin'} className="nav-link" onClick={onNavigate}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span className="nav-pill" layoutId="admin-pill" />}
                  <n.icon size={19} aria-hidden />
                  {n.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}

function PublishBar() {
  const admin = useAdmin()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [discard, setDiscard] = useState(false)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const status =
    admin.saveState === 'saving' ? 'Saving draft…' : admin.saveState === 'unsaved' ? 'Unsaved changes' : admin.saveState === 'error' ? 'Draft not saved' : admin.savedAt ? `Draft saved ${timeAgo(admin.savedAt)}` : 'Draft saved'

  const publish = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await admin.publish(note.trim() || admin.changedSections.join(', '))
      toast('Published — students can see your changes now')
      setOpen(false)
      setNote('')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Publishing failed', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="row" style={{ '--gap': '8px', flexWrap: 'nowrap' } as CSSProperties}>
        <span className="subtle hide-sm row" style={{ '--gap': '6px', whiteSpace: 'nowrap' } as CSSProperties} aria-live="polite">
          {admin.saveState === 'error' && <CircleAlert size={15} style={{ color: 'var(--c-danger)' }} aria-hidden />}
          {status}
        </span>
        {admin.saveState === 'error' && <button className="btn btn-sm" onClick={() => admin.saveNow()}>Retry</button>}
        {admin.hasUnpublished && <span className="badge badge-warning hide-sm">{admin.changedSections.length} unpublished</span>}
        <button className="btn btn-sm" onClick={() => admin.openPreview('/')}>
          <Eye size={16} aria-hidden /> <span className="hide-sm">Preview</span>
        </button>
        <button className="btn btn-primary btn-sm" disabled={!admin.hasUnpublished} onClick={() => setOpen(true)}>
          <Rocket size={16} aria-hidden /> Publish
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Publish changes?" description="Students will see these changes as soon as you publish. A version is saved so you can restore it later.">
        <form className="stack" onSubmit={publish}>
          <div>
            <strong className="small">Changed sections</strong>
            <div className="chip-group" style={{ marginTop: 8 }}>
              {admin.changedSections.map((s) => <span key={s} className="badge badge-warning">{s}</span>)}
            </div>
          </div>
          {admin.changedSections.some((s) => ['Levels & courses', 'Theme', 'Navigation'].includes(s)) && (
            <p className="callout callout-warning small">This is a major change (levels, theme or navigation). Preview it first if you haven’t.</p>
          )}
          <div className="field">
            <label htmlFor="pub-note">Version note (optional)</label>
            <input id="pub-note" className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Added Figma variables lesson" />
          </div>
          <div className="row-between">
            <button type="button" className="btn btn-ghost" style={{ color: 'var(--c-danger)' }} onClick={() => { setOpen(false); setDiscard(true) }}>Discard draft</button>
            <div className="row">
              <button type="button" className="btn" onClick={() => admin.openPreview('/')}>
                <Eye size={16} aria-hidden /> Preview
              </button>
              <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Publishing…' : 'Publish now'}</button>
            </div>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={discard}
        danger
        title="Discard all unpublished changes?"
        body="Your draft will be reset to what students currently see. This can’t be undone."
        confirmLabel="Discard changes"
        onCancel={() => setDiscard(false)}
        onConfirm={() => {
          admin.discard()
          setDiscard(false)
          toast('Draft discarded')
        }}
      />
    </>
  )
}

function AdminLayout() {
  const { user, signOut } = useAuth()
  const { resolved, setPref } = useColorMode()
  const [menu, setMenu] = useState(false)
  const location = useLocation()
  const current = NAV.find((n) => (n.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(n.to)))
  useEffect(() => {
    window.scrollTo({ top: 0 })
    setMenu(false)
  }, [location.pathname])

  return (
    <>
      <a href="#admin-main" className="skip-link">Skip to content</a>
      {store.mode === 'local' && (
        <div className="banner banner-demo" role="status">
          Browser-only mode: your edits and “published” content live in this browser. Add your Supabase URL and key to publish for everyone.
        </div>
      )}
      <div className="shell admin-shell">
        <aside className="sidebar" aria-label="Admin navigation">
          <Link to="/admin" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
            <BrandMark />
            <span className="brand-text">
              <span className="brand-name" style={{ display: 'block' }}>Admin</span>
              <span className="brand-tag">Designer Kid studio</span>
            </span>
          </Link>
          <AdminNav />
          <div className="sidebar-extra stack" style={{ marginTop: 'auto', '--gap': '6px' } as CSSProperties}>
            <Link to="/" className="nav-link"><ArrowLeft size={18} aria-hidden /> View student site</Link>
          </div>
        </aside>
        <div className="main">
          <header className="topbar glass" style={{ justifyContent: 'space-between' }}>
            <div className="row" style={{ flexWrap: 'nowrap', minWidth: 0 }}>
              <button className="btn btn-ghost btn-icon admin-menu-btn" aria-label="Open admin menu" onClick={() => setMenu(true)}>
                <Menu size={20} />
              </button>
              <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{current?.label ?? 'Admin'}</strong>
            </div>
            <div className="row" style={{ flexWrap: 'nowrap', '--gap': '6px' } as CSSProperties}>
              <PublishBar />
              <button className="btn btn-ghost btn-icon hide-sm" aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`} onClick={() => setPref(resolved === 'dark' ? 'light' : 'dark')}>
                {resolved === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
              </button>
              <button className="btn btn-ghost btn-icon hide-sm" aria-label={`Sign out ${user?.email ?? ''}`} onClick={() => signOut()}>
                <LogOut size={19} />
              </button>
            </div>
          </header>
          <main id="admin-main" className="page" style={{ maxWidth: 1280, paddingBottom: 'var(--space-8)' }}>
            <Outlet />
          </main>
        </div>
      </div>
      <Sheet open={menu} onClose={() => setMenu(false)} title="Admin menu">
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <AdminNav onNavigate={() => setMenu(false)} />
          <Link to="/" className="nav-link"><ArrowLeft size={18} aria-hidden /> View student site</Link>
          <button className="nav-link" style={{ border: 0, background: 'none', width: '100%', cursor: 'pointer' }} onClick={() => signOut()}>
            <LogOut size={18} aria-hidden /> Sign out
          </button>
        </div>
      </Sheet>
    </>
  )
}

function AdminLogin() {
  const { signIn, enterDemoAdmin, mode } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setBusy(false)
    }
  }
  return (
    <main className="canvas-bg" style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <div className="card stack" style={{ width: 'min(420px, 100%)', padding: 'var(--space-6)' }}>
        <div className="row"><BrandMark /><strong>Designer Kid admin</strong></div>
        <h1 style={{ fontSize: '1.6rem' }}>Sign in to manage Designer Kid</h1>
        {mode === 'local' ? (
          <>
            <p className="muted">Supabase isn’t connected yet, so the admin runs in browser-only mode. Anything you edit or publish stays in this browser until you connect a database.</p>
            <button className="btn btn-primary btn-lg" onClick={() => enterDemoAdmin?.()}>Open admin for this browser</button>
          </>
        ) : (
          <form className="stack" onSubmit={submit}>
            <div className="field">
              <label htmlFor="a-email">Email</label>
              <input id="a-email" className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="a-pass">Password</label>
              <input id="a-pass" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p role="alert" style={{ color: 'var(--c-danger)' }}>{error}</p>}
            <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
        )}
        <Link to="/" className="btn btn-ghost">Back to the site</Link>
      </div>
    </main>
  )
}

function NotAdmin() {
  const { user, signOut } = useAuth()
  return (
    <main className="canvas-bg" style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <div className="card stack" style={{ width: 'min(520px, 100%)', padding: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.5rem' }}>This account isn’t an admin</h1>
        <p className="muted">You’re signed in as <strong>{user?.email}</strong>. To make this account an admin, run this once in the Supabase SQL editor:</p>
        <pre className="mono card card-flat" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{`insert into public.admins (user_id)\nselect id from auth.users where email = '${user?.email}';`}</pre>
        <div className="row">
          <button className="btn" onClick={() => window.location.reload()}>I’ve done it — reload</button>
          <button className="btn btn-ghost" onClick={() => signOut()}>Sign out</button>
          <Link to="/" className="btn btn-ghost">Back to site</Link>
        </div>
      </div>
    </main>
  )
}
