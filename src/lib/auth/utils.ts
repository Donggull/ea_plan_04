/**
 * 인증 유틸리티 함수들
 */

import type { AuthError } from '@supabase/supabase-js'
import { AUTH_CONSTANTS } from './index'

export const authUtils = {
  /**
   * Auth 에러 메시지 한국어 변환
   */
  getErrorMessage: (error: AuthError | Error | string): string => {
    if (typeof error === 'string') {
      return error
    }

    const message = error.message || ''

    // Supabase Auth 에러 메시지 매핑
    const errorMappings: Record<string, string> = {
      // 로그인 관련
      'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
      'Email not confirmed': '이메일 인증이 필요합니다. 이메일을 확인해주세요.',
      'Invalid email or password': '이메일 또는 비밀번호가 올바르지 않습니다.',
      'Too many requests': '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',

      // 회원가입 관련
      'User already registered': '이미 등록된 이메일입니다.',
      'Password should be at least 6 characters': '비밀번호는 최소 6자 이상이어야 합니다.',
      'Invalid email': '올바른 이메일 형식이 아닙니다.',
      'Signup requires a valid password': '올바른 비밀번호를 입력해주세요.',

      // 비밀번호 재설정 관련
      'Invalid reset token': '유효하지 않은 재설정 토큰입니다.',
      'Password reset token has expired': '비밀번호 재설정 토큰이 만료되었습니다.',

      // 세션 관련
      'Invalid session': '유효하지 않은 세션입니다.',
      'Session expired': '세션이 만료되었습니다.',
      'Invalid refresh token': '유효하지 않은 갱신 토큰입니다.',
      'Refresh token not found': '갱신 토큰을 찾을 수 없습니다.',

      // 일반적인 오류
      'Network error': '네트워크 연결을 확인해주세요.',
      'Internal server error': '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      'Service unavailable': '서비스를 일시적으로 사용할 수 없습니다.'
    }

    // 정확한 매칭 먼저 시도
    if (errorMappings[message]) {
      return errorMappings[message]
    }

    // 부분 매칭 시도
    for (const [key, value] of Object.entries(errorMappings)) {
      if (message.includes(key)) {
        return value
      }
    }

    // 기본 메시지
    return '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.'
  },

  /**
   * 이메일 마스킹
   */
  maskEmail: (email: string): string => {
    const [local, domain] = email.split('@')
    if (!local || !domain) return email

    const maskedLocal = local.length <= 2
      ? local
      : local.substring(0, 2) + '*'.repeat(local.length - 2)

    return `${maskedLocal}@${domain}`
  },

  /**
   * 인증 상태 확인
   */
  getAuthStatus: (): {
    isLoggedIn: boolean
    hasValidToken: boolean
    isExpiringSoon: boolean
  } => {
    try {
      const token = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN)
      const expiresAt = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.SESSION_TIMEOUT)

      const hasValidToken = Boolean(token)
      const isLoggedIn = hasValidToken && Boolean(expiresAt)

      let isExpiringSoon = true

      if (expiresAt) {
        const expiryTime = parseInt(expiresAt)
        const timeUntilExpiry = expiryTime - Date.now()
        isExpiringSoon = timeUntilExpiry <= AUTH_CONSTANTS.SESSION.REFRESH_THRESHOLD
      }

      return {
        isLoggedIn,
        hasValidToken,
        isExpiringSoon
      }
    } catch {
      return {
        isLoggedIn: false,
        hasValidToken: false,
        isExpiringSoon: true
      }
    }
  },

  /**
   * 리다이렉트 URL 관리
   */
  redirectUrl: {
    /**
     * 로그인 후 리다이렉트할 URL 저장
     */
    save: (url: string) => {
      try {
        sessionStorage.setItem('auth-redirect-url', url)
      } catch {
        // sessionStorage 접근 실패 시 무시
      }
    },

    /**
     * 저장된 리다이렉트 URL 가져오기 및 제거
     */
    getAndClear: (): string => {
      try {
        const url = sessionStorage.getItem('auth-redirect-url')
        sessionStorage.removeItem('auth-redirect-url')
        return url || '/dashboard'
      } catch {
        return '/dashboard'
      }
    },

    /**
     * 현재 URL이 리다이렉트 가능한지 확인
     */
    isValidRedirect: (url: string): boolean => {
      try {
        const urlObj = new URL(url, window.location.origin)

        // 현재 도메인인지 확인
        if (urlObj.origin !== window.location.origin) {
          return false
        }

        // 인증 페이지는 리다이렉트 불가
        const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email']
        if (authPaths.includes(urlObj.pathname)) {
          return false
        }

        return true
      } catch {
        return false
      }
    }
  },

  /**
   * 디바이스 정보 수집
   */
  getDeviceInfo: () => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`
    }
  },

  /**
   * 보안 헤더 생성
   */
  getSecurityHeaders: () => {
    return {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Client-Version': '1.0.0',
      'X-Timestamp': Date.now().toString()
    }
  },

  /**
   * 비밀번호 강도 표시 유틸리티
   */
  passwordStrength: {
    /**
     * 강도에 따른 색상 반환
     */
    getColor: (strength: 'weak' | 'medium' | 'strong'): string => {
      switch (strength) {
        case 'weak': return '#ef4444' // red-500
        case 'medium': return '#f59e0b' // amber-500
        case 'strong': return '#10b981' // emerald-500
      }
    },

    /**
     * 강도에 따른 라벨 반환
     */
    getLabel: (strength: 'weak' | 'medium' | 'strong'): string => {
      switch (strength) {
        case 'weak': return '약함'
        case 'medium': return '보통'
        case 'strong': return '강함'
      }
    },

    /**
     * 강도에 따른 진행률 반환
     */
    getProgress: (strength: 'weak' | 'medium' | 'strong'): number => {
      switch (strength) {
        case 'weak': return 33
        case 'medium': return 66
        case 'strong': return 100
      }
    }
  },

  /**
   * 로깅 유틸리티
   */
  logger: {
    /**
     * 인증 이벤트 로깅
     */
    logAuthEvent: (event: string, data?: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Auth Event] ${event}`, data)
      }

      // 프로덕션 환경에서는 외부 로깅 서비스로 전송
      // 예: Sentry, LogRocket, DataDog 등
    },

    /**
     * 에러 로깅
     */
    logError: (error: Error | AuthError, context?: string) => {
      const errorData = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }

      console.error('[Auth Error]', errorData)

      // 프로덕션 환경에서는 외부 에러 추적 서비스로 전송
    }
  },

  /**
   * 캐시 관리
   */
  cache: {
    /**
     * 인증 관련 캐시 모두 제거
     */
    clearAll: () => {
      const keys = Object.values(AUTH_CONSTANTS.STORAGE_KEYS)
      keys.forEach(key => {
        try {
          localStorage.removeItem(key)
          sessionStorage.removeItem(key)
        } catch {
          // 스토리지 접근 실패 시 무시
        }
      })
    },

    /**
     * 임시 데이터 정리
     */
    clearTemporary: () => {
      try {
        sessionStorage.removeItem('auth-redirect-url')
        sessionStorage.removeItem('auth-temp-email')
        sessionStorage.removeItem('auth-temp-data')
      } catch {
        // 스토리지 접근 실패 시 무시
      }
    }
  }
}