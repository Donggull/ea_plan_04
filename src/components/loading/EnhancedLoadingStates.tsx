/**
 * React 19 향상된 Loading States
 * Suspense와 통합된 로딩 상태 관리
 */
import { ReactNode, useState, useEffect, useMemo, Suspense } from 'react'
import { Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react'

// 로딩 상태 타입
interface LoadingState {
  isLoading: boolean
  progress?: number
  message?: string
  stage?: string
  estimatedTime?: number
  error?: boolean
}

// 로딩 컴포넌트 Props
interface LoadingProps {
  state: LoadingState
  children?: ReactNode
  variant?: 'spinner' | 'skeleton' | 'progress' | 'pulse' | 'wave'
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  overlay?: boolean
  showMessage?: boolean
  showProgress?: boolean
  className?: string
}

// 기본 로딩 스피너
export function LoadingSpinner({
  size = 'md',
  className = ''
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <Loader2
      className={`animate-spin linear-accent-blue ${sizeClasses[size]} ${className}`}
    />
  )
}

// 스켈레톤 로딩
export function SkeletonLoading({
  lines = 3,
  height = 'h-4',
  className = ''
}: {
  lines?: number
  height?: string
  className?: string
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-pulse`}
          style={{
            animationDelay: `${i * 0.1}s`,
            width: `${100 - i * 10}%`
          }}
        />
      ))}
    </div>
  )
}

// 프로그레스 바
export function ProgressBar({
  progress = 0,
  showPercentage = true,
  message = '',
  className = ''
}: {
  progress?: number
  showPercentage?: boolean
  message?: string
  className?: string
}) {
  return (
    <div className={`w-full ${className}`}>
      {message && (
        <p className="linear-text-small linear-text-tertiary mb-2">
          {message}
        </p>
      )}
      <div className="linear-progress-container">
        <div className="linear-progress-track">
          <div
            className="linear-progress-bar transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        {showPercentage && (
          <span className="linear-text-small linear-text-tertiary ml-3">
            {Math.round(progress)}%
          </span>
        )}
      </div>
    </div>
  )
}

// 펄스 효과 로딩
export function PulseLoading({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  )
}

// 웨이브 효과 로딩
export function WaveLoading({ className = '' }: { className?: string }) {
  return (
    <div className={`linear-flex-center linear-gap-sm ${className}`}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

// 통합 로딩 컴포넌트
export function EnhancedLoading({
  state,
  children,
  variant = 'spinner',
  size = 'md',
  fullScreen = false,
  overlay = false,
  showMessage = true,
  showProgress = true,
  className = ''
}: LoadingProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!state.isLoading) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000)
    }, 100)

    return () => {
      clearInterval(interval)
      setElapsedTime(0)
    }
  }, [state.isLoading])

  const renderLoadingContent = () => {
    switch (variant) {
      case 'skeleton':
        return <SkeletonLoading className={className} />

      case 'progress':
        return (
          <ProgressBar
            progress={state.progress || 0}
            message={state.message}
            className={className}
          />
        )

      case 'pulse':
        return (
          <PulseLoading className={className}>
            {children || <div className="w-full h-32 bg-gray-200 rounded" />}
          </PulseLoading>
        )

      case 'wave':
        return <WaveLoading className={className} />

      default:
        return (
          <div className={`linear-loading-content ${className}`}>
            <LoadingSpinner size={size} />
            {showMessage && state.message && (
              <p className="linear-text-regular linear-text-tertiary mt-4">
                {state.message}
              </p>
            )}
            {state.stage && (
              <p className="linear-text-small linear-text-tertiary mt-2">
                단계: {state.stage}
              </p>
            )}
            {showProgress && state.progress !== undefined && (
              <ProgressBar
                progress={state.progress}
                showPercentage
                className="mt-4 w-full max-w-xs"
              />
            )}
            {state.estimatedTime && elapsedTime < state.estimatedTime && (
              <p className="linear-text-small linear-text-tertiary mt-2">
                예상 남은 시간: {Math.max(0, state.estimatedTime - elapsedTime).toFixed(0)}초
              </p>
            )}
          </div>
        )
    }
  }

  if (!state.isLoading) {
    return <>{children}</>
  }

  const loadingContent = (
    <div className={`linear-loading-container ${
      fullScreen ? 'linear-loading-fullscreen' : ''
    } ${
      overlay ? 'linear-loading-overlay' : ''
    }`}>
      {renderLoadingContent()}
    </div>
  )

  return loadingContent
}

// 네트워크 상태 인식 로딩
export function NetworkAwareLoading({
  children,
  fallback
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 연결 속도 감지
    const connection = (navigator as any).connection
    if (connection) {
      const handleConnectionChange = () => {
        setIsSlowConnection(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
      }
      connection.addEventListener('change', handleConnectionChange)
      handleConnectionChange()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (connection) {
        connection.removeEventListener('change', () => {})
      }
    }
  }, [])

  if (!isOnline) {
    return (
      <div className="linear-card linear-error-boundary">
        <div className="linear-flex-center linear-gap-md mb-4">
          <WifiOff className="w-6 h-6 linear-accent-red" />
          <h3 className="linear-title-2">네트워크 연결 없음</h3>
        </div>
        <p className="linear-text-regular linear-text-tertiary mb-4">
          인터넷 연결을 확인하고 다시 시도해주세요.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="linear-button linear-button-primary linear-flex-center linear-gap-sm"
        >
          <RefreshCw className="w-4 h-4" />
          다시 시도
        </button>
      </div>
    )
  }

  if (isSlowConnection) {
    return (
      <div className="linear-card mb-4">
        <div className="linear-flex-center linear-gap-md mb-2">
          <Wifi className="w-5 h-5 linear-accent-orange" />
          <span className="linear-text-small linear-accent-orange">
            느린 네트워크가 감지되었습니다
          </span>
        </div>
        {fallback || (
          <EnhancedLoading
            state={{
              isLoading: true,
              message: '느린 연결로 인해 로딩이 지연될 수 있습니다...'
            }}
            variant="wave"
          />
        )}
        {children}
      </div>
    )
  }

  return <>{children}</>
}

// 단계적 로딩 관리자
export class LoadingStageManager {
  private stages: string[] = []
  private currentStageIndex = 0
  private listeners: Array<(state: LoadingState) => void> = []

  constructor(stages: string[]) {
    this.stages = stages
  }

  subscribe(listener: (state: LoadingState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  nextStage() {
    if (this.currentStageIndex < this.stages.length - 1) {
      this.currentStageIndex++
      this.notifyListeners()
    }
  }

  setProgress(progress: number) {
    this.notifyListeners(progress)
  }

  complete() {
    this.notifyListeners(100, false)
  }

  private notifyListeners(progress?: number, isLoading = true) {
    const state: LoadingState = {
      isLoading,
      stage: this.stages[this.currentStageIndex],
      progress: progress !== undefined ? progress :
        (this.currentStageIndex / (this.stages.length - 1)) * 100,
      message: `${this.stages[this.currentStageIndex]}...`
    }

    this.listeners.forEach(listener => listener(state))
  }

  reset() {
    this.currentStageIndex = 0
    this.notifyListeners(0)
  }
}

// Suspense 통합 래퍼
export function SuspenseLoading({
  children,
  fallback,
  variant = 'spinner'
}: {
  children: ReactNode
  fallback?: ReactNode
  variant?: 'spinner' | 'skeleton' | 'wave'
}) {
  const defaultFallback = (
    <EnhancedLoading
      state={{ isLoading: true, message: '컨텐츠를 불러오는 중...' }}
      variant={variant}
    />
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}

// 로딩 상태 훅
export function useLoadingState(initialLoading = false) {
  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading
  })

  const setLoading = (isLoading: boolean, options?: Partial<LoadingState>) => {
    setState(prev => ({
      ...prev,
      isLoading,
      ...options
    }))
  }

  const setProgress = (progress: number, message?: string) => {
    setState(prev => ({
      ...prev,
      progress,
      message: message || prev.message
    }))
  }

  const setStage = (stage: string, message?: string) => {
    setState(prev => ({
      ...prev,
      stage,
      message: message || prev.message
    }))
  }

  return {
    state,
    setLoading,
    setProgress,
    setStage,
    reset: () => setState({ isLoading: false })
  }
}