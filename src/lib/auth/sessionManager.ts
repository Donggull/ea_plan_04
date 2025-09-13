/**
 * 세션 관리자
 * 토큰 갱신, 세션 유지, 만료 처리
 */

import { supabase } from '@/lib/supabase/client'
import type { Session, AuthError } from '@supabase/supabase-js'
import { AUTH_CONSTANTS } from './index'

class SessionManager {
  private refreshTimer: NodeJS.Timeout | null = null
  private sessionCheckInterval: NodeJS.Timeout | null = null
  private retryCount = 0

  /**
   * 세션 초기화 및 자동 갱신 설정
   */
  async initializeSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('세션 초기화 오류:', error)
        return { session: null, error }
      }

      if (data.session) {
        this.setupAutoRefresh(data.session)
        this.startSessionCheck()
      }

      return { session: data.session, error: null }

    } catch (error) {
      console.error('세션 초기화 중 예외 발생:', error)
      return { session: null, error: error as AuthError }
    }
  }

  /**
   * 자동 토큰 갱신 설정
   */
  private setupAutoRefresh(session: Session) {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
    }

    const expiresAt = session.expires_at
    if (!expiresAt) return

    const expiresIn = (expiresAt * 1000) - Date.now()
    const refreshAt = expiresIn - AUTH_CONSTANTS.SESSION.REFRESH_THRESHOLD

    if (refreshAt > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshSession()
      }, refreshAt)

      console.log(`토큰 갱신 예정: ${new Date(Date.now() + refreshAt).toLocaleString()}`)
    } else {
      // 이미 만료되었거나 곧 만료되는 경우 즉시 갱신
      this.refreshSession()
    }
  }

  /**
   * 세션 갱신
   */
  async refreshSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      console.log('토큰 갱신 시도...')

      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('토큰 갱신 오류:', error)
        this.retryCount++

        if (this.retryCount < AUTH_CONSTANTS.SESSION.MAX_RETRY_COUNT) {
          console.log(`토큰 갱신 재시도 (${this.retryCount}/${AUTH_CONSTANTS.SESSION.MAX_RETRY_COUNT})`)

          // 지수 백오프로 재시도
          setTimeout(() => {
            this.refreshSession()
          }, Math.pow(2, this.retryCount) * 1000)

          return { session: null, error }
        } else {
          // 최대 재시도 횟수 초과시 세션 만료 처리
          console.error('토큰 갱신 최대 재시도 초과, 세션 만료 처리')
          this.handleSessionExpired()
          return { session: null, error }
        }
      }

      if (data.session) {
        console.log('토큰 갱신 성공')
        this.retryCount = 0
        this.setupAutoRefresh(data.session)
        this.updateStoredSession(data.session)
      }

      return { session: data.session, error: null }

    } catch (error) {
      console.error('토큰 갱신 중 예외 발생:', error)
      return { session: null, error: error as AuthError }
    }
  }

  /**
   * 세션 상태 주기적 확인
   */
  private startSessionCheck() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval)
    }

    this.sessionCheckInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        console.log('세션이 만료되었습니다.')
        this.handleSessionExpired()
      }
    }, 60000) // 1분마다 확인
  }

  /**
   * 세션 만료 처리
   */
  private handleSessionExpired() {
    this.cleanup()
    this.clearStoredSession()

    // 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('session-expired'))

    // 로그인 페이지로 리다이렉트 (현재 페이지가 공개 페이지가 아닌 경우)
    const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email']
    const currentPath = window.location.pathname

    if (!publicPaths.includes(currentPath)) {
      window.location.href = '/login'
    }
  }

  /**
   * 저장된 세션 정보 업데이트
   */
  private updateStoredSession(session: Session) {
    try {
      localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN, session.access_token)
      localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, session.refresh_token)

      if (session.expires_at) {
        localStorage.setItem(
          AUTH_CONSTANTS.STORAGE_KEYS.SESSION_TIMEOUT,
          (session.expires_at * 1000).toString()
        )
      }
    } catch (error) {
      console.error('세션 저장 중 오류:', error)
    }
  }

  /**
   * 저장된 세션 정보 제거
   */
  private clearStoredSession() {
    try {
      localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.SESSION_TIMEOUT)
    } catch (error) {
      console.error('세션 정보 제거 중 오류:', error)
    }
  }

  /**
   * 세션이 유효한지 확인
   */
  isSessionValid(): boolean {
    try {
      const expiresAt = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.SESSION_TIMEOUT)

      if (!expiresAt) {
        return false
      }

      const expiryTime = parseInt(expiresAt)
      return Date.now() < expiryTime
    } catch {
      return false
    }
  }

  /**
   * 세션이 곧 만료되는지 확인
   */
  isSessionExpiringSoon(): boolean {
    try {
      const expiresAt = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.SESSION_TIMEOUT)

      if (!expiresAt) {
        return true
      }

      const expiryTime = parseInt(expiresAt)
      const timeUntilExpiry = expiryTime - Date.now()

      return timeUntilExpiry <= AUTH_CONSTANTS.SESSION.REFRESH_THRESHOLD
    } catch {
      return true
    }
  }

  /**
   * 수동으로 세션 갱신 트리거
   */
  async forceRefresh(): Promise<{ success: boolean; error?: AuthError }> {
    const result = await this.refreshSession()
    return {
      success: !result.error,
      error: result.error || undefined
    }
  }

  /**
   * 세션 정리
   */
  cleanup() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }

    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval)
      this.sessionCheckInterval = null
    }

    this.retryCount = 0
  }

  /**
   * 세션 통계 조회
   */
  getSessionStats() {
    const expiresAt = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.SESSION_TIMEOUT)

    if (!expiresAt) {
      return {
        isValid: false,
        expiresAt: null,
        timeUntilExpiry: null,
        isExpiringSoon: true
      }
    }

    const expiryTime = parseInt(expiresAt)
    const timeUntilExpiry = expiryTime - Date.now()

    return {
      isValid: timeUntilExpiry > 0,
      expiresAt: new Date(expiryTime),
      timeUntilExpiry: Math.max(0, timeUntilExpiry),
      isExpiringSoon: timeUntilExpiry <= AUTH_CONSTANTS.SESSION.REFRESH_THRESHOLD
    }
  }
}

export const sessionManager = new SessionManager()