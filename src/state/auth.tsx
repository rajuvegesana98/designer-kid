import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { store, type AppUser, type SignUpResult } from '../data'

interface AuthCtx {
  user: AppUser | null
  ready: boolean
  mode: 'local' | 'supabase'
  signIn(email: string, password: string): Promise<AppUser>
  signUp(name: string, email: string, password: string): Promise<SignUpResult>
  signOut(): Promise<void>
  requestPasswordReset(email: string): Promise<void>
  updatePassword(password: string): Promise<void>
  /** True after the learner opened a password-reset link. */
  recovering: boolean
  /** Set when a suspended account tried to sign in. */
  suspended: boolean
  enterDemoAdmin?: () => Promise<AppUser>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [ready, setReady] = useState(false)
  const [recovering, setRecovering] = useState(() => /type=recovery/.test(window.location.hash))
  const [suspended, setSuspended] = useState(false)

  // Suspended accounts are signed straight back out.
  const accept = (u: AppUser | null) => {
    if (u?.blocked) {
      setSuspended(true)
      void store.signOut()
      setUser(null)
      return
    }
    setUser(u)
  }

  useEffect(() => {
    let alive = true
    store
      .currentUser()
      .then((u) => alive && accept(u))
      .catch(() => alive && setUser(null))
      .finally(() => alive && setReady(true))
    const off = store.onAuthChange((u, event) => {
      if (!alive) return
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      accept(u)
    })
    return () => {
      alive = false
      off()
    }
  }, [])

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,
      mode: store.mode,
      async signIn(email, password) {
        const u = await store.signIn(email, password)
        if (u.blocked) {
          await store.signOut()
          setSuspended(true)
          throw new Error('This account has been suspended. Please contact Designer Kid if you think this is a mistake.')
        }
        setSuspended(false)
        setUser(u)
        return u
      },
      async signUp(name, email, password) {
        const res = await store.signUp(name, email, password)
        if ('user' in res) setUser(res.user)
        return res
      },
      async signOut() {
        await store.signOut()
        setUser(null)
      },
      requestPasswordReset: (email) => store.requestPasswordReset(email),
      async updatePassword(password) {
        await store.updatePassword(password)
        setRecovering(false)
      },
      recovering,
      suspended,
      enterDemoAdmin: store.enterDemoAdmin
        ? async () => {
            const u = await store.enterDemoAdmin!()
            setUser(u)
            return u
          }
        : undefined,
    }),
    [user, ready, recovering, suspended],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
