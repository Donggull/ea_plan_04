interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose: _ }: SidebarProps) {
  return (
    <aside
      className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] z-30 transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      style={{
        backgroundColor: 'var(--linear-bg-secondary)',
        borderRight: '1px solid var(--linear-border-primary)',
        fontFamily: 'var(--linear-font-primary)'
      }}
    >
      <div className="h-full flex flex-col p-6">
        {/* 사이드바 헤더 */}
        <div
          className="pb-6 border-b"
          style={{ borderColor: 'var(--linear-border-primary)' }}
        >
          <h2
            className="text-sm font-medium tracking-wide uppercase"
            style={{
              color: 'var(--linear-text-secondary)',
              fontSize: '0.75rem'
            }}
          >
            Project Navigation
          </h2>
        </div>

        {/* 메뉴 항목 */}
        <nav className="flex-1 pt-6">
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-800 hover:bg-opacity-40"
              style={{
                color: 'var(--linear-text-primary)',
                fontSize: '0.9375rem'
              }}
            >
              <div
                className="w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: 'var(--linear-accent-blue)' }}
              ></div>
              대시보드
            </a>

            <a
              href="#"
              className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-800 hover:bg-opacity-40"
              style={{
                color: 'var(--linear-text-primary)',
                fontSize: '0.9375rem'
              }}
            >
              <div
                className="w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: 'var(--linear-accent-green)' }}
              ></div>
              기획 진행
            </a>

            <a
              href="#"
              className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-800 hover:bg-opacity-40"
              style={{
                color: 'var(--linear-text-primary)',
                fontSize: '0.9375rem'
              }}
            >
              <div
                className="w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: 'var(--linear-accent-orange)' }}
              ></div>
              구축 관리
            </a>

            <a
              href="#"
              className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-800 hover:bg-opacity-40"
              style={{
                color: 'var(--linear-text-primary)',
                fontSize: '0.9375rem'
              }}
            >
              <div
                className="w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: 'var(--linear-accent-indigo)' }}
              ></div>
              개발 관리
            </a>
          </div>
        </nav>

        {/* 사이드바 하단 */}
        <div
          className="pt-6 mt-6 border-t"
          style={{ borderColor: 'var(--linear-border-primary)' }}
        >
          <div
            className="text-xs font-medium"
            style={{
              color: 'var(--linear-text-tertiary)',
              fontSize: '0.75rem'
            }}
          >
            ELUO Platform v1.0
          </div>
        </div>
      </div>
    </aside>
  )
}