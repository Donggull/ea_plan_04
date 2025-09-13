/**
 * React 19 향상된 Error Boundary
 * 새로운 Suspense 기능과 통합된 에러 처리
 */
import { Component, type ErrorInfo, type ReactNode, Suspense } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
  retryCount: number
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  maxRetries?: number
  level?: 'page' | 'component' | 'feature'
  resetOnPropsChange?: boolean
  resetKeys?: string[]
}

export class EnhancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substring(2)}`

    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo
    })

    // 커스텀 에러 핸들러 호출
    this.props.onError?.(error, errorInfo)

    // 에러 로깅 (실제 환경에서는 외부 서비스로 전송)
    this.logError(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props
    const { hasError } = this.state

    // props 변경 시 에러 상태 리셋
    if (hasError && resetOnPropsChange) {
      if (resetKeys) {
        const hasResetKeyChanged = resetKeys.some(
          (key) => prevProps[key as keyof ErrorBoundaryProps] !== this.props[key as keyof ErrorBoundaryProps]
        )
        if (hasResetKeyChanged) {
          this.resetErrorBoundary()
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      level: this.props.level || 'component'
    }

    console.error('Error Boundary caught an error:', errorReport)

    // 실제 환경에서는 외부 에러 추적 서비스로 전송
    // 예: Sentry, LogRocket, DataDog 등
  }

  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    })
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }))

      // 자동 재시도 (선택적)
      this.resetTimeoutId = window.setTimeout(() => {
        this.resetErrorBoundary()
      }, 1000)
    }
  }

  private renderErrorUI = () => {
    const { error, errorId, retryCount } = this.state
    const { maxRetries = 3, level = 'component' } = this.props

    const canRetry = retryCount < maxRetries

    return (
      <div className="linear-card linear-error-boundary" role="alert">
        {/* 에러 아이콘 및 제목 */}
        <div className="linear-flex-start linear-gap-md mb-4">
          <div className="linear-error-icon">
            <AlertTriangle className="w-6 h-6 linear-accent-red" />
          </div>
          <div>
            <h3 className="linear-title-2 linear-accent-red">
              {level === 'page' ? '페이지 오류' : level === 'feature' ? '기능 오류' : '컴포넌트 오류'}
            </h3>
            <p className="linear-text-small linear-text-tertiary">
              오류 ID: {errorId}
            </p>
          </div>
        </div>

        {/* 에러 메시지 */}
        <div className="linear-error-details mb-6">
          <p className="linear-text-regular mb-2">
            죄송합니다. 예상치 못한 오류가 발생했습니다.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="linear-error-technical">
              <summary className="linear-text-small cursor-pointer mb-2">
                기술적 세부사항 보기
              </summary>
              <div className="linear-code-block p-3 rounded bg-gray-100 dark:bg-gray-800">
                <p className="font-mono text-sm text-red-600 dark:text-red-400">
                  {error?.message}
                </p>
                {error?.stack && (
                  <pre className="font-mono text-xs mt-2 text-gray-600 dark:text-gray-400 overflow-x-auto">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="linear-flex-start linear-gap-md">
          {canRetry && (
            <button
              onClick={this.handleRetry}
              className="linear-button linear-button-primary linear-flex-center linear-gap-sm"
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도 ({maxRetries - retryCount}회 남음)
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="linear-button linear-button-secondary linear-flex-center linear-gap-sm"
          >
            <RefreshCw className="w-4 h-4" />
            페이지 새로고침
          </button>

          {level === 'page' && (
            <button
              onClick={() => window.location.href = '/'}
              className="linear-button linear-button-ghost linear-flex-center linear-gap-sm"
            >
              <Home className="w-4 h-4" />
              홈으로 이동
            </button>
          )}

          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify({
                  errorId,
                  message: error?.message,
                  stack: error?.stack,
                  timestamp: new Date().toISOString()
                }, null, 2))
                alert('에러 정보가 클립보드에 복사되었습니다.')
              }}
              className="linear-button linear-button-ghost linear-flex-center linear-gap-sm"
            >
              <Bug className="w-4 h-4" />
              에러 정보 복사
            </button>
          )}
        </div>
      </div>
    )
  }

  render() {
    const { hasError } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      return fallback || this.renderErrorUI()
    }

    return children
  }
}

// HOC 형태의 에러 바운더리
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </EnhancedErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Suspense와 통합된 컴포넌트
interface SuspenseErrorBoundaryProps extends ErrorBoundaryProps {
  loadingFallback?: ReactNode
  suspenseKey?: string
}

export function SuspenseErrorBoundary({
  children,
  loadingFallback,
  suspenseKey,
  ...errorBoundaryProps
}: SuspenseErrorBoundaryProps) {
  const defaultLoadingFallback = (
    <div className="linear-loading-container">
      <div className="linear-spinner" />
      <p className="linear-text-regular linear-text-tertiary mt-4">
        로딩 중...
      </p>
    </div>
  )

  return (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Suspense
        key={suspenseKey}
        fallback={loadingFallback || defaultLoadingFallback}
      >
        {children}
      </Suspense>
    </EnhancedErrorBoundary>
  )
}

// 에러 바운더리 훅 (에러 상태 접근)
export function useErrorBoundary() {
  return {
    captureError: (error: Error) => {
      throw error
    }
  }
}