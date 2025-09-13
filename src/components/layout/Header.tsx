import { useState } from 'react'
import { Menu, Sun, Moon, User, LogOut, Settings, Search, Bell } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-50"
      style={{
        height: '64px',
        backgroundColor: 'var(--linear-bg-secondary)',
        borderBottom: '1px solid var(--linear-border-primary)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div className="h-full px-6 flex items-center">
        {/* Left Section - 로고 */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 lg:hidden"
            aria-label="메뉴 토글"
          >
            <Menu className="w-5 h-5" style={{ color: 'var(--linear-text-secondary)' }} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <h1
              className="text-lg font-semibold m-0"
              style={{ color: 'var(--linear-text-primary)' }}
            >
              Eluo Platform
            </h1>
          </div>
        </div>

        {/* Center Section - 글로벌 네비게이션 + 검색바 */}
        <div className="flex-1 flex items-center justify-center gap-8 px-8">
          {/* 글로벌 네비게이션 */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
              style={{ color: 'var(--linear-text-primary)' }}
            >
              대시보드
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
              style={{ color: 'var(--linear-text-secondary)' }}
            >
              프로젝트
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
              style={{ color: 'var(--linear-text-secondary)' }}
            >
              팀
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
              style={{ color: 'var(--linear-text-secondary)' }}
            >
              분석
            </button>
          </nav>

          {/* 검색바 */}
          <div className="hidden md:flex items-center relative max-w-md">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--linear-text-tertiary)' }}
              />
              <input
                type="text"
                placeholder="검색..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--linear-bg-tertiary)',
                  borderColor: 'var(--linear-border-primary)',
                  color: 'var(--linear-text-primary)',
                  border: '1px solid var(--linear-border-primary)',
                  focusRingColor: 'var(--linear-accent-blue)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Section - 알림, 테마, 사용자 메뉴 */}
        <div className="flex items-center gap-2 min-w-0">
          {/* 모바일 검색 버튼 */}
          <button className="p-2 rounded-lg hover:bg-white/10 md:hidden">
            <Search className="w-5 h-5" style={{ color: 'var(--linear-text-secondary)' }} />
          </button>

          {/* 알림 */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-lg hover:bg-white/10 relative"
              aria-label="알림"
            >
              <Bell className="w-5 h-5" style={{ color: 'var(--linear-text-secondary)' }} />
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--linear-accent-red)' }}
              >
                <span className="text-xs text-white font-bold">3</span>
              </span>
            </button>

            {/* 알림 드롭다운 */}
            {isNotificationOpen && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-lg border backdrop-blur-sm max-h-96 overflow-y-auto z-50"
                style={{
                  backgroundColor: 'var(--linear-bg-elevated)',
                  borderColor: 'var(--linear-border-primary)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div
                  className="p-4 border-b"
                  style={{ borderColor: 'var(--linear-border-primary)' }}
                >
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: 'var(--linear-text-primary)' }}
                  >
                    알림
                  </h3>
                </div>
                <div className="p-2">
                  <div className="p-3 hover:bg-white/5 rounded-lg cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm" style={{ color: 'var(--linear-text-primary)' }}>
                          새로운 프로젝트가 생성되었습니다
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--linear-text-tertiary)' }}>
                          2분 전
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="테마 전환"
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-400" />
            )}
          </button>

          {/* 사용자 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10"
              aria-label="사용자 메뉴"
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full border"
                style={{
                  backgroundColor: 'var(--linear-bg-tertiary)',
                  borderColor: 'var(--linear-border-primary)'
                }}
              >
                <User className="w-4 h-4" style={{ color: 'var(--linear-text-secondary)' }} />
              </div>
            </button>

            {/* 사용자 드롭다운 메뉴 */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg border backdrop-blur-sm z-50"
                style={{
                  backgroundColor: 'var(--linear-bg-elevated)',
                  borderColor: 'var(--linear-border-primary)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
                }}
              >
                <button className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-white/5 text-left">
                  <Settings className="w-4 h-4" style={{ color: 'var(--linear-text-tertiary)' }} />
                  <span className="text-sm" style={{ color: 'var(--linear-text-secondary)' }}>설정</span>
                </button>
                <button className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-red-500/10 text-left">
                  <LogOut className="w-4 h-4" style={{ color: 'var(--linear-accent-red)' }} />
                  <span className="text-sm" style={{ color: 'var(--linear-text-secondary)' }}>로그아웃</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}