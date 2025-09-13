import { QueryClient } from '@tanstack/react-query'

// React Query 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 캐시 유지
      staleTime: 1000 * 60 * 5,
      // 1시간 후 가비지 컬렉션
      gcTime: 1000 * 60 * 60,
      // 네트워크 에러 시 3번 재시도
      retry: 3,
      // 백그라운드에서 자동 리페치 활성화
      refetchOnWindowFocus: true,
      // 마운트 시 자동 리페치
      refetchOnMount: true,
      // 네트워크 재연결 시 리페치
      refetchOnReconnect: true,
    },
    mutations: {
      // 뮤테이션 에러 시 1번 재시도
      retry: 1,
    },
  },
})

// 자주 사용하는 Query Key 팩토리
export const queryKeys = {
  // 프로젝트 관련
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.projects.lists(), { filters }] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },

  // 사용자 관련
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // 통계 관련
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    usage: () => [...queryKeys.analytics.all, 'usage'] as const,
    activity: () => [...queryKeys.analytics.all, 'activity'] as const,
  },

  // 문서 관련
  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (projectId: string) => [...queryKeys.documents.lists(), { projectId }] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.documents.details(), id] as const,
  },

  // 이미지 생성 관련
  images: {
    all: ['images'] as const,
    lists: () => [...queryKeys.images.all, 'list'] as const,
    recent: () => [...queryKeys.images.all, 'recent'] as const,
    usage: () => [...queryKeys.images.all, 'usage'] as const,
  },
} as const

// 에러 핸들러
export const queryErrorHandler = (error: unknown) => {
  console.error('Query Error:', error)

  // 401 Unauthorized - 로그인 필요
  if (error instanceof Error && error.message.includes('401')) {
    // AuthContext를 통해 로그아웃 처리
    window.location.href = '/login'
    return
  }

  // 403 Forbidden - 권한 없음
  if (error instanceof Error && error.message.includes('403')) {
    console.warn('권한이 없습니다.')
    return
  }

  // 500 Internal Server Error
  if (error instanceof Error && error.message.includes('500')) {
    console.error('서버 오류가 발생했습니다.')
    return
  }
}

// 뮤테이션 성공 핸들러
export const mutationSuccessHandler = (data: unknown, variables: unknown, context: unknown) => {
  console.log('Mutation Success:', { data, variables, context })
}

// 뮤테이션 에러 핸들러
export const mutationErrorHandler = (error: unknown, variables: unknown, context: unknown) => {
  console.error('Mutation Error:', { error, variables, context })
  queryErrorHandler(error)
}