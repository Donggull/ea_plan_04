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
        fontFamily: 'var(--linear-font-primary)',
        padding: 'var(--linear-spacing-lg)'
      }}
    >
      <div
        className="linear-container w-full"
        style={{
          maxWidth: '420px'
        }}
      >
        {/* Header */}
        <div
          className="text-center"
          style={{
            marginBottom: 'var(--linear-spacing-xl)'
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, var(--linear-accent-blue), var(--linear-accent-indigo))',
              borderRadius: 'var(--linear-radius-xl)',
              margin: '0 auto',
              marginBottom: 'var(--linear-spacing-lg)'
            }}
          >
            <span
              className="linear-title-3"
              style={{
                color: 'white',
                fontFamily: 'var(--linear-font-primary)',
                fontWeight: '680'
              }}
            >
              E
            </span>
          </div>

          <h1
            className="linear-title-4"
            style={{
              color: 'var(--linear-text-primary)',
              textAlign: 'center',
              marginBottom: 'var(--linear-spacing-sm)'
            }}
          >
            Eluo Platform
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
        <div className="linear-card">
          {error && (
            <div
              className="flex items-center"
              style={{
                background: 'rgba(235, 87, 87, 0.1)',
                border: '1px solid var(--linear-accent-red)',
                borderRadius: 'var(--linear-radius-md)',
                padding: 'var(--linear-spacing-md)',
                marginBottom: 'var(--linear-spacing-lg)'
              }}
            >
              <AlertCircle
                style={{
                  color: 'var(--linear-accent-red)',
                  width: '20px',
                  height: '20px',
                  marginRight: 'var(--linear-spacing-xs)'
                }}
              />
              <span
                className="linear-text-regular"
                style={{ color: 'var(--linear-accent-red)' }}
              >
                {error}
              </span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--linear-spacing-lg)'
            }}
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="linear-text-regular"
                style={{
                  display: 'block',
                  color: 'var(--linear-text-secondary)',
                  fontWeight: '510',
                  marginBottom: 'var(--linear-spacing-sm)'
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
                className="linear-text-regular"
                style={{
                  display: 'block',
                  color: 'var(--linear-text-secondary)',
                  fontWeight: '510',
                  marginBottom: 'var(--linear-spacing-sm)'
                }}
              >
                비밀번호
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="linear-input"
                  style={{
                    paddingRight: '48px'
                  }}
                  placeholder="비밀번호를 입력하세요"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  style={{
                    position: 'absolute',
                    right: 'var(--linear-spacing-xs)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--linear-text-tertiary)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    padding: 'var(--linear-spacing-sm)',
                    borderRadius: 'var(--linear-radius-sm)',
                    transition: 'color var(--linear-animation-fast) var(--linear-ease-out)'
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: '20px', height: '20px' }} />
                  ) : (
                    <Eye style={{ width: '20px', height: '20px' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="linear-button-primary"
              style={{
                opacity: isSubmitting || loading ? 0.6 : 1,
                cursor: isSubmitting || loading ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {isSubmitting || loading ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--linear-spacing-sm)'
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRight: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
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
          <div
            style={{
              textAlign: 'center',
              marginTop: 'var(--linear-spacing-lg)'
            }}
          >
            <p
              className="linear-text-small"
              style={{
                color: 'var(--linear-text-muted)'
              }}
            >
              아직 계정이 없으신가요?{' '}
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--linear-accent-blue)',
                  fontWeight: '510',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontFamily: 'var(--linear-font-primary)',
                  fontSize: 'inherit',
                  transition: 'all var(--linear-animation-fast) var(--linear-ease-out)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.textDecoration = 'underline'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.textDecoration = 'none'
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