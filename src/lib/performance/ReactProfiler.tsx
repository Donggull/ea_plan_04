/**
 * React 19 DevTools Profiler 활용 유틸리티
 * 성능 모니터링 및 최적화 도구
 */
import { Profiler, ProfilerOnRenderCallback, ReactNode, useState, useEffect, useMemo } from 'react'

// 성능 메트릭 타입
interface PerformanceMetric {
  id: string
  phase: 'mount' | 'update'
  actualDuration: number
  baseDuration: number
  startTime: number
  commitTime: number
  interactions: Set<any>
  timestamp: number
}

// 성능 통계
interface PerformanceStats {
  totalRenders: number
  averageRenderTime: number
  slowestRender: number
  fastestRender: number
  mountTime: number
  updateTime: number
  lastRender: number
}

// 성능 임계값
const PERFORMANCE_THRESHOLDS = {
  SLOW_RENDER: 16, // 16ms (60fps 기준)
  VERY_SLOW_RENDER: 100, // 100ms
  WARNING_RENDER_COUNT: 10, // 10회 이상 렌더링 시 경고
}

// 성능 데이터 저장소
class PerformanceStore {
  private static instance: PerformanceStore
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private stats: Map<string, PerformanceStats> = new Map()
  private listeners: Map<string, Array<(stats: PerformanceStats) => void>> = new Map()

  static getInstance(): PerformanceStore {
    if (!this.instance) {
      this.instance = new PerformanceStore()
    }
    return this.instance
  }

  addMetric(metric: PerformanceMetric) {
    const { id } = metric

    if (!this.metrics.has(id)) {
      this.metrics.set(id, [])
    }

    const componentMetrics = this.metrics.get(id)!
    componentMetrics.push(metric)

    // 최대 100개 메트릭만 저장 (메모리 관리)
    if (componentMetrics.length > 100) {
      componentMetrics.shift()
    }

    this.updateStats(id)
    this.notifyListeners(id)
  }

  private updateStats(id: string) {
    const componentMetrics = this.metrics.get(id) || []
    if (componentMetrics.length === 0) return

    const renderTimes = componentMetrics.map(m => m.actualDuration)
    const mountMetrics = componentMetrics.filter(m => m.phase === 'mount')
    const updateMetrics = componentMetrics.filter(m => m.phase === 'update')

    const stats: PerformanceStats = {
      totalRenders: componentMetrics.length,
      averageRenderTime: renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length,
      slowestRender: Math.max(...renderTimes),
      fastestRender: Math.min(...renderTimes),
      mountTime: mountMetrics.length > 0 ? mountMetrics[0].actualDuration : 0,
      updateTime: updateMetrics.length > 0 ?
        updateMetrics.reduce((a, b) => a + b.actualDuration, 0) / updateMetrics.length : 0,
      lastRender: componentMetrics[componentMetrics.length - 1].actualDuration
    }

    this.stats.set(id, stats)
  }

  getStats(id: string): PerformanceStats | undefined {
    return this.stats.get(id)
  }

  getAllStats(): Record<string, PerformanceStats> {
    const result: Record<string, PerformanceStats> = {}
    this.stats.forEach((stats, id) => {
      result[id] = stats
    })
    return result
  }

  subscribe(id: string, callback: (stats: PerformanceStats) => void): () => void {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, [])
    }

    const componentListeners = this.listeners.get(id)!
    componentListeners.push(callback)

    return () => {
      const index = componentListeners.indexOf(callback)
      if (index > -1) {
        componentListeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(id: string) {
    const listeners = this.listeners.get(id) || []
    const stats = this.stats.get(id)

    if (stats) {
      listeners.forEach(listener => listener(stats))
    }
  }

  exportData(): string {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: Object.fromEntries(this.metrics),
      stats: Object.fromEntries(this.stats)
    }

    return JSON.stringify(data, null, 2)
  }

  clear() {
    this.metrics.clear()
    this.stats.clear()
    this.listeners.clear()
  }
}

const performanceStore = PerformanceStore.getInstance()

// React Profiler 래퍼 컴포넌트
interface ReactProfilerProps {
  id: string
  children: ReactNode
  enabled?: boolean
  onSlowRender?: (id: string, duration: number) => void
  threshold?: number
}

export function ReactProfiler({
  id,
  children,
  enabled = process.env.NODE_ENV === 'development',
  onSlowRender,
  threshold = PERFORMANCE_THRESHOLDS.SLOW_RENDER
}: ReactProfilerProps) {
  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    if (!enabled) return

    const metric: PerformanceMetric = {
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions,
      timestamp: Date.now()
    }

    performanceStore.addMetric(metric)

    // 느린 렌더링 감지
    if (actualDuration > threshold) {
      console.warn(
        `Slow render detected in "${id}": ${actualDuration.toFixed(2)}ms (threshold: ${threshold}ms)`,
        {
          phase,
          actualDuration,
          baseDuration,
          interactions: Array.from(interactions)
        }
      )

      onSlowRender?.(id, actualDuration)
    }
  }

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  )
}

// 성능 모니터링 훅
export function usePerformanceStats(componentId: string) {
  const [stats, setStats] = useState<PerformanceStats | undefined>()

  useEffect(() => {
    const unsubscribe = performanceStore.subscribe(componentId, setStats)

    // 초기 데이터 로드
    const initialStats = performanceStore.getStats(componentId)
    if (initialStats) {
      setStats(initialStats)
    }

    return unsubscribe
  }, [componentId])

  return stats
}

