import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, AlertCircle, RefreshCw, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying')
  const [error, setError] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState('')
  const [resendEmail, setResendEmail] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      if (type === 'signup' && token) {
        try {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          })

          if (verifyError) {
            if (verifyError.message.includes('expired')) {
              setStatus('expired')
            } else {
              setStatus('error')
              setError('이메일 인증에 실패했습니다.')
            }
          } else {
            setStatus('success')
            // 3초 후 대시보드로 이동
            setTimeout(() => {
              navigate('/dashboard', { replace: true })
            }, 3000)
          }
        } catch (error) {
          console.error('이메일 인증 오류:', error)
          setStatus('error')
          setError('예상치 못한 오류가 발생했습니다.')
        }
      } else {
        setStatus('error')
        setError('유효하지 않은 인증 링크입니다.')
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resendEmail) {
      setError('이메일을 입력해주세요.')
      return
    }

    setIsResending(true)
    setError('')
    setResendSuccess('')

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: resendEmail
      })

      if (resendError) {
        setError('인증 이메일 재전송 중 오류가 발생했습니다.')
      } else {
        setResendSuccess('인증 이메일이 다시 전송되었습니다. 이메일을 확인해주세요.')
        setResendEmail('')
      }
    } catch (error) {
      console.error('인증 이메일 재전송 오류:', error)
      setError('예상치 못한 오류가 발생했습니다.')
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '4px solid var(--linear-accent-blue)',
                borderTop: '4px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto var(--linear-spacing-lg)'
              }}
            />
            <h1
              className="linear-title-4"
              style={{
                color: 'var(--linear-text-primary)',
                marginBottom: 'var(--linear-spacing-sm)'
              }}
            >
              이메일 인증 중
            </h1>
            <p
              className="linear-text-regular"
              style={{
                color: 'var(--linear-text-tertiary)'
              }}
            >
              이메일 인증을 처리하고 있습니다. 잠시만 기다려주세요.
            </p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center">
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'var(--linear-accent-green)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--linear-spacing-lg)'
              }}
            >
              <CheckCircle
                style={{
                  width: '32px',
                  height: '32px',
                  color: 'white'
                }}
              />
            </div>
            <h1
              className="linear-title-4"
              style={{
                color: 'var(--linear-text-primary)',
                marginBottom: 'var(--linear-spacing-sm)'
              }}
            >
              이메일 인증 완료!
            </h1>
            <p
              className="linear-text-regular"
              style={{
                color: 'var(--linear-text-tertiary)',
                marginBottom: 'var(--linear-spacing-md)'
              }}
            >
              계정이 성공적으로 인증되었습니다.
            </p>
            <p
              className="linear-text-small"
              style={{
                color: 'var(--linear-text-muted)'
              }}
            >
              잠시 후 대시보드로 이동합니다...
            </p>
          </div>
        )

      case 'expired':
        return (
          <div className="text-center">
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'var(--linear-accent-orange)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--linear-spacing-lg)'
              }}
            >
              <Mail
                style={{
                  width: '32px',
                  height: '32px',
                  color: 'white'
                }}
              />
            </div>
            <h1
              className="linear-title-4"
              style={{
                color: 'var(--linear-text-primary)',
                marginBottom: 'var(--linear-spacing-sm)'
              }}
            >
              인증 링크 만료
            </h1>
            <p
              className="linear-text-regular"
              style={{
                color: 'var(--linear-text-tertiary)',
                marginBottom: 'var(--linear-spacing-lg)'
              }}
            >
              인증 링크가 만료되었습니다. 새로운 인증 이메일을 받아보세요.
            </p>

            {/* Resend Form */}
            {resendSuccess && (
              <div
                className="flex items-center"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid var(--linear-accent-green)',
                  borderRadius: 'var(--linear-radius-md)',
                  padding: 'var(--linear-spacing-md)',
                  marginBottom: 'var(--linear-spacing-lg)',
                  textAlign: 'left'
                }}
              >
                <CheckCircle
                  style={{
                    color: 'var(--linear-accent-green)',
                    width: '20px',
                    height: '20px',
                    marginRight: 'var(--linear-spacing-xs)',
                    flexShrink: 0
                  }}
                />
                <span
                  className="linear-text-regular"
                  style={{ color: 'var(--linear-accent-green)' }}
                >
                  {resendSuccess}
                </span>
              </div>
            )}

            <form onSubmit={handleResendEmail}>
              <div style={{ marginBottom: 'var(--linear-spacing-lg)' }}>
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="linear-input"
                  placeholder="이메일 주소를 입력하세요"
                  required
                  disabled={isResending}
                />
              </div>
              <button
                type="submit"
                disabled={isResending}
                className="linear-button-primary"
                style={{
                  opacity: isResending ? 0.6 : 1,
                  cursor: isResending ? 'not-allowed' : 'pointer',
                  width: '100%'
                }}
              >
                {isResending ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--linear-spacing-sm)'
                    }}
                  >
                    <RefreshCw
                      style={{
                        width: '16px',
                        height: '16px',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                    전송 중...
                  </div>
                ) : (
                  '인증 이메일 재전송'
                )}
              </button>
            </form>
          </div>
        )

      case 'error':
      default:
        return (
          <div className="text-center">
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'var(--linear-accent-red)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--linear-spacing-lg)'
              }}
            >
              <AlertCircle
                style={{
                  width: '32px',
                  height: '32px',
                  color: 'white'
                }}
              />
            </div>
            <h1
              className="linear-title-4"
              style={{
                color: 'var(--linear-text-primary)',
                marginBottom: 'var(--linear-spacing-sm)'
              }}
            >
              인증 실패
            </h1>
            <p
              className="linear-text-regular"
              style={{
                color: 'var(--linear-text-tertiary)',
                marginBottom: 'var(--linear-spacing-lg)'
              }}
            >
              {error || '이메일 인증에 실패했습니다.'}
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--linear-spacing-md)'
              }}
            >
              <button
                onClick={() => navigate('/signup')}
                className="linear-button-primary"
              >
                다시 회원가입
              </button>
              <button
                onClick={() => navigate('/login')}
                className="linear-button-secondary"
              >
                로그인 페이지로
              </button>
            </div>
          </div>
        )
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
        </div>

        {/* Content */}
        <div className="linear-card">
          {renderContent()}

          {error && status !== 'error' && (
            <div
              className="flex items-center"
              style={{
                background: 'rgba(235, 87, 87, 0.1)',
                border: '1px solid var(--linear-accent-red)',
                borderRadius: 'var(--linear-radius-md)',
                padding: 'var(--linear-spacing-md)',
                marginTop: 'var(--linear-spacing-lg)'
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
        </div>
      </div>
    </div>
  )
}