/**
 * 사용자 프로필 동기화 유틸리티
 * Auth 사용자와 users 테이블 간의 동기화를 관리
 */

import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

type UserProfile = Database['public']['Tables']['profiles']['Row']
type UserProfileInsert = Database['public']['Tables']['profiles']['Insert']
type UserProfileUpdate = Database['public']['Tables']['profiles']['Update']

interface ProfileSyncOptions {
  skipIfExists?: boolean
  forceUpdate?: boolean
}

export const profileSync = {
  /**
   * Auth 사용자를 users 테이블에 동기화
   */
  syncUserProfile: async (authUser: User, options: ProfileSyncOptions = {}) => {
    const { skipIfExists = true, forceUpdate = false } = options

    try {
      // 기존 프로필 확인
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('프로필 조회 오류:', fetchError)
        return { success: false, error: fetchError }
      }

      // 이미 존재하고 skipIfExists가 true이면 건너뛰기
      if (existingProfile && skipIfExists && !forceUpdate) {
        return { success: true, profile: existingProfile }
      }

      const profileData: UserProfileInsert = {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.full_name || null,
        avatar_url: authUser.user_metadata?.avatar_url || null,
        role: 'user',
        last_login_at: authUser.last_sign_in_at || null,
        preferences: authUser.user_metadata || {},
        updated_at: new Date().toISOString()
      }

      let result
      if (existingProfile) {
        // 업데이트
        const updateData: UserProfileUpdate = {
          email: profileData.email,
          name: profileData.name,
          avatar_url: profileData.avatar_url,
          last_login_at: profileData.last_login_at,
          preferences: profileData.preferences,
          updated_at: profileData.updated_at
        }

        result = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', authUser.id)
          .select()
          .single()
      } else {
        // 삽입
        result = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single()
      }

      if (result.error) {
        console.error('프로필 동기화 오류:', result.error)
        return { success: false, error: result.error }
      }

      return { success: true, profile: result.data }

    } catch (error) {
      console.error('프로필 동기화 중 예외 발생:', error)
      return { success: false, error }
    }
  },

  /**
   * 사용자 프로필 가져오기
   */
  getUserProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('사용자 프로필 조회 오류:', error)
        return { success: false, error }
      }

      return { success: true, profile: data }

    } catch (error) {
      console.error('사용자 프로필 조회 중 예외 발생:', error)
      return { success: false, error }
    }
  },

  /**
   * 사용자 프로필 업데이트
   */
  updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('사용자 프로필 업데이트 오류:', error)
        return { success: false, error }
      }

      return { success: true, profile: data }

    } catch (error) {
      console.error('사용자 프로필 업데이트 중 예외 발생:', error)
      return { success: false, error }
    }
  },

  /**
   * 마지막 로그인 시간 업데이트
   */
  updateLastSignIn: async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          last_sign_in_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('마지막 로그인 시간 업데이트 오류:', error)
        return { success: false, error }
      }

      return { success: true }

    } catch (error) {
      console.error('마지막 로그인 시간 업데이트 중 예외 발생:', error)
      return { success: false, error }
    }
  },

  /**
   * 이메일 인증 상태 업데이트
   */
  updateEmailVerified: async (userId: string, verified: boolean = true) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email_verified: verified,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('이메일 인증 상태 업데이트 오류:', error)
        return { success: false, error }
      }

      return { success: true }

    } catch (error) {
      console.error('이메일 인증 상태 업데이트 중 예외 발생:', error)
      return { success: false, error }
    }
  },

  /**
   * 사용자 삭제 (Soft Delete)
   */
  deleteUser: async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('사용자 삭제 오류:', error)
        return { success: false, error }
      }

      return { success: true }

    } catch (error) {
      console.error('사용자 삭제 중 예외 발생:', error)
      return { success: false, error }
    }
  }
}

// 프로필 유효성 검사 유틸리티
export const profileValidation = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isValidFullName: (name: string): boolean => {
    return name.length >= 2 && name.length <= 100
  },

  sanitizeProfileData: (data: Partial<UserProfile>) => {
    const sanitized: Partial<UserProfile> = {}

    if (data.name) {
      sanitized.name = data.name.trim().substring(0, 100)
    }

    if (data.email && profileValidation.isValidEmail(data.email)) {
      sanitized.email = data.email.toLowerCase().trim()
    }

    if (data.avatar_url) {
      sanitized.avatar_url = data.avatar_url.trim()
    }

    return sanitized
  }
}