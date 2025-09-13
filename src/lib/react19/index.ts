/**
 * React 19 새로운 기능들을 통합 export
 * 편리한 import를 위한 index 파일
 */

// Server Components 관련
export * from '@/lib/server-components'

// use() Hook과 Promise 관리
export * from '@/hooks/useProjectData'

// Concurrent Features
export * from '@/lib/concurrent/batchUpdates'

// Enhanced Error Boundaries
export * from '@/components/error/EnhancedErrorBoundary'

// Enhanced Loading States
export * from '@/components/loading/EnhancedLoadingStates'

// Performance Profiler
export * from '@/lib/performance/ReactProfiler'

// React 19 기능 활용 예시 컴포넌트
export { React19ShowcaseComponent } from './React19Showcase'

/**
 * React 19 주요 기능 요약:
 *
 * 1. Server Components 모의 구현
 *    - 데이터 페칭 최적화
 *    - 캐시 관리
 *    - 스트리밍 SSR 준비
 *
 * 2. use() Hook
 *    - Promise 해결을 위한 새로운 훅
 *    - Suspense와 자동 통합
 *    - 에러 처리 내장
 *
 * 3. Concurrent Features
 *    - startTransition: 논블로킹 상태 업데이트
 *    - useDeferredValue: 값 지연 처리
 *    - 자동 배치 업데이트
 *
 * 4. Enhanced Suspense
 *    - 향상된 에러 바운더리
 *    - 다양한 로딩 상태
 *    - 네트워크 인식 로딩
 *
 * 5. DevTools Profiler
 *    - 성능 모니터링
 *    - 렌더링 최적화 제안
 *    - 실시간 성능 대시보드
 */