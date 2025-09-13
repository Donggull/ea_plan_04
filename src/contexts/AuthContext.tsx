import React, { createContext, useEffect, useState, useCallback } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { auth, supabase } from '@/lib/supabase/client'
import { profileSync } from '@/lib/auth/profileSync'
import type { Database } from '@/types/supabase'
import { SessionManager } from '@/components/auth/SessionManager'

type UserProfile = Database['public']['Tables']['profiles']['Row']

interface AuthResponse {
  error: AuthError | null
  data?: unknown
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  profileLoading: boolean
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string, additionalData?: Record<string, unknown>) => Promise<AuthResponse>
  signOut: () => Promise<{ error: AuthError | null }>
  getCurrentUser: () => Promise<{ data: { user: User | null }; error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: any }>
  refreshProfile: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResponse>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // 프로필 가져오기
  const fetchProfile = useCallback(async (userId: string) => {
    setProfileLoading(true)
    try {
      const result = await profileSync.getUserProfile(userId)
      if (result.success && result.profile) {
        setProfile(result.profile)
      } else {
        console.warn('프로필 조회 실패:', result.error)
        setProfile(null)
      }
    } catch (error) {
      console.error('프로필 조회 중 오류:', error)
      setProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  // 프로필 새로고침
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id)
    }
  }, [user?.id, fetchProfile])

  // 사용자 프로필 동기화
  const syncProfile = useCallback(async (authUser: User) => {
    try {
      const result = await profileSync.syncUserProfile(authUser, { skipIfExists: false })
      if (result.success && result.profile) {
        setProfile(result.profile)
      }
    } catch (error) {
      console.error('프로필 동기화 중 오류:', error)
    }
  }, [])

  useEffect(() => {
    // 초기 세션 확인
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await auth.getCurrentSession()

        if (error) {
          console.error('세션 확인 중 오류:', error)
        } else {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)

          // 사용자가 있으면 프로필 동기화
          if (currentSession?.user) {
            await syncProfile(currentSession.user)
          }
        }
      } catch (error) {
        console.error('세션 초기화 중 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 인증 상태 변경 감지
    const { data: { subscription } } = auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession)

        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN' && currentSession?.user) {
          // 로그인 시 프로필 동기화 및 마지막 로그인 시간 업데이트
          await syncProfile(currentSession.user)
          await profileSync.updateLastSignIn(currentSession.user.id)
        } else if (event === 'TOKEN_REFRESHED' && currentSession?.user) {
          // 토큰 갱신 시 프로필 업데이트
          await syncProfile(currentSession.user)
        } else if (event === 'SIGNED_OUT') {
          // 로그아웃 시 상태 초기화
          localStorage.removeItem('eluo-auth-token')
          setUser(null)
          setSession(null)
          setProfile(null)
        }
      }
    )

    // 세션 지속성을 위한 설정
    // Supabase는 이미 localStorage를 통해 세션을 자동으로 저장하고 복구함

    // 브라우저 종료 vs 새로고침/탭 전환 구분을 위한 로직
    let isRefreshing = false
    let tabId = sessionStorage.getItem('eluo-tab-id')

    // 탭 고유 ID 생성 (브라우저 완전 종료 감지용)
    if (!tabId) {
      tabId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('eluo-tab-id', tabId)
    }

    // beforeunload 이벤트 - 새로고침 감지
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 새로고침이나 탭 닫기 구분
      isRefreshing = true

      // 짧은 지연 후 새로고침 플래그 초기화
      setTimeout(() => {
        isRefreshing = false
      }, 100)
    }

    // 페이지 로드 시 세션 복구 확인
    const handlePageLoad = () => {
      // 페이지 로드 시 활동 시간 기록
      sessionStorage.setItem('eluo-last-activity', Date.now().toString())

      // 이전 세션이 있었는지 확인
      const wasLoggedIn = localStorage.getItem('eluo-auth-token')
      if (wasLoggedIn && !user && !loading) {
        // Supabase가 자동으로 세션을 복구하도록 함
        console.log('세션 복구 중...')
      }
    }

    // 페이지 언로드 시 처리 (브라우저 완전 종료만)
    const handleUnload = () => {
      if (!isRefreshing) {
        // 실제 브라우저 종료 시에만 실행
        // 하지만 이 이벤트는 신뢰성이 떨어지므로 다른 방법을 사용
      }
    }

    // 페이지 가시성 변경 감지
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 탭이 다시 보일 때 세션 유효성 확인
        sessionStorage.setItem('eluo-last-activity', Date.now().toString())
      }
    }

    // 브라우저 완전 종료 감지를 위한 heartbeat 시스템
    const startHeartbeat = () => {
      setInterval(() => {
        if (user && !document.hidden) {
          sessionStorage.setItem('eluo-last-activity', Date.now().toString())
        }
      }, 30000) // 30초마다 업데이트
    }

    // 초기 설정
    handlePageLoad()
    startHeartbeat()

    // 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      subscription?.unsubscribe()
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const result = await auth.signIn(email, password)

      if (result.error) {
        console.error('로그인 오류:', result.error)
      } else {
        console.log('로그인 성공:', result.data)
      }

      return result
    } catch (error) {
      console.error('로그인 중 예외 발생:', error)
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, additionalData?: Record<string, unknown>) => {
    try {
      setLoading(true)
      const result = await auth.signUp(email, password, additionalData)

      if (result.error) {
        console.error('회원가입 오류:', result.error)
      } else {
        console.log('회원가입 성공:', result.data)
      }

      return result
    } catch (error) {
      console.error('회원가입 중 예외 발생:', error)
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const result = await auth.signOut()

      if (result.error) {
        console.error('로그아웃 오류:', result.error)
      } else {
        console.log('로그아웃 성공')
        // 상태 초기화
        setUser(null)
        setSession(null)
        setProfile(null)
        localStorage.removeItem('eluo-auth-token')
      }

      return result
    } catch (error) {
      console.error('로그아웃 중 예외 발생:', error)
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUser = async () => {
    try {
      const result = await auth.getCurrentUser()
      return result
    } catch (error) {
      console.error('사용자 정보 조회 중 오류:', error)
      return { data: { user: null }, error: error as AuthError }
    }
  }

  // 프로필 업데이트
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) {
      return { success: false, error: '로그인이 필요합니다.' }
    }

    try {
      const result = await profileSync.updateUserProfile(user.id, updates)
      if (result.success && result.profile) {
        setProfile(result.profile)
      }
      return result
    } catch (error) {
      console.error('프로필 업데이트 중 오류:', error)
      return { success: false, error }
    }
  }

  // 비밀번호 재설정
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        console.error('비밀번호 재설정 오류:', error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error('비밀번호 재설정 중 예외 발생:', error)
      return { error: error as AuthError }
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    getCurrentUser,
    updateProfile,
    refreshProfile,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      <SessionManager />
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }