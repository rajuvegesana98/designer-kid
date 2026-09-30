import { ArrowLeft, LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useId, useState, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Brand } from '../components/Brand'
import { LevelSwitcher } from '../components/LevelSwitcher'
import { buildIndex, LevelFilter, ResultRow, searchIndex, type ResultCategory } from '../components/Search'
import { ConfirmDialog, EmptyState, LevelBadge, PageHeader, Tabs } from '../components/ui'
import type { LevelId } from '../content/types'
import { getLevel } from '../lib/content'
import { useAuth } from '../state/auth'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { useColorMode, useToast, type ModePref } from '../state/ui'

export function ProfilePage() {
  const { content } = useContent()
  const { state, setName, resetProgress } = useLearner()
  const { user, mode, signOut } = useAuth()
  const { pref, setPref } = useColorMode()
  const toast = useToast()
  const [name, setNameInput] = useState(state.name)
  const [switchOpen, setSwitchOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const nameId = useId()
  const level = getLevel(content, state.level)

  return (
    <div className="page page-narrow">
      <PageHeader eyebrow="Profile" title="Profile & settings" />
      <div className="stack" style={{ '--gap': 'var(--space-5)' } as CSSProperties}>
        <section className="card stack" aria-labelledby="p-you">
          <h2 id="p-you" style={{ fontSize: '1.15rem' }}>You</h2>
          <form
            className="row"
            style={{ alignItems: 'flex-end' }}
            onSubmit={(e) => {
              e.preventDefault()
              setName(name.trim())
              toast('Name saved')
            }}
          >
            <div className="field grow" style={{ minWidth: 220 }}>
              <label htmlFor={nameId}>Display name</label>
              <input id={nameId} className="input" value={name} maxLength={60} onChange={(e) => setNameInput(e.target.value)} autoComplete="name" />
            </div>
            <button className="btn" type="submit" disabled={name.trim() === state.name}>Save</button>
          </form>
          <div className="row-between">
            <span className="row">
              <span className="muted">Level:</span>
              {level ? <LevelBadge level={level} /> : <span className="muted">Not chosen</span>}
            </span>
            {level ? (
              <button className="btn btn-soft btn-sm" onClick={() => setSwitchOpen(true)}>Switch level</button>
            ) : (
              <Link to="/start" className="btn btn-soft btn-sm">Choose level</Link>
            )}
          </div>
        </section>

        <section className="card stack" aria-labelledby="p-account">
          <h2 id="p-account" style={{ fontSize: '1.15rem' }}>Account</h2>
          {mode === 'local' ? (
            <p className="muted">Your progress, notes and bookmarks are saved in this browser. Accounts become available once the site owner connects a database.</p>
          ) : user ? (
            <div className="row-between">
              <span>
                Signed in as <strong>{user.email}</strong>
                <span className="subtle" style={{ display: 'block' }}>Progress syncs across your devices.</span>
              </span>
              <button className="btn" onClick={() => signOut().then(() => toast('Signed out'))}>
                <LogOut size={16} aria-hidden /> Sign out
              </button>
            </div>
          ) : (
            <div className="row-between">
              <span className="muted">Create a free account to keep your progress on every device.</span>
              <Link to="/account" className="btn btn-primary">Sign in or create account</Link>
            </div>
          )}
          {user?.isAdmin && <Link to="/admin" className="btn btn-soft" style={{ width: 'fit-content' }}>Open admin dashboard</Link>}
        </section>

        <section className="card stack" aria-labelledby="p-appearance">
          <h2 id="p-appearance" style={{ fontSize: '1.15rem' }}>Appearance</h2>
          <div className="chip-group" role="radiogroup" aria-labelledby="p-appearance">
            {(
              [
                [null, 'Site default', Monitor],
                ['light', 'Light', Sun],
                ['dark', 'Dark', Moon],
                ['system', 'Match my device', Monitor],
              ] as [ModePref | null, string, typeof Sun][]
            ).map(([v, label, I]) => (
              <button key={label} type="button" role="radio" className="chip" aria-checked={pref === v} onClick={() => setPref(v)}>
                <I size={15} aria-hidden /> {label}
              </button>
            ))}
          </div>
          <p className="subtle">Animations follow your device’s “reduce motion” setting automatically.</p>
        </section>

        <section className="card stack" aria-labelledby="p-danger">
          <h2 id="p-danger" style={{ fontSize: '1.15rem' }}>Reset progress</h2>
          <p className="muted small">Clears completed lessons, challenges, checklists, notes and bookmarks. Your name and level stay.</p>
          <button className="btn" style={{ width: 'fit-content', color: 'var(--c-danger)' }} onClick={() => setConfirmReset(true)}>Reset my progress</button>
        </section>
      </div>
      <LevelSwitcher open={switchOpen} onClose={() => setSwitchOpen(false)} />
      <ConfirmDialog
        open={confirmReset}
        danger
        title="Reset all progress?"
        body="This permanently clears your completed lessons, challenges, checklists, notes and bookmarks. This can’t be undone."
        confirmLabel="Reset progress"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetProgress()
          setConfirmReset(false)
          toast('Progress reset')
        }}
      />
    </div>
  )
}

