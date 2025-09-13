/**
 * React 19 use() Hook 활용 프로젝트 데이터 훅
 * Promise 처리 및 Suspense 통합
 */
import { use, useMemo, useCallback, useSyncExternalStore } from 'react'
import { projectQueries } from '@/lib/supabase/queries'
import { projectServerFetcher, cacheInvalidation } from '@/lib/server-components'
import { type Project } from '@/types/database'

// Promise 상태 관리를 위한 타입
interface PromiseState<T> {
  status: 'pending' | 'fulfilled' | 'rejected'
  value?: T
  error?: Error
}

// Promise 캐시 관리
class PromiseCache {
  private promises = new Map<string, Promise<unknown>>()
  private states = new Map<string, PromiseState<unknown>>()

  getPromise<T>(key: string, factory: () => Promise<T>): Promise<T> {
    if (!this.promises.has(key)) {
      const promise = factory()
      this.promises.set(key, promise)

      // Promise 상태 추적
      this.states.set(key, { status: 'pending' })

      promise
        .then(value => {
          this.states.set(key, { status: 'fulfilled', value })
        })
        .catch(error => {
          this.states.set(key, { status: 'rejected', error })
          this.promises.delete(key) // 실패한 promise는 제거하여 재시도 가능하게
        })
    }

    return this.promises.get(key) as Promise<T>
  }

  invalidate(key: string) {
    this.promises.delete(key)
    this.states.delete(key)
  }

  getState<T>(key: string): PromiseState<T> | undefined {
    const state = this.states.get(key)
    return state ? { ...state, value: state.value as T } : undefined
  }
}

const promiseCache = new PromiseCache()

// use() Hook과 함께 사용할 프로젝트 데이터 팩토리
export function createProjectDataResource(userId: string) {
  const key = `user-projects-${userId}`

  return promiseCache.getPromise(key, async () => {
    const result = await projectQueries.getUserProjects(userId)
    if (result.error) {
      throw new Error(result.error.message || 'Failed to fetch projects')
    }
    return result.data || []
  })
}

// 특정 프로젝트 데이터 리소스
export function createSingleProjectResource(projectId: string) {
  const key = `project-${projectId}`

  return promiseCache.getPromise(key, async () => {
    const result = await projectQueries.getProjectById(projectId)
    if (result.error) {
      throw new Error(result.error.message || 'Failed to fetch project')
    }
    return result.data
  })
}

// 프로젝트 통계 리소스
export function createProjectStatsResource(userId: string) {
  const key = `project-stats-${userId}`

  return promiseCache.getPromise(key, async () => {
    const serverFetcher = projectServerFetcher.getProjectStats(userId)
    const result = await serverFetcher()

    if (result.error) {
      throw new Error(result.error)
    }

    return result.data
  })
}

// React 19 use() Hook을 활용한 프로젝트 데이터 훅
export function useProjectData(userId: string) {
  // Promise 생성 (메모이제이션)
  const projectsPromise = useMemo(
    () => createProjectDataResource(userId),
    [userId]
  )

  // use() Hook으로 Promise 해결 - Suspense와 자동 통합
  const projects = use(projectsPromise)

  // 프로젝트 무효화 함수
  const invalidateProjects = useCallback(() => {
    promiseCache.invalidate(`user-projects-${userId}`)
    cacheInvalidation.invalidateUserData(userId)
  }, [userId])

  // 프로젝트 생성
  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const { metadata, ...rest } = projectData
    const createData = {
      ...rest,
      metadata: metadata as any // Json 타입으로 캐스팅
    }
    const result = await projectQueries.createProject(createData)
    if (result.error) {
      throw new Error(result.error.message || 'Failed to create project')
    }

    // 캐시 무효화하여 새로운 데이터 페칭
    invalidateProjects()

    return result.data
  }, [invalidateProjects])

  // 프로젝트 업데이트
  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    const { metadata, ...rest } = updates
    const updateData = {
      ...rest,
      ...(metadata && { metadata: metadata as any })
    }
    const result = await projectQueries.updateProject(projectId, updateData)
    if (result.error) {
      throw new Error(result.error.message || 'Failed to update project')
    }

    // 관련 캐시 무효화
    invalidateProjects()
    promiseCache.invalidate(`project-${projectId}`)

    return result.data
  }, [invalidateProjects])

  return {
    projects,
    createProject,
    updateProject,
    invalidateProjects
  }
}

// 단일 프로젝트 데이터 훅
export function useProject(projectId: string) {
  const projectPromise = useMemo(
    () => createSingleProjectResource(projectId),
    [projectId]
  )

  const project = use(projectPromise)

  const invalidateProject = useCallback(() => {
    promiseCache.invalidate(`project-${projectId}`)
    cacheInvalidation.invalidateProjectData(projectId)
  }, [projectId])

  const updateProject = useCallback(async (updates: Partial<Project>) => {
    const { metadata, ...rest } = updates
    const updateData = {
      ...rest,
      ...(metadata && { metadata: metadata as any })
    }
    const result = await projectQueries.updateProject(projectId, updateData)
    if (result.error) {
      throw new Error(result.error.message || 'Failed to update project')
    }

    invalidateProject()
    return result.data
  }, [projectId, invalidateProject])

  return {
    project,
    updateProject,
    invalidateProject
  }
}

// 프로젝트 통계 훅
export function useProjectStats(userId: string) {
  const statsPromise = useMemo(
    () => createProjectStatsResource(userId),
    [userId]
  )

  const stats = use(statsPromise)

  const invalidateStats = useCallback(() => {
    promiseCache.invalidate(`project-stats-${userId}`)
  }, [userId])

  return {
    stats,
    invalidateStats
  }
}

// 외부 스토어 구독을 위한 유틸리티 (useSyncExternalStore와 함께 사용)
export function usePromiseState<T>(promiseKey: string) {
  return useSyncExternalStore(
    useCallback((callback) => {
      // 실제 구독 로직은 여기서 구현
      // 현재는 단순한 형태로 구현
      const interval = setInterval(callback, 1000)
      return () => clearInterval(interval)
    }, []),
    useCallback(() => promiseCache.getState<T>(promiseKey), [promiseKey])
  )
}

// 프리로딩을 위한 유틸리티
export const preloadProjectData = {
  userProjects: (userId: string) => {
    createProjectDataResource(userId)
  },

  project: (projectId: string) => {
    createSingleProjectResource(projectId)
  },

  projectStats: (userId: string) => {
    createProjectStatsResource(userId)
  }
}