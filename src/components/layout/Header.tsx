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
    <header
      className="linear-navigation fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(8, 9, 16, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--linear-border-primary)',
        height: 'var(--linear-header-height)'
      }}
    >
      <div className="linear-container flex items-center justify-between h-full">
        {/* Left Section */}
        <div className="flex items-center" style={{ gap: 'var(--linear-spacing-md)' }}>
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-opacity-20 hover:bg-white transition-all duration-150"
            style={{
              borderRadius: 'var(--linear-radius-md)',
              padding: 'var(--linear-spacing-sm)'
            }}
            aria-label="메뉴 토글"
          >
            <Menu
              className="w-5 h-5"
              style={{ color: 'var(--linear-text-secondary)' }}
            />
          </button>

          <div className="flex items-center" style={{ gap: 'var(--linear-spacing-sm)' }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, var(--linear-accent-blue), var(--linear-accent-indigo))',
                borderRadius: 'var(--linear-radius-md)'
              }}
            >
              <span
                className="font-bold text-sm text-white"
                style={{
                  fontFamily: 'var(--linear-font-primary)',
                  fontWeight: '680'
                }}
              >
                E
              </span>
            </div>
            <h1
              className="linear-title-2"
              style={{
                color: 'var(--linear-text-primary)',
                fontFamily: 'var(--linear-font-primary)',
                margin: 0
              }}
            >
              Eluo Platform
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center" style={{ gap: 'var(--linear-spacing-xs)' }}>
          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-white transition-all"
            style={{
              borderRadius: 'var(--linear-radius-md)',
              padding: 'var(--linear-spacing-sm)',
              transition: 'all var(--linear-animation-fast) var(--linear-ease-out)'
            }}
            aria-label="테마 전환"
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {theme === 'dark' ? (
              <Sun
                className="w-5 h-5"
                style={{ color: 'var(--linear-accent-yellow)' }}
              />
            ) : (
              <Moon
                className="w-5 h-5"
                style={{ color: 'var(--linear-accent-indigo)' }}
              />
            )}
          </button>

          {/* 사용자 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center p-2 rounded-lg hover:bg-opacity-10 hover:bg-white transition-all"
              style={{
                gap: 'var(--linear-spacing-sm)',
                borderRadius: 'var(--linear-radius-md)',
                padding: 'var(--linear-spacing-sm)',
                transition: 'all var(--linear-animation-fast) var(--linear-ease-out)'
              }}
              aria-label="사용자 메뉴"
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--linear-bg-tertiary)',
                  borderRadius: '50%',
                  border: '1px solid var(--linear-border-primary)'
                }}
              >
                <User
                  className="w-4 h-4"
                  style={{ color: 'var(--linear-text-secondary)' }}
                />
              </div>
              <span
                className="linear-text-regular hidden sm:block"
                style={{
                  color: 'var(--linear-text-secondary)',
                  fontFamily: 'var(--linear-font-primary)',
                  fontWeight: '510'
                }}
              >
                사용자
              </span>
            </button>

            {/* 사용자 드롭다운 메뉴 */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 z-50 linear-card"
                style={{
                  background: 'var(--linear-bg-secondary)',
                  border: '1px solid var(--linear-border-primary)',
                  borderRadius: 'var(--linear-radius-lg)',
                  padding: 'var(--linear-spacing-sm)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <button
                  className="flex items-center w-full p-3 rounded-lg hover:bg-opacity-50 hover:bg-white transition-all"
                  style={{
                    gap: 'var(--linear-spacing-sm)',
                    borderRadius: 'var(--linear-radius-md)',
                    transition: 'all var(--linear-animation-fast) var(--linear-ease-out)'
                  }}
                >
                  <Settings
                    className="w-4 h-4"
                    style={{ color: 'var(--linear-text-tertiary)' }}
                  />
                  <span
                    className="linear-text-regular"
                    style={{
                      color: 'var(--linear-text-secondary)',
                      fontFamily: 'var(--linear-font-primary)'
                    }}
                  >
                    설정
                  </span>
                </button>
                <button
                  className="flex items-center w-full p-3 rounded-lg hover:bg-opacity-50 hover:bg-red-500 transition-all"
                  style={{
                    gap: 'var(--linear-spacing-sm)',
                    borderRadius: 'var(--linear-radius-md)',
                    transition: 'all var(--linear-animation-fast) var(--linear-ease-out)'
                  }}
                >
                  <LogOut
                    className="w-4 h-4"
                    style={{ color: 'var(--linear-accent-red)' }}
                  />
                  <span
                    className="linear-text-regular"
                    style={{
                      color: 'var(--linear-text-secondary)',
                      fontFamily: 'var(--linear-font-primary)'
                    }}
                  >
                    로그아웃
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}