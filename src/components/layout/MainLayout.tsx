import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // 화면 크기 감지 및 데스크톱에서 사이드바 자동 열기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
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
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--linear-bg-primary)' }}>
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* Layout Container */}
      <div className="flex" style={{ marginTop: '64px', height: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Content */}
        <main
          className="flex-1 overflow-auto"
          style={{ backgroundColor: 'var(--linear-bg-primary)' }}
        >
          <div
            className="w-full h-full"
            style={{
              padding: 'var(--linear-spacing-lg)',
              paddingTop: 'var(--linear-spacing-md)'
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}