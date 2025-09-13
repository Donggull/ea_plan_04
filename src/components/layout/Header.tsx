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
    <header className="linear-navigation">
      <div className="linear-container linear-flex-between h-header">
        {/* Left Section */}
        <div className="linear-flex-start linear-gap-md">
          <button
            onClick={onToggleSidebar}
            className="linear-button-ghost linear-button-sm"
            aria-label="메뉴 토글"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="linear-flex-start linear-gap-sm">
            <div className="linear-flex-center w-8 h-8 rounded-linear-md bg-gradient-to-br from-accent-blue to-accent-indigo">
              <span className="linear-text-small font-bold text-white">E</span>
            </div>
            <h1 className="linear-title-2 m-0">Eluo Platform</h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="linear-flex-end linear-gap-xs">
          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            className="linear-button-ghost linear-button-sm"
            aria-label="테마 전환"
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 linear-accent-yellow" />
            ) : (
              <Moon className="w-5 h-5 linear-accent-indigo" />
            )}
          </button>

          {/* 사용자 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="linear-button-ghost linear-gap-sm"
              aria-label="사용자 메뉴"
            >
              <div className="linear-flex-center w-8 h-8 bg-background-tertiary rounded-full border border-border-primary">
                <User className="w-4 h-4 linear-text-secondary" />
              </div>
              <span className="linear-text-regular linear-text-secondary font-medium hidden sm:block">
                사용자
              </span>
            </button>

            {/* 사용자 드롭다운 메뉴 */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 z-50 linear-card-elevated backdrop-blur-linear">
                <button className="linear-button-ghost w-full justify-start linear-gap-sm p-3">
                  <Settings className="w-4 h-4 linear-text-tertiary" />
                  <span className="linear-text-regular linear-text-secondary">설정</span>
                </button>
                <button className="linear-button-ghost w-full justify-start linear-gap-sm p-3 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4 linear-accent-red" />
                  <span className="linear-text-regular linear-text-secondary">로그아웃</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}