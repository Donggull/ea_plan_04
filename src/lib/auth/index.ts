/**
 * 향상된 인증 시스템
 * Phase 2: 완전한 Supabase Auth 구현
 */

export { profileSync, profileValidation } from './profileSync'
export { sessionManager } from './sessionManager'
export { authValidation } from './validation'
export { authUtils } from './utils'

// 인증 상수
export const AUTH_CONSTANTS = {
  STORAGE_KEYS: {
    AUTH_TOKEN: 'eluo-auth-token',
    REFRESH_TOKEN: 'eluo-refresh-token',
    SESSION_TIMEOUT: 'eluo-session-timeout'
  },
  SESSION: {
    DEFAULT_TIMEOUT: 24 * 60 * 60 * 1000, // 24시간
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5분 전 갱신
    MAX_RETRY_COUNT: 3
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  EMAIL: {
    MAX_LENGTH: 320
  }
} as const

// 인증 이벤트 타입
export type AuthEvent =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY'
  | 'SESSION_EXPIRED'