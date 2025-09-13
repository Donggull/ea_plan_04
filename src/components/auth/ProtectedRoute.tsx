import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // 로딩 중일 때는 스피너 표시
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          background: 'var(--linear-bg-primary)',
          color: 'var(--linear-text-primary)'
        }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-8 w-8 border-2 border-transparent mx-auto mb-4"
            style={{
              borderTopColor: 'var(--linear-accent-blue)',
              borderRightColor: 'var(--linear-accent-blue)'
            }}
          ></div>
          <p
            className="linear-text-regular"
            style={{ color: 'var(--linear-text-secondary)' }}
          >
            인증 상태를 확인하는 중...
          </p>
        </div>
      </div>
    )
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}