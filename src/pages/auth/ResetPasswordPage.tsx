import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)

  useEffect(() => {
    // URL에서 토큰 확인
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')

    if (accessToken && refreshToken) {
      // 세션 설정
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ error }) => {
        if (error) {
          setError('유효하지 않은 재설정 링크입니다.')
        } else {
          setIsValidSession(true)
        }
      })
    } else {
      setError('유효하지 않은 재설정 링크입니다.')
    }
  }, [searchParams])

  const validateForm = () => {
    if (!formData.password || !formData.confirmPassword) {
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
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      })

      if (updateError) {
        if (updateError.message.includes('Password should be at least 6 characters')) {
          setError('비밀번호는 최소 6자 이상이어야 합니다.')
        } else if (updateError.message.includes('session_not_found')) {
          setError('세션이 만료되었습니다. 비밀번호 재설정을 다시 요청해주세요.')
        } else {
          setError('비밀번호 변경 중 오류가 발생했습니다.')
        }
      } else {
        setSuccess('비밀번호가 성공적으로 변경되었습니다.')

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error)
      setError('예상치 못한 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isValidSession && !error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'var(--linear-bg-primary)',
          fontFamily: 'var(--linear-font-primary)',
          padding: 'var(--linear-spacing-lg)'
        }}
      >
        <div className="linear-card" style={{ maxWidth: '420px' }}>
          <div className="text-center">
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid var(--linear-accent-blue)',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto var(--linear-spacing-md)'
              }}
            ></div>
            <p className="linear-text-regular" style={{ color: 'var(--linear-text-secondary)' }}>
              재설정 링크를 확인하는 중...
            </p>
          </div>
        </div>
      </div>
    )
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
            새 비밀번호 설정
          </h1>

          <p
            className="linear-text-regular"
            style={{
              color: 'var(--linear-text-tertiary)',
              textAlign: 'center'
            }}
          >
            안전한 새 비밀번호를 설정해주세요.
          </p>
        </div>

        {/* Form */}
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
              className="flex items-start"
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
                  marginRight: 'var(--linear-spacing-xs)',
                  marginTop: '2px',
                  flexShrink: 0
                }}
              />
              <div>
                <span
                  className="linear-text-regular"
                  style={{
                    color: 'var(--linear-accent-green)',
                    display: 'block',
                    marginBottom: 'var(--linear-spacing-xs)'
                  }}
                >
                  {success}
                </span>
                <span
                  className="linear-text-small"
                  style={{
                    color: 'var(--linear-text-tertiary)',
                    display: 'block'
                  }}
                >
                  잠시 후 로그인 페이지로 이동합니다.
                </span>
              </div>
            </div>
          )}

          {isValidSession && !success && (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--linear-spacing-lg)'
              }}
            >
              {/* New Password Field */}
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
                  새 비밀번호
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
                    placeholder="새 비밀번호를 입력하세요 (최소 6자)"
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
                    placeholder="새 비밀번호를 다시 입력하세요"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="linear-button-primary"
                style={{
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  width: '100%'
                }}
              >
                {isSubmitting ? (
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
                    변경 중...
                  </div>
                ) : (
                  '비밀번호 변경'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}