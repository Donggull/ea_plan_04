import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { auth } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>
  signUp: (email: string, password: string, additionalData?: Record<string, any>) => Promise<{ error: any; data?: any }>
  signOut: () => Promise<{ error: any }>
  getCurrentUser: () => Promise<{ data: { user: User | null }; error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

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

        // 브라우저 종료 시 세션 종료 처리
        if (event === 'SIGNED_OUT') {
          // 로컬 스토리지에서 세션 정보 제거
          localStorage.removeItem('eluo-auth-token')
          setUser(null)
          setSession(null)
        }
      }
    )

    // 브라우저 창/탭 종료 시 세션 종료 처리
    const handleBeforeUnload = () => {
      // 다른 탭이 열려있지 않은 경우에만 세션 종료
      if (window.name === 'main-window') {
        auth.signOut()
      }
    }

    // 페이지 로드 시 메인 윈도우로 표시
    if (!window.name) {
      window.name = 'main-window'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      subscription?.unsubscribe()
      window.removeEventListener('beforeunload', handleBeforeUnload)
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
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, additionalData?: Record<string, any>) => {
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
      return { error }
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
        localStorage.removeItem('eluo-auth-token')
      }

      return result
    } catch (error) {
      console.error('로그아웃 중 예외 발생:', error)
      return { error }
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
      return { data: { user: null }, error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    getCurrentUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}