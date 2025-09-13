import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export function SignupPage() {
  const { signUp, user, loading } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    terms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 이미 로그인된 경우 대시보드로 리다이렉트
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      setError('모든 필드를 입력해주세요.')
      return false
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return false
    }

    if (!formData.terms) {
      setError('서비스 약관에 동의해야 합니다.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const { error: authError } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName
      })

      if (authError) {
        if (authError.message.includes('User already registered')) {
          setError('이미 등록된 이메일입니다.')
        } else if (authError.message.includes('Password should be at least 6 characters')) {
          setError('비밀번호는 최소 6자 이상이어야 합니다.')
        } else if (authError.message.includes('Invalid email')) {
          setError('올바른 이메일 형식이 아닙니다.')
        } else {
          setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
      } else {
        setSuccess('회원가입이 완료되었습니다! 이메일을 확인하여 계정을 인증해주세요.')
        // 폼 초기화
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          terms: false
        })
      }
    } catch (error) {
      console.error('회원가입 오류:', error)
      setError('예상치 못한 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
            계정 생성
          </h1>

          <p
            className="linear-text-regular"
            style={{
              color: 'var(--linear-text-tertiary)',
              textAlign: 'center'
            }}
          >
            Eluo Platform에서 프로젝트 관리를 시작하세요
          </p>
        </div>

        {/* Signup Form */}
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

          {success && (
            <div
              className="flex items-center"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid var(--linear-accent-green)',
                borderRadius: 'var(--linear-radius-md)',
                padding: 'var(--linear-spacing-md)',
                marginBottom: 'var(--linear-spacing-lg)'
              }}
            >
              <CheckCircle
                style={{
                  color: 'var(--linear-accent-green)',
                  width: '20px',
                  height: '20px',
                  marginRight: 'var(--linear-spacing-xs)'
                }}
              />
              <span
                className="linear-text-regular"
                style={{ color: 'var(--linear-accent-green)' }}
              >
                {success}
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
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="linear-text-regular"
                style={{
                  display: 'block',
                  color: 'var(--linear-text-secondary)',
                  fontWeight: '510',
                  marginBottom: 'var(--linear-spacing-sm)'
                }}
              >
                이름
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="linear-input"
                placeholder="이름을 입력하세요"
                required
                disabled={isSubmitting}
              />
            </div>

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
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="linear-input"
                  style={{
                    paddingRight: '48px'
                  }}
                  placeholder="비밀번호를 입력하세요 (최소 6자)"
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
                    borderRadius: 'var(--linear-radius-sm)'
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="linear-text-regular"
                style={{
                  display: 'block',
                  color: 'var(--linear-text-secondary)',
                  fontWeight: '510',
                  marginBottom: 'var(--linear-spacing-sm)'
                }}
              >
                비밀번호 확인
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="linear-input"
                  style={{
                    paddingRight: '48px'
                  }}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    borderRadius: 'var(--linear-radius-sm)'
                  }}
                >
                  {showConfirmPassword ? (
                    <EyeOff style={{ width: '20px', height: '20px' }} />
                  ) : (
                    <Eye style={{ width: '20px', height: '20px' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.checked)}
                disabled={isSubmitting}
                style={{
                  marginRight: 'var(--linear-spacing-sm)',
                  marginTop: '2px'
                }}
              />
              <label
                htmlFor="terms"
                className="linear-text-small"
                style={{
                  color: 'var(--linear-text-secondary)',
                  lineHeight: '1.5'
                }}
              >
                <Link
                  to="/terms"
                  style={{
                    color: 'var(--linear-accent-blue)',
                    textDecoration: 'none'
                  }}
                >
                  서비스 약관
                </Link>
                과{' '}
                <Link
                  to="/privacy"
                  style={{
                    color: 'var(--linear-accent-blue)',
                    textDecoration: 'none'
                  }}
                >
                  개인정보 처리방침
                </Link>
                에 동의합니다.
              </label>
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
                  계정 생성 중...
                </div>
              ) : (
                '계정 생성'
              )}
            </button>
          </form>

          {/* Login Link */}
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
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--linear-accent-blue)',
                  fontWeight: '510',
                  textDecoration: 'none',
                  fontFamily: 'var(--linear-font-primary)',
                  transition: 'all var(--linear-animation-fast) var(--linear-ease-out)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.textDecoration = 'underline'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.textDecoration = 'none'
                }}
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}