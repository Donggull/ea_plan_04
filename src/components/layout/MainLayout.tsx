import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)

      // 데스크톱에서는 사이드바를 기본적으로 열어둠
      if (!mobile) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    // 초기 설정
    handleResize()

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--linear-bg-primary)' }}>
      {/* Header */}
      <Header
        onToggleSidebar={toggleSidebar}
      />

      {/* Layout Container */}
      <div className="linear-flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        {/* Main Content Area */}
        <main
          className={cn(
            'flex-1 transition-all',
            // 사이드바가 열려있을 때 마진 조정 (데스크톱만)
            !isMobile && isSidebarOpen ? 'lg:ml-64 xl:ml-80' : 'ml-0'
          )}
          style={{
            paddingTop: 'var(--linear-header-height)',
            transitionDuration: 'var(--linear-animation-normal)',
            transitionTimingFunction: 'var(--linear-ease-out)'
          }}
        >
          <div className="linear-container-lg" style={{
            padding: 'var(--linear-spacing-lg)',
            maxWidth: '1440px',
            margin: '0 auto'
          }}>
            {/* 메인 콘텐츠 영역 */}
            <div style={{ minHeight: 'calc(100vh - var(--linear-header-height) - 3rem)' }}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}