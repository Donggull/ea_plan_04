import { useNavigate } from 'react-router-dom'
import { Plus, ImageIcon, MessageCircle, FileText, Palette, Settings } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'orange' | 'plan' | 'build' | 'security'
  href?: string
  onClick?: () => void
}

export function QuickActions() {
  const navigate = useNavigate()
  const { openModal } = useUIStore()

  const quickActions: QuickAction[] = [
    {
      id: 'new-project',
      title: '새 프로젝트',
      description: '새로운 프로젝트를 시작하세요',
      icon: <Plus className="w-5 h-5" />,
      color: 'blue',
      onClick: () => {
        openModal({
          component: () => <div>새 프로젝트 모달</div>,
          size: 'lg'
        })
      }
    },
    {
      id: 'generate-image',
      title: '이미지 생성',
      description: 'AI로 이미지를 생성하세요',
      icon: <ImageIcon className="w-5 h-5" />,
      color: 'orange',
      href: '/image-generation'
    },
    {
      id: 'ai-chat',
      title: 'AI 채팅',
      description: '전용 챗봇과 대화하세요',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'plan',
      href: '/chatbot/ai-chat'
    },
    {
      id: 'planning',
      title: '기획 작업',
      description: '프로젝트 기획을 시작하세요',
      icon: <FileText className="w-5 h-5" />,
      color: 'build',
      href: '/planning/proposal'
    },
    {
      id: 'design',
      title: '디자인 작업',
      description: '디자인 워크플로우를 관리하세요',
      icon: <Palette className="w-5 h-5" />,
      color: 'security',
      href: '/design/workflow'
    },
    {
      id: 'settings',
      title: '설정',
      description: '시스템 설정을 변경하세요',
      icon: <Settings className="w-5 h-5" />,
      color: 'blue',
      onClick: () => {
        openModal({
          component: () => <div>설정 모달</div>,
          size: 'lg'
        })
      }
    }
  ]

  const handleActionClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick()
    } else if (action.href) {
      navigate(action.href)
    }
  }

  const getColorClasses = (color: QuickAction['color']) => {
    const colorMap = {
      blue: {
        bg: 'linear-bg-blue-soft hover:linear-bg-blue-soft',
        icon: 'linear-accent-blue',
        border: 'hover:border-accent-blue/20'
      },
      green: {
        bg: 'linear-bg-green-soft hover:linear-bg-green-soft',
        icon: 'linear-accent-green',
        border: 'hover:border-accent-green/20'
      },
      orange: {
        bg: 'linear-bg-orange-soft hover:linear-bg-orange-soft',
        icon: 'linear-accent-orange',
        border: 'hover:border-accent-orange/20'
      },
      plan: {
        bg: 'linear-bg-plan-soft hover:linear-bg-plan-soft',
        icon: 'linear-accent-plan',
        border: 'hover:border-accent-plan/20'
      },
      build: {
        bg: 'linear-bg-build-soft hover:linear-bg-build-soft',
        icon: 'linear-accent-build',
        border: 'hover:border-accent-build/20'
      },
      security: {
        bg: 'linear-bg-security-soft hover:linear-bg-security-soft',
        icon: 'linear-accent-security',
        border: 'hover:border-accent-security/20'
      }
    }
    return colorMap[color]
  }

  return (
    <div className="linear-card">
      <h3 className="linear-title-2 mb-4">빠른 작업</h3>

      <div className="space-y-3">
        {quickActions.map((action) => {
          const colorClasses = getColorClasses(action.color)

          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`w-full p-4 rounded-linear-md border border-border-primary ${
                colorClasses.bg
              } ${colorClasses.border} transition-all duration-linear-fast hover:transform hover:scale-[1.02] linear-animate-fade-in`}
            >
              <div className="linear-flex-start linear-gap-sm text-left">
                <div className={`flex-shrink-0 ${colorClasses.icon}`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="linear-text-regular font-medium linear-text-primary mb-1">
                    {action.title}
                  </h4>
                  <p className="linear-text-small linear-text-tertiary">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}