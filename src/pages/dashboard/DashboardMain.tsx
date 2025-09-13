import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart3,
  Users,
  FolderOpen,
  ImageIcon,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'
import { queryKeys } from '@/lib/react-query'
import { useUIStore } from '@/stores/uiStore'
import { useMultiTableRealtimeSubscription } from '@/hooks/useRealtimeSubscription'
import { StatsCard } from './components/StatsCard'
import { RecentActivity } from './components/RecentActivity'
import { ProjectChart } from './components/ProjectChart'
import { QuickActions } from './components/QuickActions'

// 대시보드 통계 데이터 타입
interface DashboardStats {
  activeProjects: number
  completedProjects: number
  teamMembers: number
  generatedImages: number
  totalActivities: number
  monthlyGrowth: number
}

// 모킹 데이터 (실제로는 Supabase에서 가져옴)
const mockStats: DashboardStats = {
  activeProjects: 12,
  completedProjects: 45,
  teamMembers: 8,
  generatedImages: 127,
  totalActivities: 234,
  monthlyGrowth: 23.5,
}

export function DashboardMain() {
  const { setPageTitle, setBreadcrumbs } = useUIStore()
  const realtime = useMultiTableRealtimeSubscription()

  // 페이지 메타데이터 설정
  useEffect(() => {
    setPageTitle('대시보드')
    setBreadcrumbs([
      { label: '대시보드', href: '/dashboard' }
    ])
  }, [setPageTitle, setBreadcrumbs])

  // 대시보드 통계 데이터 쿼리
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: async () => {
      // TODO: 실제 Supabase 쿼리로 대체
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockStats
    },
    staleTime: 1000 * 60 * 5, // 5분
  })

  return (
    <div className=\"linear-container linear-gap-lg py-6\">
      {/* 페이지 헤더 */}
      <div className=\"linear-flex-between mb-6\">
        <div>
          <h1 className=\"linear-title-4 mb-2\">대시보드</h1>
          <p className=\"linear-text-regular linear-text-tertiary\">
            프로젝트와 팀 활동을 한눈에 확인하세요
          </p>
        </div>

        {/* 실시간 연결 상태 */}
        <div className=\"linear-flex-center linear-gap-sm\">
          <div className={`linear-status-dot ${\n            realtime.isAllConnected ? 'linear-status-online' : 'linear-status-offline'\n          }`} />
          <span className=\"linear-text-small linear-text-tertiary\">\n            {realtime.isAllConnected ? '실시간 연결됨' : '연결 중...'}\n          </span>\n        </div>\n      </div>\n\n      {/* 통계 카드들 */}\n      <div className=\"linear-grid linear-grid-cols-1 md:linear-grid-cols-2 lg:linear-grid-cols-4 linear-gap-lg mb-8\">\n        <StatsCard\n          title=\"진행 중인 프로젝트\"\n          value={stats?.activeProjects ?? 0}\n          icon={<FolderOpen className=\"w-5 h-5\" />}\n          color=\"blue\"\n          isLoading={statsLoading}\n        />\n        \n        <StatsCard\n          title=\"완료된 프로젝트\"\n          value={stats?.completedProjects ?? 0}\n          icon={<CheckCircle className=\"w-5 h-5\" />}\n          color=\"green\"\n          isLoading={statsLoading}\n        />\n        \n        <StatsCard\n          title=\"팀 멤버\"\n          value={stats?.teamMembers ?? 0}\n          icon={<Users className=\"w-5 h-5\" />}\n          color=\"security\"\n          isLoading={statsLoading}\n        />\n        \n        <StatsCard\n          title=\"이번 달 생성된 이미지\"\n          value={stats?.generatedImages ?? 0}\n          icon={<ImageIcon className=\"w-5 h-5\" />}\n          color=\"orange\"\n          trend={stats?.monthlyGrowth}\n          isLoading={statsLoading}\n        />\n      </div>\n\n      {/* 메인 콘텐츠 그리드 */}\n      <div className=\"linear-grid linear-grid-cols-1 lg:linear-grid-cols-3 linear-gap-lg\">\n        {/* 차트 섹션 */}\n        <div className=\"lg:col-span-2\">\n          <ProjectChart />\n        </div>\n        \n        {/* 빠른 액션 */}\n        <div className=\"space-y-6\">\n          <QuickActions />\n          \n          {/* 추가 통계 */}\n          <div className=\"linear-card\">\n            <h3 className=\"linear-title-2 mb-4\">이번 주 활동</h3>\n            <div className=\"space-y-4\">\n              <div className=\"linear-flex-between\">\n                <div className=\"linear-flex-start linear-gap-sm\">\n                  <Activity className=\"w-4 h-4 linear-accent-blue\" />\n                  <span className=\"linear-text-regular\">총 활동</span>\n                </div>\n                <span className=\"linear-text-regular font-medium\">\n                  {stats?.totalActivities ?? 0}\n                </span>\n              </div>\n              \n              <div className=\"linear-flex-between\">\n                <div className=\"linear-flex-start linear-gap-sm\">\n                  <TrendingUp className=\"w-4 h-4 linear-accent-green\" />\n                  <span className=\"linear-text-regular\">성장률</span>\n                </div>\n                <span className=\"linear-text-regular font-medium linear-accent-green\">\n                  +{stats?.monthlyGrowth ?? 0}%\n                </span>\n              </div>\n              \n              <div className=\"linear-flex-between\">\n                <div className=\"linear-flex-start linear-gap-sm\">\n                  <Clock className=\"w-4 h-4 linear-accent-orange\" />\n                  <span className=\"linear-text-regular\">평균 응답 시간</span>\n                </div>\n                <span className=\"linear-text-regular font-medium\">\n                  1.2초\n                </span>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      {/* 최근 활동 */}\n      <div className=\"mt-8\">\n        <RecentActivity />\n      </div>\n    </div>\n  )\n}