export function AccountPage() {
  const { signIn, signUp, mode, user } = useAuth()
  const { state } = useLearner()
  const [params] = useSearchParams()
  const [tab, setTab] = useState<'signin' | 'signup'>(params.get('mode') === 'signup' ? 'signup' : 'signin')
  const [name, setName] = useState(state.name)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const ids = { name: useId(), email: useId(), password: useId() }
  const next = params.get('next') || '/'

  useEffect(() => {
    if (user) navigate(next, { replace: true })
  }, [user, next, navigate])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!email.includes('@')) return setError('Enter a valid email address.')
    if (password.length < 8) return setError('Use at least 8 characters for your password.')
    setBusy(true)
    try {
      if (tab === 'signin') await signIn(email.trim(), password)
      else {
        const res = await signUp(name.trim(), email.trim(), password)
        if ('needsConfirmation' in res) setInfo('Check your inbox to confirm your email, then sign in. Your progress in this browser will be added to your account.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="canvas-bg" style={{ minHeight: '100dvh' }}>
      <header className="page row-between" style={{ paddingTop: 20, paddingBottom: 0 }}>
        <Brand />
        <Link to="/" className="btn btn-ghost"><ArrowLeft size={18} aria-hidden /> Back</Link>
      </header>
      <main id="main" className="page" style={{ maxWidth: 480 }}>
        <div className="card stack" style={{ padding: 'var(--space-6)' }}>
          <h1 style={{ fontSize: '1.8rem' }}>{tab === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
          {mode === 'local' ? (
            <p className="muted">Accounts aren’t switched on yet. You can keep learning — your progress is saved in this browser.</p>
          ) : (
            <>
              <Tabs<'signin' | 'signup'>
                id="auth"
                label="Account"
                value={tab}
                onChange={(v) => {
                  setTab(v)
                  setError('')
                  setInfo('')
                }}
                tabs={[
                  { value: 'signin', label: 'Sign in' },
                  { value: 'signup', label: 'Create account' },
                ]}
              />
              <form id="auth-panel" role="tabpanel" className="stack" onSubmit={submit} noValidate>
                {tab === 'signup' && (
                  <div className="field">
                    <label htmlFor={ids.name}>Name</label>
                    <input id={ids.name} className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                  </div>
                )}
                <div className="field">
                  <label htmlFor={ids.email}>Email</label>
                  <input id={ids.email} className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required aria-invalid={!!error && !email.includes('@')} />
                </div>
                <div className="field">
                  <label htmlFor={ids.password}>Password</label>
                  <input id={ids.password} className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={tab === 'signin' ? 'current-password' : 'new-password'} required minLength={8} aria-describedby={`${ids.password}-hint`} />
                  {tab === 'signup' && <span id={`${ids.password}-hint`} className="hint">At least 8 characters.</span>}
                </div>
                {error && <p className="error" role="alert" style={{ color: 'var(--c-danger)', fontWeight: 500 }}>{error}</p>}
                {info && <p role="status" className="callout callout-tip">{info}</p>}
                <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
                  {busy ? 'Please wait…' : tab === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

const CATS: ResultCategory[] = ['Lesson', 'Module', 'Challenge', 'Resource', 'Career guide']

export function SearchPage() {
  const { content } = useContent()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q') ?? ''
  const level = (params.get('level') as LevelId | 'any') || 'any'
  const cat = (params.get('cat') as ResultCategory | null) ?? 'any'
  const index = buildIndex(content)
  const results = q.trim() ? searchIndex(index, q, level, cat) : []
  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    p.set(k, v)
    setParams(p, { replace: true })
  }
  const inputId = useId()
  return (
    <div className="page page-narrow">
      <PageHeader eyebrow="Search" title="Search Designer Kid" />
      <div className="stack">
        <div className="field">
          <label htmlFor={inputId} className="sr-only">Search</label>
          <input id={inputId} className="input" style={{ minHeight: 52, fontSize: '1.05rem' }} value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search courses, lessons, challenges, resources, career guides" autoFocus />
        </div>
        <LevelFilter value={level} onChange={(v) => set('level', v)} />
        <div className="chip-group" role="radiogroup" aria-label="Filter by category">
          <button type="button" role="radio" className="chip" aria-checked={cat === 'any'} onClick={() => set('cat', 'any')}>Everything</button>
          {CATS.map((c) => (
            <button key={c} type="button" role="radio" className="chip" aria-checked={cat === c} onClick={() => set('cat', c)}>{c}s</button>
          ))}
        </div>
        <p className="subtle" aria-live="polite">{q.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Type to search.'}</p>
        {q.trim() && !results.length ? (
          <EmptyState icon="Search" title="No results">Try a different word, or search All levels.</EmptyState>
        ) : (
          <div role="listbox" aria-label="Results" className="card" style={{ padding: 8 }} hidden={!results.length}>
            {results.map((r) => (
              <ResultRow key={r.key} r={r} onPick={() => (r.external ? window.open(r.to, '_blank', 'noopener') : navigate(r.to))} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="page">
      <EmptyState icon="Map" title="Page not found" action={<Link to="/" className="btn btn-primary">Go home</Link>}>
        The page you’re looking for doesn’t exist or has moved.
      </EmptyState>
    </div>
  )
}
