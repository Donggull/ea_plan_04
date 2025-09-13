import { useState } from 'react'
import { Menu, Sun, Moon, User, LogOut, Settings, Search, Bell, Globe } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <header className="linear-navigation fixed top-0 left-0 right-0 w-full z-50">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        {/* Left Section - 로고 */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="linear-button-ghost linear-button-sm lg:hidden"
            aria-label="메뉴 토글"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <h1 className="text-lg font-semibold text-white m-0">Eluo Platform</h1>
          </div>
        </div>

        {/* Center Section - 글로벌 네비게이션 */}
        <nav className="hidden lg:flex items-center gap-1">
          <button className="linear-nav-link px-4 py-2">
            <Globe className="w-4 h-4" />
            <span>대시보드</span>
          </button>
          <button className="linear-nav-link px-4 py-2">
            <span>프로젝트</span>
          </button>
          <button className="linear-nav-link px-4 py-2">
            <span>팀</span>
          </button>
          <button className="linear-nav-link px-4 py-2">
            <span>분석</span>
          </button>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* 검색바 */}
          <div className="hidden md:flex items-center relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="검색..."
                className="linear-input linear-input-sm pl-10 pr-4 py-2 w-64 bg-gray-800/50 border-gray-600"
                style={{
                  backgroundColor: 'var(--linear-bg-tertiary)',
                  borderColor: 'var(--linear-border-primary)'
                }}
              />
            </div>
          </div>

          {/* 모바일 검색 버튼 */}
          <button className="linear-button-ghost linear-button-sm md:hidden">
            <Search className="w-5 h-5" />
          </button>

          {/* 알림 */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="linear-button-ghost linear-button-sm relative"
              aria-label="알림"
            >
              <Bell className="w-5 h-5" />
              {/* 알림 뱃지 */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </span>
            </button>

            {/* 알림 드롭다운 */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 z-50 linear-card-elevated backdrop-blur-sm max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-white">알림</h3>
                </div>
                <div className="p-2">
                  <div className="p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-white">새로운 프로젝트가 생성되었습니다</p>
                        <p className="text-xs text-gray-400 mt-1">2분 전</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-white">API 사용량이 80%에 도달했습니다</p>
                        <p className="text-xs text-gray-400 mt-1">1시간 전</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-white">토큰 잔량이 부족합니다</p>
                        <p className="text-xs text-gray-400 mt-1">3시간 전</p>
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
            className="linear-button-ghost linear-button-sm"
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
              className="linear-button-ghost flex items-center gap-2"
              aria-label="사용자 메뉴"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full border border-gray-600">
                <User className="w-4 h-4 text-gray-300" />
              </div>
              <span className="text-sm text-gray-300 font-medium hidden sm:block">
                사용자
              </span>
            </button>

            {/* 사용자 드롭다운 메뉴 */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 z-50 linear-card-elevated backdrop-blur-sm">
                <button className="linear-button-ghost w-full justify-start flex items-center gap-2 p-3">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">설정</span>
                </button>
                <button className="linear-button-ghost w-full justify-start flex items-center gap-2 p-3 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-300">로그아웃</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}