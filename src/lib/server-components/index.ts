/**
 * React 19 Server Components 모의 구현
 * 데이터 페칭 최적화 및 스트리밍 SSR 준비
 */
import { supabase } from '@/lib/supabase/client'

// 서버 컴포넌트 스타일의 데이터 페처
export interface ServerComponentData<T> {
  data: T | null
  error: string | null
  loading: boolean
  promise?: Promise<T>
}

// 데이터 페칭 최적화를 위한 캐시 관리
class DataCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>()

  set<T>(key: string, data: T, ttl = 300000) { // 5분 기본 TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > cached.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  invalidate(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }
}

export const serverCache = new DataCache()

// 서버 컴포넌트 스타일의 데이터 페처 팩토리
export function createServerDataFetcher<T>(
  key: string,
  fetcher: () => Promise<{ data: T | null; error: unknown }>,
  options: { ttl?: number; enableCache?: boolean } = {}
) {
  const { ttl = 300000, enableCache = true } = options

  return async (): Promise<ServerComponentData<T>> => {
    // 캐시 확인
    if (enableCache) {
      const cached = serverCache.get<T>(key)
      if (cached) {
        return {
          data: cached,
          error: null,
          loading: false
        }
      }
    }

    try {
      const result = await fetcher()

      if (result.error) {
        return {
          data: null,
          error: (result.error as any)?.message || 'Unknown error',
          loading: false
        }
      }

      // 캐시에 저장
      if (enableCache && result.data) {
        serverCache.set(key, result.data, ttl)
      }

      return {
        data: result.data,
        error: null,
        loading: false
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false
      }
    }
  }
}

// 프로젝트 데이터를 위한 서버 컴포넌트 페처
export const projectServerFetcher = {
  // 사용자 프로젝트 목록 페칭
  getUserProjects: createServerDataFetcher(
    'user-projects',
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      return await supabase
        .from('projects')
        .select('*')
        .or(`owner_id.eq.${user.id},team_members.cs.{${user.id}}`)
        .order('updated_at', { ascending: false })
    },
    { ttl: 180000 } // 3분
  ),

  // 특정 프로젝트 페칭
  getProject: (projectId: string) =>
    createServerDataFetcher(
      `project-${projectId}`,
      async () => {
        return await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single()
      },
      { ttl: 300000 } // 5분
    ),

  // 프로젝트 통계 페칭
  getProjectStats: (userId: string) =>
    createServerDataFetcher(
      `project-stats-${userId}`,
      async () => {
        const { data } = await supabase
          .from('projects')
          .select('status')
          .or(`owner_id.eq.${userId},team_members.cs.{${userId}}`)

        if (!data) return { data: null, error: null }

        const stats = {
          total: data.length,
          active: data.filter(p => p.status === 'active').length,
          completed: data.filter(p => p.status === 'completed').length,
          planning: data.filter(p => p.status === 'planning').length
        }

        return { data: stats, error: null }
      },
      { ttl: 120000 } // 2분
    )
}

// 사용자 데이터를 위한 서버 컴포넌트 페처
export const userServerFetcher = {
  getCurrentUser: createServerDataFetcher(
    'current-user',
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { data: null, error: null }

      return await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
    },
    { ttl: 600000 } // 10분
  ),

  getUserOrganization: (userId: string) =>
    createServerDataFetcher(
      `user-org-${userId}`,
      async () => {
        return await supabase
          .from('organizations')
          .select('*')
          .eq('owner_id', userId)
          .single()
      },
      { ttl: 600000 } // 10분
    )
}

// 스트리밍을 위한 데이터 프리페치 유틸리티
export function prefetchData<T>(
  fetchers: Array<() => Promise<ServerComponentData<T>>>
): Promise<ServerComponentData<T>[]> {
  return Promise.all(fetchers.map(fetcher => fetcher()))
}

// 병렬 데이터 페칭을 위한 유틸리티
export function parallelFetch<T extends Record<string, any>>(
  fetchers: { [K in keyof T]: () => Promise<ServerComponentData<T[K]>> }
): Promise<{ [K in keyof T]: ServerComponentData<T[K]> }> {
  const entries = Object.entries(fetchers) as Array<[keyof T, () => Promise<ServerComponentData<T[keyof T]>>]>

  return Promise.all(
    entries.map(async ([key, fetcher]) => [key, await fetcher()] as const)
  ).then(results => {
    return Object.fromEntries(results) as { [K in keyof T]: ServerComponentData<T[K]> }
  })
}

// 실시간 업데이트를 위한 무효화 헬퍼
export const cacheInvalidation = {
  invalidateUserData: (userId: string) => {
    serverCache.invalidate('current-user')
    serverCache.invalidate(`user-org-${userId}`)
    serverCache.invalidate('user-projects')
    serverCache.invalidate(`project-stats-${userId}`)
  },

  invalidateProjectData: (projectId: string) => {
    serverCache.invalidate(`project-${projectId}`)
    serverCache.invalidate('user-projects')
  },

  invalidateAll: () => {
    serverCache.clear()
  }
}