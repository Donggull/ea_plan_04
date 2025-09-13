/**
 * React 19 새로운 기능들을 보여주는 예시 컴포넌트
 * 개발 및 테스트 목적
 */
import { useState, useDeferredValue, useTransition, Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  useProjectData,
  useProject,
  preloadProjectData
} from '@/hooks/useProjectData'
import {
  ReactProfiler,
  usePerformanceStats,
  usePerformanceWarnings
} from '@/lib/performance/ReactProfiler'
import {
  EnhancedLoading,
  SuspenseLoading,
  useLoadingState
} from '@/components/loading/EnhancedLoadingStates'
import {
  EnhancedErrorBoundary,
  SuspenseErrorBoundary
} from '@/components/error/EnhancedErrorBoundary'
import {
  batchUpdates,
  createOptimizedUpdater
} from '@/lib/concurrent/batchUpdates'

export function React19ShowcaseComponent() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isPending, startTransition] = useTransition()
  const loadingState = useLoadingState()

  // useDeferredValue 예시
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const deferredFilterType = useDeferredValue(filterType)

  // 최적화된 상태 업데이트
  const optimizedSetSearch = createOptimizedUpdater(setSearchTerm)

  // 성능 모니터링
  const performanceStats = usePerformanceStats('React19Showcase')
  const { warnings, hasWarnings } = usePerformanceWarnings('React19Showcase')

  // 검색어 변경 핸들러 (startTransition 사용)
  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchTerm(value)
    })
  }

  // 배치 업데이트 예시
  const handleBatchUpdate = () => {
    batchUpdates.addMultiple([
      () => setSearchTerm('배치 업데이트'),
      () => setFilterType('active'),
      () => loadingState.setProgress(100)
    ])
  }

  // 프로젝트 데이터 프리로딩
  const handlePreload = () => {
    if (user?.id) {
      preloadProjectData.userProjects(user.id)
      preloadProjectData.projectStats(user.id)
    }
  }

  return (
    <ReactProfiler id="React19Showcase">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">React 19 기능 쇼케이스</h1>

        {/* 성능 경고 표시 */}
        {hasWarnings && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <h3 className="font-semibold mb-2">성능 경고:</h3>
            <ul className="list-disc list-inside">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Concurrent Features 데모 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Concurrent Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                검색어 (startTransition 적용)
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full p-2 border rounded transition-opacity ${
                  isPending ? 'opacity-50' : 'opacity-100'
                }`}
                placeholder="검색어를 입력하세요..."
              />
              {isPending && (
                <p className="text-sm text-blue-600 mt-1">검색 중...</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                지연된 값 (useDeferredValue)
              </label>
              <div className="p-2 bg-gray-100 rounded">
                <p>실시간: {searchTerm || '없음'}</p>
                <p>지연된 값: {deferredSearchTerm || '없음'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleBatchUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            배치 업데이트 실행
          </button>

          <button
            onClick={handlePreload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            데이터 프리로드
          </button>
        </section>

        {/* use() Hook 데모 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">use() Hook과 Suspense</h2>

          <SuspenseErrorBoundary
            level="component"
            loadingFallback={
              <EnhancedLoading
                state={{ isLoading: true, message: '프로젝트 데이터를 불러오는 중...' }}
                variant="skeleton"
              />
            }
          >
            <ProjectDataDemo userId={user?.id || ''} />
          </SuspenseErrorBoundary>
        </section>

        {/* Enhanced Loading States 데모 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Enhanced Loading States</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Spinner Loading</h3>
              <EnhancedLoading
                state={{ isLoading: true, message: '로딩 중...' }}
                variant="spinner"
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Skeleton Loading</h3>
              <EnhancedLoading
                state={{ isLoading: true }}
                variant="skeleton"
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Progress Loading</h3>
              <EnhancedLoading
                state={{
                  isLoading: true,
                  progress: 65,
                  message: '처리 중...'
                }}
                variant="progress"
              />
            </div>
          </div>
        </section>

        {/* 성능 통계 */}
        {performanceStats && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">성능 통계</h2>
            <div className="bg-gray-100 p-4 rounded">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold">총 렌더링:</span>
                  <span className="ml-2">{performanceStats.totalRenders}</span>
                </div>
                <div>
                  <span className="font-semibold">평균 시간:</span>
                  <span className="ml-2">{performanceStats.averageRenderTime.toFixed(2)}ms</span>
                </div>
                <div>
                  <span className="font-semibold">최대 시간:</span>
                  <span className="ml-2">{performanceStats.slowestRender.toFixed(2)}ms</span>
                </div>
                <div>
                  <span className="font-semibold">마지막 렌더링:</span>
                  <span className="ml-2">{performanceStats.lastRender.toFixed(2)}ms</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </ReactProfiler>
  )
}

// use() Hook을 사용하는 컴포넌트
function ProjectDataDemo({ userId }: { userId: string }) {
  if (!userId) {
    return <div className="p-4 text-gray-500">로그인이 필요합니다.</div>
  }

  // use() Hook 사용 - Suspense와 자동으로 통합됨
  const { projects } = useProjectData(userId)

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">프로젝트 목록 (use() Hook 사용)</h3>
      {projects && projects.length > 0 ? (
        <ul className="space-y-1">
          {projects.slice(0, 3).map((project) => (
            <li key={project.id} className="p-2 bg-gray-50 rounded">
              <span className="font-medium">{project.title}</span>
              <span className="ml-2 text-sm text-gray-600">({project.status})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">프로젝트가 없습니다.</p>
      )}
    </div>
  )
}

// 개발 환경에서만 표시되는 React 19 기능 가이드
export function React19FeatureGuide() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white shadow-lg rounded-lg p-4 max-w-sm border z-50">
      <h3 className="font-bold text-lg mb-2">React 19 기능</h3>
      <ul className="text-sm space-y-1">
        <li>✅ Server Components 모의 구현</li>
        <li>✅ use() Hook 활용</li>
        <li>✅ startTransition & useDeferredValue</li>
        <li>✅ 자동 배치 업데이트</li>
        <li>✅ Enhanced Suspense & Error Boundaries</li>
        <li>✅ DevTools Profiler 통합</li>
      </ul>
      <p className="text-xs text-gray-600 mt-2">
        개발 환경에서만 표시됩니다.
      </p>
    </div>
  )
}