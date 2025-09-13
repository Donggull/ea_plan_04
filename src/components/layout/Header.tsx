import { useState } from 'react'
import { Menu, Search, Bell, Sun, Moon, User, Settings, LogOut } from 'lucide-react'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [theme, setTheme] = useState('dark')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: '64px',
        backgroundColor: 'var(--linear-bg-secondary)',
        borderBottom: '1px solid var(--linear-border-primary)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: 'var(--linear-text-secondary)' }}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <h1
              className="text-lg font-semibold"
              style={{ color: 'var(--linear-text-primary)' }}
            >
              Eluo Platform
            </h1>
          </div>
        </div>

        {/* Center - Navigation + Search */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-1">
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
          </nav>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--linear-text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="검색..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: 'var(--linear-bg-tertiary)',
                borderColor: 'var(--linear-border-primary)',
                color: 'var(--linear-text-primary)',
                border: '1px solid var(--linear-border-primary)'
              }}
            />
          </div>
        </div>

        {/* Right - Notifications, Theme, User */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: 'var(--linear-text-secondary)' }}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: 'var(--linear-text-secondary)' }}
            >
              <Bell className="w-5 h-5" />
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs text-white flex items-center justify-center font-bold"
                style={{ backgroundColor: 'var(--linear-accent-red)' }}
              >
                3
              </span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: 'var(--linear-text-secondary)' }}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-400" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--linear-bg-tertiary)',
                  borderColor: 'var(--linear-border-primary)',
                  border: '1px solid var(--linear-border-primary)'
                }}
              >
                <User className="w-4 h-4" style={{ color: 'var(--linear-text-secondary)' }} />
              </div>
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50"
                style={{
                  backgroundColor: 'var(--linear-bg-elevated)',
                  borderColor: 'var(--linear-border-primary)',
                  border: '1px solid var(--linear-border-primary)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
                }}
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--linear-text-secondary)' }}
                >
                  <Settings className="w-4 h-4" style={{ color: 'var(--linear-text-tertiary)' }} />
                  설정
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-red-500/10 transition-colors"
                  style={{ color: 'var(--linear-text-secondary)' }}
                >
                  <LogOut className="w-4 h-4" style={{ color: 'var(--linear-accent-red)' }} />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}