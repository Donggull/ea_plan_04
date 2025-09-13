interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen: _, onClose: __ }: SidebarProps) {
  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-800 border-r border-gray-600 z-30 lg:translate-x-0 -translate-x-full">
      <div className="p-4">
        <h2 className="text-gray-300 text-sm mb-4 font-medium">
          PROJECT NAVIGATION
        </h2>
        <div className="space-y-2">
          <div className="flex items-center p-2 rounded text-sm text-white">
            <div className="w-2 h-2 rounded-full mr-3 bg-blue-500"></div>
            대시보드
          </div>
          <div className="flex items-center p-2 rounded text-sm text-white">
            <div className="w-2 h-2 rounded-full mr-3 bg-green-500"></div>
            기획 진행
          </div>
          <div className="flex items-center p-2 rounded text-sm text-white">
            <div className="w-2 h-2 rounded-full mr-3 bg-orange-500"></div>
            구축 관리
          </div>
          <div className="flex items-center p-2 rounded text-sm text-white">
            <div className="w-2 h-2 rounded-full mr-3 bg-purple-500"></div>
            개발
          </div>
        </div>
      </div>
    </aside>
  )
}