// 성능 경고 시스템
export function usePerformanceWarnings(componentId: string, options: {
  slowRenderThreshold?: number
  maxRenderCount?: number
} = {}) {
  const {
    slowRenderThreshold = PERFORMANCE_THRESHOLDS.SLOW_RENDER,
    maxRenderCount = PERFORMANCE_THRESHOLDS.WARNING_RENDER_COUNT
  } = options

  const stats = usePerformanceStats(componentId)

  const warnings = useMemo(() => {
    if (!stats) return []

    const warnings: string[] = []

    if (stats.averageRenderTime > slowRenderThreshold) {
      warnings.push(`평균 렌더링 시간이 느림: ${stats.averageRenderTime.toFixed(2)}ms`)
    }

    if (stats.slowestRender > PERFORMANCE_THRESHOLDS.VERY_SLOW_RENDER) {
      warnings.push(`매우 느린 렌더링 감지: ${stats.slowestRender.toFixed(2)}ms`)
    }

    if (stats.totalRenders > maxRenderCount) {
      warnings.push(`과도한 렌더링: ${stats.totalRenders}회`)
    }

    return warnings
  }, [stats, slowRenderThreshold, maxRenderCount])

  return {
    stats,
    warnings,
    hasWarnings: warnings.length > 0
  }
}

// 성능 대시보드 컴포넌트
export function PerformanceDashboard() {
  const [allStats, setAllStats] = useState<Record<string, PerformanceStats>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateStats = () => {
      setAllStats(performanceStore.getAllStats())
    }

    const interval = setInterval(updateStats, 1000)
    updateStats() // 초기 로드

    return () => clearInterval(interval)
  }, [])

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg z-50"
        title="성능 대시보드 열기"
      >
        📊
      </button>
    )
  }

  const exportData = () => {
    const data = performanceStore.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">성능 대시보드</h2>
          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              내보내기
            </button>
            <button
              onClick={() => {
                performanceStore.clear()
                setAllStats({})
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              초기화
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              닫기
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(allStats).map(([componentId, stats]) => (
            <div key={componentId} className="border rounded p-4">
              <h3 className="font-semibold mb-2">{componentId}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">총 렌더링:</span>
                  <span className="ml-2 font-mono">{stats.totalRenders}</span>
                </div>
                <div>
                  <span className="text-gray-600">평균 시간:</span>
                  <span className={`ml-2 font-mono ${
                    stats.averageRenderTime > PERFORMANCE_THRESHOLDS.SLOW_RENDER
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}>
                    {stats.averageRenderTime.toFixed(2)}ms
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">최대 시간:</span>
                  <span className={`ml-2 font-mono ${
                    stats.slowestRender > PERFORMANCE_THRESHOLDS.VERY_SLOW_RENDER
                      ? 'text-red-600'
                      : stats.slowestRender > PERFORMANCE_THRESHOLDS.SLOW_RENDER
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}>
                    {stats.slowestRender.toFixed(2)}ms
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">마지막 렌더링:</span>
                  <span className="ml-2 font-mono">
                    {stats.lastRender.toFixed(2)}ms
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {Object.keys(allStats).length === 0 && (
          <p className="text-center text-gray-500 py-8">
            성능 데이터가 없습니다. 컴포넌트를 사용해보세요.
          </p>
        )}
      </div>
    </div>
  )
}

// HOC 형태의 프로파일러
export function withProfiler<P extends object>(
  Component: React.ComponentType<P>,
  id?: string,
  options?: Omit<ReactProfilerProps, 'children' | 'id'>
) {
  const WrappedComponent = (props: P) => {
    const componentId = id || Component.displayName || Component.name || 'UnknownComponent'

    return (
      <ReactProfiler id={componentId} {...options}>
        <Component {...props} />
      </ReactProfiler>
    )
  }

  WrappedComponent.displayName = `withProfiler(${Component.displayName || Component.name})`

  return WrappedComponent
}

// 성능 최적화 제안 시스템
export function usePerformanceRecommendations(componentId: string) {
  const stats = usePerformanceStats(componentId)

  const recommendations = useMemo(() => {
    if (!stats) return []

    const recommendations: string[] = []

    if (stats.averageRenderTime > PERFORMANCE_THRESHOLDS.SLOW_RENDER) {
      recommendations.push('React.memo() 사용을 고려해보세요')
      recommendations.push('useMemo() 또는 useCallback() 으로 값을 메모이제이션하세요')
    }

    if (stats.totalRenders > PERFORMANCE_THRESHOLDS.WARNING_RENDER_COUNT) {
      recommendations.push('불필요한 리렌더링을 방지하세요')
      recommendations.push('useState의 함수형 업데이트를 사용하세요')
    }

    if (stats.slowestRender > PERFORMANCE_THRESHOLDS.VERY_SLOW_RENDER) {
      recommendations.push('컴포넌트를 더 작은 단위로 분리하세요')
      recommendations.push('React.lazy()로 코드 스플리팅을 고려하세요')
    }

    return recommendations
  }, [stats])

  return recommendations
}

export { performanceStore }