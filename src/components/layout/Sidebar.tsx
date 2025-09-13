import { useState, useCallback, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Hammer, Code2, X, ChevronDown,
  Activity, Zap, CreditCard, Settings, GripVertical, Folder
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  width: number
  onWidthChange: (width: number) => void
}

export function Sidebar({ isOpen, onClose, width, onWidthChange }: SidebarProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [selectedProject] = useState('Eluo Platform')
  const sidebarRef = useRef<HTMLDivElement>(null)

  const navigationItems = [
    {
      name: '대시보드',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'var(--linear-accent-blue)'
    },
    {
      name: '기획 진행',
      href: '/proposal',
      icon: FileText,
      color: 'var(--linear-accent-green)'
    },
    {
      name: '구축 관리',
      href: '/build',
      icon: Hammer,
      color: 'var(--linear-accent-orange)'
    },
    {
      name: '개발',
      href: '/development',
      icon: Code2,
      color: 'var(--linear-accent-indigo)'
    }
  ]

  // 드래그 리사이즈 핸들링
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return

    const newWidth = e.clientX
    const minWidth = 240
    const maxWidth = 400

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      onWidthChange(newWidth)
    }
  }, [isResizing, onWidthChange])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className="fixed inset-0 z-40 lg:hidden"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="fixed top-16 left-0 z-50 lg:static lg:top-auto lg:z-30"
        style={{
          width: `${width}px`,
          height: 'calc(100vh - 64px)',
          backgroundColor: 'var(--linear-bg-secondary)',
          borderRight: '1px solid var(--linear-border-primary)'
        }}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--linear-text-secondary)' }} />
          </button>
        </div>

        <div className="flex flex-col h-full">
          {/* 프로젝트 선택기 */}
          <div
            className="p-4 border-b"
            style={{ borderColor: 'var(--linear-border-primary)' }}
          >
            <div className="relative">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Folder className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div
                      className="font-medium text-sm"
                      style={{ color: 'var(--linear-text-primary)' }}
                    >
                      {selectedProject}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--linear-text-tertiary)' }}
                    >
                      프로젝트
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className="w-4 h-4"
                  style={{ color: 'var(--linear-text-secondary)' }}
                />
              </button>
            </div>
          </div>

          {/* 메뉴 네비게이션 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={({ isActive }) => `
                        flex items-center px-3 py-2.5 rounded-lg
                        text-sm font-medium transition-all duration-200
                        ${isActive
                          ? 'text-white'
                          : 'hover:bg-white/5'
                        }
                      `}
                      style={({ isActive }) => ({
                        color: isActive ? 'var(--linear-text-primary)' : 'var(--linear-text-secondary)',
                        backgroundColor: isActive ? 'rgba(78, 167, 252, 0.1)' : 'transparent',
                        borderLeft: isActive ? '2px solid var(--linear-accent-blue)' : '2px solid transparent'
                      })}
                    >
                      <div
                        className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  )
                })}
              </nav>

              {/* 옵션 패널 */}
              <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--linear-border-primary)' }}>
                <h3
                  className="text-xs font-medium mb-3 uppercase tracking-wide"
                  style={{ color: 'var(--linear-text-tertiary)' }}
                >
                  옵션 패널
                </h3>
                <div className="space-y-1">
                  <button
                    className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5"
                    style={{ color: 'var(--linear-text-secondary)' }}
                  >
                    <Settings className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>설정</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* API 사용량 표시 및 토큰 소비 현황 */}
          <div
            className="p-4 border-t"
            style={{
              borderColor: 'var(--linear-border-primary)',
              backgroundColor: 'var(--linear-bg-primary)'
            }}
          >
            {/* API 사용량 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity
                    className="w-4 h-4"
                    style={{ color: 'var(--linear-accent-blue)' }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--linear-text-primary)' }}
                  >
                    API 사용량
                  </span>
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{
                    color: 'var(--linear-accent-blue)',
                    backgroundColor: 'rgba(78, 167, 252, 0.1)'
                  }}
                >
                  75%
                </span>
              </div>
              <div
                className="w-full rounded-full h-2 mb-2"
                style={{ backgroundColor: 'var(--linear-bg-tertiary)' }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: '75%',
                    backgroundColor: 'var(--linear-accent-blue)'
                  }}
                />
              </div>
              <div
                className="flex justify-between text-xs"
                style={{ color: 'var(--linear-text-muted)' }}
              >
                <span>7,500 / 10,000 요청</span>
                <span>이번 달</span>
              </div>
            </div>

            {/* 토큰 소비 현황 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap
                    className="w-4 h-4"
                    style={{ color: 'var(--linear-accent-yellow)' }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--linear-text-primary)' }}
                  >
                    토큰 잔량
                  </span>
                </div>
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{
                    color: 'var(--linear-accent-orange)',
                    backgroundColor: 'rgba(252, 120, 64, 0.1)'
                  }}
                >
                  45%
                </span>
              </div>
              <div
                className="w-full rounded-full h-2 mb-2"
                style={{ backgroundColor: 'var(--linear-bg-tertiary)' }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: '45%',
                    backgroundColor: 'var(--linear-accent-yellow)'
                  }}
                />
              </div>
              <div
                className="flex justify-between text-xs items-center"
                style={{ color: 'var(--linear-text-muted)' }}
              >
                <span>45K / 100K 토큰</span>
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors hover:bg-white/10"
                  style={{ color: 'var(--linear-accent-blue)' }}
                >
                  <CreditCard className="w-3 h-3" />
                  충전
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 드래그 핸들 (사용자 조정 가능) - 데스크톱에서만 */}
        <div
          className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-col-resize group transition-colors hover:bg-blue-500/20"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4" style={{ color: 'var(--linear-accent-blue)' }} />
          </div>
        </div>
      </aside>
    </>
  )
}