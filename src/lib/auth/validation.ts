/**
 * 인증 유효성 검사 유틸리티
 */

import { AUTH_CONSTANTS } from './index'

export const authValidation = {
  /**
   * 이메일 유효성 검사
   */
  validateEmail: (email: string): { isValid: boolean; error?: string } => {
    if (!email) {
      return { isValid: false, error: '이메일을 입력해주세요.' }
    }

    if (email.length > AUTH_CONSTANTS.EMAIL.MAX_LENGTH) {
      return { isValid: false, error: '이메일이 너무 깁니다.' }
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!emailRegex.test(email)) {
      return { isValid: false, error: '올바른 이메일 형식이 아닙니다.' }
    }

    return { isValid: true }
  },

  /**
   * 비밀번호 유효성 검사
   */
  validatePassword: (password: string): { isValid: boolean; error?: string; strength?: 'weak' | 'medium' | 'strong' } => {
    if (!password) {
      return { isValid: false, error: '비밀번호를 입력해주세요.' }
    }

    if (password.length < AUTH_CONSTANTS.PASSWORD.MIN_LENGTH) {
      return { isValid: false, error: `비밀번호는 최소 ${AUTH_CONSTANTS.PASSWORD.MIN_LENGTH}자 이상이어야 합니다.` }
    }

    if (password.length > AUTH_CONSTANTS.PASSWORD.MAX_LENGTH) {
      return { isValid: false, error: '비밀번호가 너무 깁니다.' }
    }

    // 비밀번호 강도 검사
    const strength = authValidation.getPasswordStrength(password)

    return { isValid: true, strength }
  },

  /**
   * 비밀번호 강도 측정
   */
  getPasswordStrength: (password: string): 'weak' | 'medium' | 'strong' => {
    let score = 0

    // 길이
    if (password.length >= 8) score++
    if (password.length >= 12) score++

    // 문자 종류
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    // 패턴 검사
    if (!/(.)\1{2,}/.test(password)) score++ // 연속된 문자 없음
    if (!/123|abc|qwe/i.test(password)) score++ // 일반적인 패턴 없음

    if (score >= 6) return 'strong'
    if (score >= 4) return 'medium'
    return 'weak'
  },

  /**
   * 이름 유효성 검사
   */
  validateName: (name: string): { isValid: boolean; error?: string } => {
    if (!name) {
      return { isValid: false, error: '이름을 입력해주세요.' }
    }

    const trimmedName = name.trim()

    if (trimmedName.length < 2) {
      return { isValid: false, error: '이름은 최소 2자 이상이어야 합니다.' }
    }

    if (trimmedName.length > 100) {
      return { isValid: false, error: '이름이 너무 깁니다.' }
    }

    // 특수문자 제한 (기본적인 문자만 허용)
    const nameRegex = /^[a-zA-Z가-힣\s'-]+$/

    if (!nameRegex.test(trimmedName)) {
      return { isValid: false, error: '이름에 올바르지 않은 문자가 포함되어 있습니다.' }
    }

    return { isValid: true }
  },

  /**
   * 회원가입 폼 유효성 검사
   */
  validateSignupForm: (data: {
    email: string
    password: string
    confirmPassword: string
    fullName: string
    terms: boolean
  }): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}

    // 이메일 검사
    const emailValidation = authValidation.validateEmail(data.email)
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!
    }

    // 비밀번호 검사
    const passwordValidation = authValidation.validatePassword(data.password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error!
    }

    // 비밀번호 확인
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    // 이름 검사
    const nameValidation = authValidation.validateName(data.fullName)
    if (!nameValidation.isValid) {
      errors.fullName = nameValidation.error!
    }

    // 약관 동의 검사
    if (!data.terms) {
      errors.terms = '서비스 약관에 동의해야 합니다.'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  /**
   * 로그인 폼 유효성 검사
   */
  validateLoginForm: (data: {
    email: string
    password: string
  }): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}

    // 이메일 검사
    const emailValidation = authValidation.validateEmail(data.email)
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!
    }

    // 비밀번호 입력 여부만 검사 (로그인시에는 강도 검사 불필요)
    if (!data.password) {
      errors.password = '비밀번호를 입력해주세요.'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  /**
   * 비밀번호 재설정 폼 유효성 검사
   */
  validateResetPasswordForm: (data: {
    password: string
    confirmPassword: string
  }): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}

    // 비밀번호 검사
    const passwordValidation = authValidation.validatePassword(data.password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error!
    }

    // 비밀번호 확인
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  /**
   * 보안 검사 유틸리티
   */
  security: {
    /**
     * 일반적인 약한 비밀번호 검사
     */
    isCommonPassword: (password: string): boolean => {
      const commonPasswords = [
        'password', '123456', '123456789', 'qwerty', 'abc123',
        'password123', 'admin', 'letmein', 'welcome', 'monkey',
        '1234567890', 'password1', '123123', 'qwertyuiop'
      ]

      return commonPasswords.includes(password.toLowerCase())
    },

    /**
     * 개인정보 포함 여부 검사
     */
    containsPersonalInfo: (password: string, email: string, name: string): boolean => {
      const lowerPassword = password.toLowerCase()
      const emailLocal = email.split('@')[0].toLowerCase()
      const lowerName = name.toLowerCase()

      return lowerPassword.includes(emailLocal) ||
             lowerPassword.includes(lowerName) ||
             lowerName.includes(lowerPassword)
    },

    /**
     * 순차적 문자열 검사
     */
    hasSequentialChars: (password: string): boolean => {
      const sequences = [
        'abcdefghijklmnopqrstuvwxyz',
        '0123456789',
        'qwertyuiopasdfghjklzxcvbnm'
      ]

      for (const sequence of sequences) {
        for (let i = 0; i <= sequence.length - 3; i++) {
          const substring = sequence.substring(i, i + 3)
          if (password.toLowerCase().includes(substring) ||
              password.toLowerCase().includes(substring.split('').reverse().join(''))) {
            return true
          }
        }
      }

      return false
    }
  }
}