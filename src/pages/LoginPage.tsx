import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

export function LoginPage() {
  const { signIn, user, loading } = useAuth()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 이미 로그인된 경우 대시보드로 리다이렉트
  if (user) {
    const from = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const { error: authError } = await signIn(email, password)

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('이메일 인증이 필요합니다. 이메일을 확인해주세요.')
        } else {
          setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      setError('예상치 못한 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'var(--linear-bg-primary)',
        fontFamily: 'var(--linear-font-primary)'
      }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="flex items-center justify-center mb-6"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, var(--linear-accent-blue), var(--linear-accent-indigo))',
              borderRadius: 'var(--linear-radius-lg)',
              margin: '0 auto'
            }}
          >
            <span
              className="text-2xl font-bold text-white"
              style={{
                fontFamily: 'var(--linear-font-primary)',
                fontWeight: '680'
              }}
            >
              E
            </span>
          </div>

          <h1
            className="linear-title-4 mb-2"
            style={{
              color: 'var(--linear-text-primary)',
              textAlign: 'center'
            }}
          >
            ELUO Platform
          </h1>

          <p
            className="linear-text-regular"
            style={{
              color: 'var(--linear-text-tertiary)',
              textAlign: 'center'
            }}
          >
            AI 통합 프로젝트 관리 플랫폼에 오신 것을 환영합니다
          </p>
        </div>

        {/* Login Form */}
        <div
          className="linear-card"
          style={{
            background: 'var(--linear-bg-secondary)',
            border: '1px solid var(--linear-border-primary)',
            borderRadius: 'var(--linear-radius-lg)',
            padding: 'var(--linear-spacing-xl)'
          }}
        >
          {error && (
            <div
              className="flex items-center p-4 mb-6 rounded-lg"
              style={{
                background: 'rgba(235, 87, 87, 0.1)',
                border: '1px solid var(--linear-accent-red)',
                borderRadius: 'var(--linear-radius-md)'
              }}
            >
              <AlertCircle
                className="w-5 h-5 mr-3"
                style={{ color: 'var(--linear-accent-red)' }}
              />
              <span
                className="linear-text-regular"
                style={{ color: 'var(--linear-accent-red)' }}
              >
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block linear-text-regular mb-2"
                style={{
                  color: 'var(--linear-text-secondary)',
                  fontWeight: '510'
                }}
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="linear-input"
                placeholder="이메일을 입력하세요"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block linear-text-regular mb-2"
                style={{
                  color: 'var(--linear-text-secondary)',
                  fontWeight: '510'
                }}
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="linear-input pr-12"
                  placeholder="비밀번호를 입력하세요"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                  style={{
                    color: 'var(--linear-text-tertiary)'
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="linear-button-primary w-full"
              style={{
                opacity: isSubmitting || loading ? 0.6 : 1,
                cursor: isSubmitting || loading ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting || loading ? (
                <div className="flex items-center justify-center">
                  <div
                    className="animate-spin rounded-full h-4 w-4 border-2 border-transparent mr-2"
                    style={{
                      borderTopColor: 'white',
                      borderRightColor: 'white'
                    }}
                  ></div>
                  로그인 중...
                </div>
              ) : (
                '로그인'
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p
              className="linear-text-small"
              style={{
                color: 'var(--linear-text-muted)'
              }}
            >
              아직 계정이 없으신가요?{' '}
              <button
                className="font-medium hover:underline"
                style={{
                  color: 'var(--linear-accent-blue)',
                  fontWeight: '510'
                }}
              >
                회원가입
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}