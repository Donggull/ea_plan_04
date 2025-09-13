import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { AuthChangeEvent, Session, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'eluo-auth-token',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-application-name': 'Eluo Platform',
    },
  },
})

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, additionalData?: Record<string, unknown>) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: additionalData,
      },
    })
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  // Get current session
  getCurrentSession: () => {
    return supabase.auth.getSession()
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Database helper functions
export const db = {
  // Generic select
  from: (table: keyof Database['public']['Tables']) => {
    return supabase.from(table)
  },

  // Real-time subscriptions
  subscribe: (
    table: keyof Database['public']['Tables'],
    callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
    filter?: string
  ) => {
    const subscription = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table as string,
          filter,
        },
        callback
      )
      .subscribe()

    return subscription
  },

  // Unsubscribe from real-time
  unsubscribe: (subscription: ReturnType<typeof supabase.channel>) => {
    return supabase.removeChannel(subscription)
  },
}

// Storage helper functions
export const storage = {
  // Upload file
  upload: async (bucket: string, path: string, file: File, options?: { cacheControl?: string; upsert?: boolean }) => {
    return await supabase.storage.from(bucket).upload(path, file, options)
  },

  // Download file
  download: async (bucket: string, path: string) => {
    return await supabase.storage.from(bucket).download(path)
  },

  // Get public URL
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage.from(bucket).getPublicUrl(path)
  },

  // Delete file
  remove: async (bucket: string, paths: string[]) => {
    return await supabase.storage.from(bucket).remove(paths)
  },
}

export default supabase