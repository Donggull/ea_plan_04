import { useState } from 'react'
import { Menu, Sun, Moon, User, LogOut, Settings } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  return (
    <header className="linear-navigation fixed top-0 left-0 right-0 w-full z-50">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="linear-button-ghost linear-button-sm"
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

        {/* Right Section */}
        <div className="flex items-center gap-2">
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