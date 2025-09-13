import { useEffect, useState, useDeferredValue, useTransition, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
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

  // React 19 Concurrent Features
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isPending, startTransition] = useTransition()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  // useDeferredValue로 검색 입력 지연
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const deferredFilterType = useDeferredValue(filterType)

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640)
      setIsTablet(window.innerWidth <= 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 페이지 메타데이터 설정
  useEffect(() => {
    setPageTitle('대시보드')
    setBreadcrumbs([
      { label: '대시보드', href: '/dashboard' }
    ])
  }, [setPageTitle, setBreadcrumbs])

  // 대시보드 통계 데이터 쿼리 (Concurrent 기능 적용)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: async () => {
      // TODO: 실제 Supabase 쿼리로 대체
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockStats
    },
    staleTime: 1000 * 60 * 5, // 5분
  })

  // 필터링된 데이터 쿼리 (지연된 값 사용)
  const { data: filteredData, isLoading: filteredLoading } = useQuery({
    queryKey: ['dashboard-filtered', deferredSearchQuery, deferredFilterType],
    queryFn: async () => {
      // 검색 및 필터링 로직
      await new Promise(resolve => setTimeout(resolve, 300))
      return {
        projects: mockStats.activeProjects,
        activities: mockStats.totalActivities
      }
    },
    enabled: !!deferredSearchQuery || deferredFilterType !== 'all',
    staleTime: 1000 * 30, // 30초
  })

  // 검색어 변경 핸들러 (startTransition 사용)
  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchQuery(value)
    })
  }

  // 필터 변경 핸들러 (startTransition 사용)
  const handleFilterChange = (type: string) => {
    startTransition(() => {
      setFilterType(type)
    })
  }

  return (
    <div className="linear-container-full" style={{ padding: 'var(--linear-spacing-lg) 0' }}>
      {/* 페이지 헤더 */}
      <div
        className={isTablet ? "linear-flex-col" : "linear-flex-between"}
        style={{
          marginBottom: 'var(--linear-spacing-lg)',
          alignItems: isTablet ? 'flex-start' : 'center',
          gap: isTablet ? 'var(--linear-spacing-md)' : undefined
        }}
      >
        <div>
          <h1 className="linear-title-4" style={{ marginBottom: 'var(--linear-spacing-sm)' }}>대시보드</h1>
          <p className="linear-text-regular linear-text-tertiary">
            프로젝트와 팀 활동을 한눈에 확인하세요
          </p>
        </div>

        {/* 검색 및 필터 (Concurrent Features 적용) */}
        <div
          className={isMobile ? "linear-flex-col" : "linear-flex-start linear-gap-md"}
          style={{
            width: isTablet ? '100%' : 'auto',
            gap: isMobile ? 'var(--linear-spacing-sm)' : undefined
          }}
        >
          <div style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}>
            <input
              type="text"
              placeholder="프로젝트 검색..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="linear-input"
              style={{
                width: isMobile ? '100%' : '256px',
                opacity: isPending ? 0.5 : 1,
                transition: 'opacity 0.2s ease'
              }}
            />
            {isPending && (
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}>
                <div className="linear-loading-sm" />
              </div>
            )}
          </div>

          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="linear-select"
            style={{
              opacity: isPending ? 0.5 : 1,
              transition: 'opacity 0.2s ease',
              minWidth: isMobile ? '100%' : '120px'
            }}
          >
            <option value="all">전체</option>
            <option value="active">진행중</option>
            <option value="completed">완료</option>
            <option value="planning">계획중</option>
          </select>

          {/* 실시간 연결 상태 */}
          <div className="linear-flex-center linear-gap-sm">
            <div className={`linear-status-dot ${
              realtime.isAllConnected ? 'linear-status-online' : 'linear-status-offline'
            }`} />
            <span className="linear-text-small linear-text-tertiary">
              {realtime.isAllConnected ? '실시간 연결됨' : '연결 중...'}
            </span>
          </div>
        </div>
      </div>

      {/* 통계 카드들 - Suspense로 감싸서 최적화 */}
      <Suspense fallback={
        <div className="linear-grid linear-grid-cols-1"
          style={{
            marginBottom: 'var(--linear-spacing-xl)',
            gridTemplateColumns: isMobile
              ? '1fr'
              : isTablet
                ? 'repeat(2, 1fr)'
                : 'repeat(4, 1fr)',
            gap: 'var(--linear-spacing-lg)'
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="linear-card linear-animate-pulse">
              <div style={{
                height: '80px',
                backgroundColor: 'var(--linear-bg-tertiary)',
                borderRadius: 'var(--linear-radius-md)'
              }} />
            </div>
          ))}
        </div>
      }>
        <div
          className="linear-grid linear-grid-cols-1"
          style={{
            marginBottom: 'var(--linear-spacing-xl)',
            gridTemplateColumns: isMobile
              ? '1fr'
              : isTablet
                ? 'repeat(2, 1fr)'
                : 'repeat(4, 1fr)',
            gap: 'var(--linear-spacing-lg)',
            opacity: isPending ? 0.7 : 1,
            transition: 'opacity 0.3s ease'
          }}
        >
          <StatsCard
            title="진행 중인 프로젝트"
            value={filteredData?.projects ?? stats?.activeProjects ?? 0}
            icon={<FolderOpen className="w-5 h-5" />}
            color="blue"
            isLoading={statsLoading || filteredLoading}
          />

          <StatsCard
            title="완료된 프로젝트"
            value={stats?.completedProjects ?? 0}
            icon={<CheckCircle className="w-5 h-5" />}
            color="green"
            isLoading={statsLoading}
          />

          <StatsCard
            title="팀 멤버"
            value={stats?.teamMembers ?? 0}
            icon={<Users className="w-5 h-5" />}
            color="security"
            isLoading={statsLoading}
          />

          <StatsCard
            title="이번 달 생성된 이미지"
            value={stats?.generatedImages ?? 0}
            icon={<ImageIcon className="w-5 h-5" />}
            color="orange"
            trend={stats?.monthlyGrowth}
            isLoading={statsLoading}
          />
        </div>
      </Suspense>

      {/* 메인 콘텐츠 그리드 */}
      <div className="linear-grid linear-grid-cols-1" style={{
        gridTemplateColumns: isTablet ? '1fr' : '2fr 1fr',
        gap: 'var(--linear-spacing-lg)'
      }}>
        {/* 차트 섹션 */}
        <div>
          <ProjectChart />
        </div>

        {/* 빠른 액션 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--linear-spacing-lg)' }}>
          <QuickActions />

          {/* 추가 통계 */}
          <div className="linear-card">
            <h3 className="linear-title-2" style={{ marginBottom: 'var(--linear-spacing-md)' }}>이번 주 활동</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--linear-spacing-md)' }}>
              <div className="linear-flex-between">
                <div className="linear-flex-start linear-gap-sm">
                  <Activity className="w-4 h-4 linear-accent-blue" />
                  <span className="linear-text-regular">총 활동</span>
                </div>
                <span className="linear-text-regular font-medium">
                  {stats?.totalActivities ?? 0}
                </span>
              </div>

              <div className="linear-flex-between">
                <div className="linear-flex-start linear-gap-sm">
                  <TrendingUp className="w-4 h-4 linear-accent-green" />
                  <span className="linear-text-regular">성장률</span>
                </div>
                <span className="linear-text-regular font-medium linear-accent-green">
                  +{stats?.monthlyGrowth ?? 0}%
                </span>
              </div>

              <div className="linear-flex-between">
                <div className="linear-flex-start linear-gap-sm">
                  <Clock className="w-4 h-4 linear-accent-orange" />
                  <span className="linear-text-regular">평균 응답 시간</span>
                </div>
                <span className="linear-text-regular font-medium">
                  1.2초
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div style={{ marginTop: 'var(--linear-spacing-xl)' }}>
        <RecentActivity />
      </div>

    </div>
  )
}