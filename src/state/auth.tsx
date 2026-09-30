import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { store, type AppUser, type SignUpResult } from '../data'

interface AuthCtx {
  user: AppUser | null
  ready: boolean
  mode: 'local' | 'supabase'
  signIn(email: string, password: string): Promise<AppUser>
  signUp(name: string, email: string, password: string): Promise<SignUpResult>
  signOut(): Promise<void>
  enterDemoAdmin?: () => Promise<AppUser>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    store
      .currentUser()
      .then((u) => alive && setUser(u))
      .catch(() => alive && setUser(null))
      .finally(() => alive && setReady(true))
    const off = store.onAuthChange((u) => alive && setUser(u))
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
      enterDemoAdmin: store.enterDemoAdmin
        ? async () => {
            const u = await store.enterDemoAdmin!()
            setUser(u)
            return u
          }
        : undefined,
    }),
    [user, ready],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
