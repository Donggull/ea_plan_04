import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  FileText,
  ImageIcon,
  Users,
  Settings,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { queryKeys } from '@/lib/react-query'

interface Activity {
  id: string
  type: 'project' | 'image' | 'chat' | 'team' | 'system'
  action: string
  description: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: string
  metadata?: Record<string, any>
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'project',
    action: 'created',
    description: '"모바일 앱 리뉴얼" 프로젝트를 생성했습니다',
    user: { id: 'user1', name: '김개발' },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    type: 'image',
    action: 'generated',
    description: 'AI 이미지 3개를 생성했습니다',
    user: { id: 'user2', name: '박디자인' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    type: 'chat',
    action: 'conversation',
    description: 'AI 챗봇과 대화를 시작했습니다',
    user: { id: 'user3', name: '이기획' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: '4',
    type: 'project',
    action: 'completed',
    description: '"웹사이트 개편" 프로젝트를 완료했습니다',
    user: { id: 'user1', name: '김개발' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: '5',
    type: 'team',
    action: 'joined',
    description: '새 팀 멤버가 합류했습니다',
    user: { id: 'user4', name: '최신입' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: '6',
    type: 'system',
    action: 'updated',
    description: '시스템 설정이 업데이트되었습니다',
    user: { id: 'system', name: '시스템' },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  }
]

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: queryKeys.analytics.activity(),
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      return mockActivities
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
  })

  const getActivityIcon = (type: Activity['type'], action: string) => {
    switch (type) {
      case 'project':
        if (action === 'completed') {
          return <CheckCircle className="w-4 h-4 linear-accent-green" />
        }
        return <FileText className="w-4 h-4 linear-accent-blue" />
      case 'image':
        return <ImageIcon className="w-4 h-4 linear-accent-orange" />
      case 'chat':
        return <MessageCircle className="w-4 h-4 linear-accent-plan" />
      case 'team':
        return <Users className="w-4 h-4 linear-accent-security" />
      case 'system':
        return <Settings className="w-4 h-4 linear-accent-build" />
      default:
        return <AlertCircle className="w-4 h-4 linear-text-muted" />
    }
  }

  const getActivityColor = (type: Activity['type'], action: string) => {
    switch (type) {
      case 'project':
        return action === 'completed' ? 'linear-accent-green' : 'linear-accent-blue'
      case 'image':
        return 'linear-accent-orange'
      case 'chat':
        return 'linear-accent-plan'
      case 'team':
        return 'linear-accent-security'
      case 'system':
        return 'linear-accent-build'
      default:
        return 'linear-text-muted'
    }
  }

  if (isLoading) {
    return (
      <div className="linear-card">
        <h3 className="linear-title-2 mb-4">최근 활동</h3>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="linear-animate-pulse">
              <div className="linear-flex-start linear-gap-sm">
                <div className="w-8 h-8 bg-background-tertiary rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-background-tertiary rounded mb-2"></div>
                  <div className="h-3 bg-background-tertiary rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="linear-card">
      <div className="linear-flex-between mb-4">
        <h3 className="linear-title-2">최근 활동</h3>
        <button className="linear-button-ghost linear-button-sm">
          전체 보기
        </button>
      </div>

      <div className="space-y-4">
        {activities?.map((activity, index) => {
          const isFirst = index === 0
          const isLast = index === (activities.length - 1)

          return (
            <div
              key={activity.id}
              className={`relative linear-animate-fade-in ${
                !isLast ? 'pb-4' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {!isLast && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-border-primary"></div>
              )}

              <div className="linear-flex-start linear-gap-sm">
                <div className={`relative z-10 w-8 h-8 rounded-full bg-background-secondary border-2 border-border-primary linear-flex-center ${
                  isFirst ? 'ring-2 ring-accent-blue/20' : ''
                }`}>
                  {getActivityIcon(activity.type, activity.action)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="linear-flex-between items-start">
                    <div className="flex-1">
                      <p className="linear-text-regular linear-text-primary mb-1">
                        <span className="font-medium">{activity.user.name}</span>
                        <span className="linear-text-tertiary mx-1">가</span>
                        {activity.description}
                      </p>

                      <div className="linear-flex-start linear-gap-xs">
                        <Clock className="w-3 h-3 linear-text-muted" />
                        <time className="linear-text-mini linear-text-muted">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                            locale: ko
                          })}
                        </time>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-3">
                      {activity.user.avatar ? (
                        <img
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-blue to-accent-indigo linear-flex-center">
                          <span className="linear-text-micro text-white font-medium">
                            {activity.user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {activities && activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-8 h-8 linear-text-muted mx-auto mb-3" />
          <p className="linear-text-regular linear-text-tertiary">아직 활동 내역이 없습니다.</p>
          <p className="linear-text-small linear-text-muted">프로젝트를 시작하여 활동을 기록해보세요.</p>
        </div>
      )}
    </div>
  )
}