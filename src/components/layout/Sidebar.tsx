import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Hammer, Code2, X } from 'lucide-react'

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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 w-64 h-full
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)] lg:top-auto lg:z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundColor: 'var(--linear-bg-secondary)',
          borderRight: '1px solid var(--linear-border-primary)',
          marginTop: '64px' // Header height
        }}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--linear-text-secondary)' }} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-6">
          <h2
            className="text-xs font-medium mb-4 uppercase tracking-wider"
            style={{ color: 'var(--linear-text-tertiary)' }}
          >
            PROJECT NAVIGATION
          </h2>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2.5 rounded-lg
                    text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-white/5 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
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
        </div>
      </aside>
    </>
  )
}