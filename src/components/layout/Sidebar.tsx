import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Hammer,
  Code2,
  X,
  ChevronDown,
  Folder,
  Settings,
  Activity,
  Zap,
  CreditCard
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigationItems = [
    {
      name: '대시보드',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'bg-blue-500'
    },
    {
      name: '기획 진행',
      href: '/proposal',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      name: '구축 관리',
      href: '/build',
      icon: Hammer,
      color: 'bg-orange-500'
    },
    {
      name: '개발',
      href: '/development',
      icon: Code2,
      color: 'bg-indigo-500'
    }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-50 lg:static lg:top-auto lg:z-30
          w-72 h-[calc(100vh-4rem)]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          backgroundColor: 'var(--linear-bg-secondary)',
          borderRight: '1px solid var(--linear-border-primary)'
        }}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: 'var(--linear-text-secondary)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          {/* Project Selector */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--linear-border-primary)' }}>
            <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Folder className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm" style={{ color: 'var(--linear-text-primary)' }}>
                    Eluo Platform
                  </div>
                  <div className="text-xs" style={{ color: 'var(--linear-text-tertiary)' }}>
                    프로젝트
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--linear-text-secondary)' }} />
            </button>
          </div>

          {/* Navigation Menu */}
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
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-500/10 border-l-2 border-blue-500'
                            : 'hover:bg-white/5'
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? 'var(--linear-text-primary)' : 'var(--linear-text-secondary)'
                      })}
                    >
                      <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${item.color}`} />
                      <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  )
                })}
              </nav>

              {/* Options Panel */}
              <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--linear-border-primary)' }}>
                <h3 className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: 'var(--linear-text-tertiary)' }}>
                  옵션 패널
                </h3>
                <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--linear-text-secondary)' }}>
                  <Settings className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>설정</span>
                </button>
              </div>
            </div>
          </div>

          {/* API Usage & Token Status */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--linear-border-primary)', backgroundColor: 'var(--linear-bg-primary)' }}>
            {/* API Usage */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium" style={{ color: 'var(--linear-text-primary)' }}>
                    API 사용량
                  </span>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: 'rgba(78, 167, 252, 0.1)', color: 'var(--linear-accent-blue)' }}>
                  75%
                </span>
              </div>
              <div className="w-full rounded-full h-2 mb-2" style={{ backgroundColor: 'var(--linear-bg-tertiary)' }}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ width: '75%', backgroundColor: 'var(--linear-accent-blue)' }}
                />
              </div>
              <div className="flex justify-between text-xs" style={{ color: 'var(--linear-text-muted)' }}>
                <span>7,500 / 10,000 요청</span>
                <span>이번 달</span>
              </div>
            </div>

            {/* Token Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium" style={{ color: 'var(--linear-text-primary)' }}>
                    토큰 잔량
                  </span>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: 'rgba(252, 120, 64, 0.1)', color: 'var(--linear-accent-orange)' }}>
                  45%
                </span>
              </div>
              <div className="w-full rounded-full h-2 mb-2" style={{ backgroundColor: 'var(--linear-bg-tertiary)' }}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ width: '45%', backgroundColor: 'var(--linear-accent-yellow)' }}
                />
              </div>
              <div className="flex justify-between text-xs items-center" style={{ color: 'var(--linear-text-muted)' }}>
                <span>45K / 100K 토큰</span>
                <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors hover:bg-white/10" style={{ color: 'var(--linear-accent-blue)' }}>
                  <CreditCard className="w-3 h-3" />
                  충전
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}