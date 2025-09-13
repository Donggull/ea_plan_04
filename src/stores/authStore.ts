import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  permissions: string[]

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setPermissions: (permissions: string[]) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      permissions: [],

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      setPermissions: (permissions) =>
        set({ permissions }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          permissions: [],
        }),

      hasPermission: (permission) => {
        const { permissions } = get()
        return permissions.includes(permission) || permissions.includes('admin')
      },
    }),
    {
      name: 'eluo-auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    }
  )
)