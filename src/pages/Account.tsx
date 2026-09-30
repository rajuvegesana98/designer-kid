import { ArrowLeft, Download, LogOut, Monitor, Moon, Sun, Upload } from 'lucide-react'
import { useEffect, useId, useState, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Brand } from '../components/Brand'
import { LevelSwitcher } from '../components/LevelSwitcher'
import { buildIndex, LevelFilter, ResultRow, searchIndex, type ResultCategory } from '../components/Search'
import { ConfirmDialog, EmptyState, LevelBadge, PageHeader, PasswordInput } from '../components/ui'
import type { LevelId } from '../content/types'
import { getLevel } from '../lib/content'
import { useAuth } from '../state/auth'
import { useContent } from '../state/content'
import { useLearner } from '../state/learner'
import { useColorMode, useToast, type ModePref } from '../state/ui'

export function ProfilePage() {
  const { content } = useContent()
  const { state, setName, resetProgress, importState } = useLearner()
  const { user, mode, signOut, updatePassword } = useAuth()
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
          <h2 id="p-account" style={{ fontSize: '1.15rem' }}>Your progress</h2>
          <p className="muted">No account needed — your progress, notes, bookmarks and checklists are saved in this browser. Clearing your browser data removes them, so download a backup now and then. You can restore it on any device.</p>
          <div className="row">
            <button
              className="btn"
              onClick={() => {
                const a = document.createElement('a')
                a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: 'designer-kid', version: 1, state }, null, 2)], { type: 'application/json' }))
                a.download = `designer-kid-progress-${new Date().toISOString().slice(0, 10)}.json`
                a.click()
                URL.revokeObjectURL(a.href)
                toast('Backup downloaded')
              }}
            >
              <Download size={16} aria-hidden /> Download my progress
            </button>
            <label className="btn">
              <Upload size={16} aria-hidden /> Restore from backup
              <input
                type="file"
                accept="application/json,.json"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (!file) return
                  try {
                    const data = JSON.parse(await file.text())
                    if (data?.app !== 'designer-kid' || !data.state?.completedLessons) throw new Error()
                    importState(data.state)
                    toast('Progress restored and merged')
                  } catch {
                    toast('That file isn’t a Designer Kid progress backup.', 'error')
                  }
                }}
              />
            </label>
          </div>
          {user && (
            <div className="row-between" style={{ borderTop: '1px solid var(--c-line)', paddingTop: 12 }}>
              <span className="small">Signed in as <strong>{user.email}</strong>{user.isAdmin ? ' (admin)' : ''}</span>
              <span className="row">
                {user.isAdmin && <Link to="/admin" className="btn btn-soft btn-sm">Admin dashboard</Link>}
                <button className="btn btn-sm" onClick={() => signOut().then(() => toast('Signed out'))}><LogOut size={15} aria-hidden /> Sign out</button>
              </span>
            </div>
          )}
        </section>

        {user && mode === 'supabase' && (
          <section className="card stack" aria-labelledby="p-password">
            <h2 id="p-password" style={{ fontSize: '1.15rem' }}>Change password</h2>
            <PasswordFields submitLabel="Update password" onDone={async (pw) => { await updatePassword(pw); toast('Password updated') }} />
          </section>
        )}

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
  const { signIn, signUp, mode, user, requestPasswordReset, suspended } = useAuth()
  const { state } = useLearner()
  const [params] = useSearchParams()
  // Learners don't need accounts; this page is the admin sign-in and password reset.
  const tab = 'signin' as 'signin' | 'signup'
  const [forgot, setForgot] = useState(params.has('forgot'))
  const [name, setName] = useState(state.name)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const ids = { name: useId(), email: useId(), password: useId() }
  const next = params.get('next') || '/admin'

  useEffect(() => {
    if (user) navigate(next, { replace: true })
  }, [user, next, navigate])

  const sendReset = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!email.includes('@')) return setError('Enter the email you signed up with.')
    setBusy(true)
    try {
      await requestPasswordReset(email.trim())
      setInfo('If an account exists for that email, a reset link is on its way. Check your inbox (and spam).')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the email. Please try again later.')
    } finally {
      setBusy(false)
    }
  }

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
          <h1 style={{ fontSize: '1.8rem' }}>{forgot ? 'Reset your password' : 'Admin sign in'}</h1>
          {!forgot && <p className="muted small">For Designer Kid admins. Learners don’t need an account — progress saves in the browser. <Link to="/">Go to the site</Link></p>}
          {mode === 'local' ? (
            <p className="muted">Accounts aren’t switched on yet. You can keep learning — your progress is saved in this browser.</p>
          ) : (
            <>
              {suspended && <p className="callout callout-warning small" role="alert">This account has been suspended. Please contact Designer Kid if you think this is a mistake.</p>}
              {forgot ? (
                <form className="stack" onSubmit={sendReset} noValidate>
                  <p className="muted">Enter the email you signed up with and we’ll send you a link to choose a new password.</p>
                  <div className="field">
                    <label htmlFor={ids.email}>Email</label>
                    <input id={ids.email} className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                  </div>
                  {error && <p className="error" role="alert" style={{ color: 'var(--c-danger)', fontWeight: 500 }}>{error}</p>}
                  {info && <p role="status" className="callout callout-tip">{info}</p>}
                  <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => { setForgot(false); setError(''); setInfo('') }}>Back to sign in</button>
                </form>
              ) : (
              <>
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
                  <PasswordInput id={ids.password} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={tab === 'signin' ? 'current-password' : 'new-password'} required minLength={8} aria-describedby={`${ids.password}-hint`} />
                  {tab === 'signup' && <span id={`${ids.password}-hint`} className="hint">At least 8 characters.</span>}
                </div>
                {tab === 'signin' && (
                  <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-end', marginTop: -6 }} onClick={() => { setForgot(true); setError(''); setInfo('') }}>
                    Forgot password?
                  </button>
                )}
                {error && <p className="error" role="alert" style={{ color: 'var(--c-danger)', fontWeight: 500 }}>{error}</p>}
                {info && <p role="status" className="callout callout-tip">{info}</p>}
                <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
                  {busy ? 'Please wait…' : tab === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              </form>
              </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export function PasswordFields({ onDone, submitLabel }: { onDone: (password: string) => Promise<void>; submitLabel: string }) {
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const ids = { a: useId(), b: useId() }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (pw.length < 8) return setError('Use at least 8 characters.')
    if (pw !== pw2) return setError('The two passwords don’t match.')
    setBusy(true)
    try {
      await onDone(pw)
      setPw('')
      setPw2('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the password.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <form className="stack" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor={ids.a}>New password</label>
        <PasswordInput id={ids.a} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} minLength={8} required />
        <span className="hint">At least 8 characters.</span>
      </div>
      <div className="field">
        <label htmlFor={ids.b}>Confirm new password</label>
        <PasswordInput id={ids.b} autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
      </div>
      {error && <p role="alert" style={{ color: 'var(--c-danger)', fontWeight: 500 }}>{error}</p>}
      <button className="btn btn-primary" disabled={busy} style={{ width: 'fit-content' }}>{busy ? 'Saving…' : submitLabel}</button>
    </form>
  )
}

export function ResetPasswordPage() {
  const { user, ready, updatePassword, recovering } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [waited, setWaited] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setWaited(true), 2500)
    return () => window.clearTimeout(t)
  }, [])
  return (
    <div className="canvas-bg" style={{ minHeight: '100dvh' }}>
      <header className="page row-between" style={{ paddingTop: 20, paddingBottom: 0 }}>
        <Brand />
      </header>
      <main id="main" className="page" style={{ maxWidth: 480 }}>
        <div className="card stack" style={{ padding: 'var(--space-6)' }}>
          <h1 style={{ fontSize: '1.8rem' }}>Choose a new password</h1>
          {user && (recovering || waited) ? (
            <PasswordFields
              submitLabel="Save new password"
              onDone={async (pw) => {
                await updatePassword(pw)
                toast('Password updated — you’re signed in')
                navigate('/', { replace: true })
              }}
            />
          ) : !ready || !waited ? (
            <p className="muted">Checking your reset link…</p>
          ) : (
            <>
              <p className="muted">This reset link has expired or was already used. Request a new one and open it on the same day.</p>
              <Link to="/account" className="btn btn-primary" style={{ width: 'fit-content' }}>Request a new link</Link>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

const CATS: ResultCategory[] = ['Lesson', 'Module', 'Challenge', 'Resource', 'Career guide', 'Article']

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
