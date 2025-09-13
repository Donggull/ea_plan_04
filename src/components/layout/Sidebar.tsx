import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Palette,
  Code,
  Wrench,
  MessageCircle,
  Image,
  Home,
  Settings,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

// 메뉴 아이템 타입 정의
interface MenuItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
  children?: MenuItem[]
}

// GNB 메뉴 구성
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: '대시보드',
    icon: Home,
    path: '/dashboard'
  },
  {
    id: 'planning',
    title: '기획',
    icon: FileText,
    children: [
      { id: 'proposal', title: '제안 진행', icon: FileText, path: '/planning/proposal' },
      { id: 'construction', title: '구축 관리', icon: Wrench, path: '/planning/construction' },
      { id: 'operation', title: '운영 관리', icon: Settings, path: '/planning/operation' }
    ]
  },
  {
    id: 'design',
    title: '디자인',
    icon: Palette,
    children: [
      { id: 'workflow', title: '워크플로우', icon: Palette, path: '/design/workflow' },
      { id: 'resources', title: '리소스 관리', icon: Image, path: '/design/resources' }
    ]
  },
  {
    id: 'publishing',
    title: '퍼블리싱',
    icon: Code,
    children: [
      { id: 'canvas', title: '코드 캔버스', icon: Code, path: '/publishing/canvas' },
      { id: 'preview', title: '미리보기', icon: FileText, path: '/publishing/preview' }
    ]
  },
  {
    id: 'development',
    title: '개발',
    icon: Wrench,
    children: [
      { id: 'environment', title: '환경 관리', icon: Settings, path: '/development/environment' },
      { id: 'deployment', title: '배포', icon: Wrench, path: '/development/deployment' }
    ]
  },
  {
    id: 'chatbot',
    title: '전용챗봇',
    icon: MessageCircle,
    children: [
      { id: 'ai-chat', title: 'AI 통합', icon: MessageCircle, path: '/chatbot/ai-chat' },
      { id: 'custom-bot', title: '커스텀 봇', icon: Settings, path: '/chatbot/custom-bot' }
    ]
  },
  {
    id: 'image-gen',
    title: '이미지 생성',
    icon: Image,
    path: '/image-generation'
  }
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<string[]>(['planning'])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActiveMenuItem = (item: MenuItem): boolean => {
    if (item.path) {
      return location.pathname === item.path
    }
    if (item.children) {
      return item.children.some(child => location.pathname === child.path)
    }
    return false
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id)
    const isActive = isActiveMenuItem(item)
    const hasChildren = item.children && item.children.length > 0
    const Icon = item.icon

    return (
      <div key={item.id} className="w-full">
        {/* 메인 메뉴 아이템 */}
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors rounded-lg',
              isActive ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:text-white hover:bg-gray-800',
              level > 0 && 'ml-4'
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn(
                'w-5 h-5',
                isActive ? 'text-blue-400' : 'text-gray-400'
              )} />
              <span className="font-medium">
                {item.title}
              </span>
            </div>
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )
            )}
          </button>
        ) : (
          <NavLink
            to={item.path!}
            onClick={onClose}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2 text-sm transition-colors rounded-lg',
              isActive ? 'text-blue-400 bg-blue-500/10 border-l-2 border-blue-400' : 'text-gray-300 hover:text-white hover:bg-gray-800',
              level > 0 && 'ml-4'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        )}

        {/* 하위 메뉴 아이템들 */}
        {hasChildren && isExpanded && (
          <div className="ml-6 space-y-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={cn(
          'fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 lg:w-80 z-40',
          'bg-gray-900 border-r border-gray-700 transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* 사이드바 헤더 */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              프로젝트 메뉴
            </h2>
          </div>

          {/* 메뉴 아이템들 */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {menuItems.map(item => renderMenuItem(item))}
            </div>
          </nav>

          {/* 사이드바 푸터 */}
          <div className="p-3 border-t border-gray-700">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5" />
              <span>도움말</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}