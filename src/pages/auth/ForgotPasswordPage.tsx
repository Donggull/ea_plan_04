import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('이메일을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (resetError) {
        if (resetError.message.includes('Invalid email')) {
          setError('올바른 이메일 형식이 아닙니다.')
        } else {
          setError('비밀번호 재설정 링크 전송 중 오류가 발생했습니다.')
        }
      } else {
        setSuccess('비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.')
        setEmail('')
      }
    } catch (error) {
      console.error('비밀번호 재설정 오류:', error)
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
        {/* Back to Login */}
        <div
          style={{
            marginBottom: 'var(--linear-spacing-lg)'
          }}
        >
          <Link
            to="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--linear-text-tertiary)',
              textDecoration: 'none',
              fontSize: 'var(--linear-text-sm)',
              fontWeight: '510',
              transition: 'color var(--linear-animation-fast) var(--linear-ease-out)'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = 'var(--linear-text-secondary)'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = 'var(--linear-text-tertiary)'
            }}
          >
            <ArrowLeft
              style={{
                width: '16px',
                height: '16px',
                marginRight: 'var(--linear-spacing-xs)'
              }}
            />
            로그인으로 돌아가기
          </Link>
        </div>

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
            비밀번호 재설정
          </h1>

          <p
            className="linear-text-regular"
            style={{
              color: 'var(--linear-text-tertiary)',
              textAlign: 'center'
            }}
          >
            가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
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
                  스팸 폴더도 확인해보세요. 이메일이 오지 않으면 다시 시도해주세요.
                </span>
              </div>
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
                placeholder="가입한 이메일을 입력하세요"
                required
                disabled={isSubmitting}
              />
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
                  전송 중...
                </div>
              ) : (
                '재설정 링크 전송'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div
            style={{
              textAlign: 'center',
              marginTop: 'var(--linear-spacing-lg)'
            }}
          >
            <p
              className="linear-text-small"
              style={{
                color: 'var(--linear-text-muted)',
                marginBottom: 'var(--linear-spacing-sm)'
              }}
            >
              계정이 기억나셨나요?{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--linear-accent-blue)',
                  fontWeight: '510',
                  textDecoration: 'none',
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
            <p
              className="linear-text-small"
              style={{
                color: 'var(--linear-text-muted)'
              }}
            >
              계정이 없으신가요?{' '}
              <Link
                to="/signup"
                style={{
                  color: 'var(--linear-accent-blue)',
                  fontWeight: '510',
                  textDecoration: 'none',
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
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}