import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

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
      <Header onToggleSidebar={toggleSidebar} />

      {/* Layout Container */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto lg:ml-0">
          <div
            className="w-full h-full"
            style={{
              backgroundColor: 'var(--linear-bg-primary)',
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