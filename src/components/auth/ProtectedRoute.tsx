import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()

  // TODO: 실제 인증 상태 확인 로직으로 교체
  const isAuthenticated = true // 임시로 true 설정

  if (!isAuthenticated) {
    // 로그인 페이지로 리다이렉트하면서 현재 위치를 state로 전달
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}