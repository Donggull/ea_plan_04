import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

/**
 * 세션 지속성 및 브라우저 종료 감지를 위한 컴포넌트
 *
 * 기능:
 * 1. 새로고침/탭 전환 시 세션 유지
 * 2. 브라우저 완전 종료 시에만 세션 종료
 * 3. 장시간 비활성 시 자동 로그아웃
 */
export function SessionManager() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // 브라우저 종료 감지를 위한 고유 세션 ID
    const sessionId = Date.now().toString()
    const STORAGE_KEY = 'eluo-browser-sessions'
    const HEARTBEAT_INTERVAL = 10000 // 10초
    const SESSION_TIMEOUT = 30 * 60 * 1000 // 30분

    // 활성 브라우저 세션 등록
    const registerSession = () => {
      const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      sessions[sessionId] = {
        lastHeartbeat: Date.now(),
        userId: user.id
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    }

    // heartbeat 전송
    const sendHeartbeat = () => {
      const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (sessions[sessionId]) {
        sessions[sessionId].lastHeartbeat = Date.now()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
      }
    }

    // 죽은 세션 정리
    const cleanupDeadSessions = () => {
      const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      const now = Date.now()
      let hasActiveSessions = false

      Object.keys(sessions).forEach(id => {
        const session = sessions[id]
        if (now - session.lastHeartbeat > SESSION_TIMEOUT) {
          delete sessions[id]
        } else {
          hasActiveSessions = true
        }
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))

      // 활성 세션이 없으면 로그아웃 (브라우저 완전 종료 후 재시작)
      const wasLoggedIn = localStorage.getItem('eluo-auth-token')
      if (!hasActiveSessions && wasLoggedIn && Object.keys(sessions).length === 0) {
        // 모든 브라우저 세션이 종료되었으므로 로그아웃
        console.log('모든 브라우저 세션 종료 - 자동 로그아웃')
        // 여기서 실제 로그아웃은 AuthContext에서 처리
      }
    }

    // 페이지 가시성 변경 감지
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat()
        cleanupDeadSessions()
      }
    }

    // 초기 등록
    registerSession()
    cleanupDeadSessions()

    // heartbeat 시작
    const heartbeatInterval = setInterval(() => {
      if (!document.hidden) {
        sendHeartbeat()
      }
    }, HEARTBEAT_INTERVAL)

    // 정리 인터벌
    const cleanupInterval = setInterval(cleanupDeadSessions, HEARTBEAT_INTERVAL * 2)

    // 페이지 가시성 이벤트
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 페이지 언로드 시 세션 제거
    const handleUnload = () => {
      const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      delete sessions[sessionId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      clearInterval(heartbeatInterval)
      clearInterval(cleanupInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleUnload)

      // 세션 제거
      const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      delete sessions[sessionId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    }
  }, [user])

  return null // 이 컴포넌트는 UI를 렌더링하지 않음
}