import { createLocalStore } from './localStore'
import { createSupabaseStore } from './supabaseStore'
import type { DataStore } from './types'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** The single data store the whole app talks to. Swap implementations here. */
export const store: DataStore = url && anonKey ? createSupabaseStore(url, anonKey) : createLocalStore()

export type * from './types'
