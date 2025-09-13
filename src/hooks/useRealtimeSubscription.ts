import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/react-query'
import { useProjectStore } from '@/stores/projectStore'
import { useNotifications } from '@/stores/uiStore'

interface RealtimeSubscriptionOptions {
  table: string
  filter?: string
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
  enabled?: boolean
}

/**
 * Supabase 실시간 구독을 위한 커스텀 훅
 */
export function useRealtimeSubscription(options: RealtimeSubscriptionOptions) {
  const {
    table,
    filter,
    onInsert,
    onUpdate,
    onDelete,
    enabled = true,
  } = options

  const channelRef = useRef<RealtimeChannel | null>(null)
  const queryClient = useQueryClient()
  const { showInfo } = useNotifications()

  useEffect(() => {
    if (!enabled) return

    // 채널 이름 생성
    const channelName = `${table}${filter ? `-${filter}` : ''}-${Date.now()}`

    // 실시간 구독 설정
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          console.log('Real-time INSERT:', payload)
          onInsert?.(payload)

          // 관련 쿼리 무효화
          queryClient.invalidateQueries({
            queryKey: getQueryKeysForTable(table)
          })

          // 알림 표시
          showInfo('새 데이터', `${table}에 새로운 항목이 추가되었습니다.`)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          console.log('Real-time UPDATE:', payload)
          onUpdate?.(payload)

          // 관련 쿼리 무효화
          queryClient.invalidateQueries({
            queryKey: getQueryKeysForTable(table)
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          console.log('Real-time DELETE:', payload)
          onDelete?.(payload)

          // 관련 쿼리 무효화
          queryClient.invalidateQueries({
            queryKey: getQueryKeysForTable(table)
          })

          // 알림 표시
          showInfo('데이터 삭제', `${table}에서 항목이 삭제되었습니다.`)
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [table, filter, enabled, onInsert, onUpdate, onDelete, queryClient, showInfo])

  return {
    isConnected: channelRef.current?.state === 'joined',
    disconnect: () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    },
  }
}

/**
 * 프로젝트 실시간 구독
 */
export function useProjectRealtimeSubscription() {
  const { addProject, updateProject, removeProject } = useProjectStore()

  return useRealtimeSubscription({
    table: 'projects',
    onInsert: (payload) => {
      if (payload.new) {
        addProject(payload.new)
      }
    },
    onUpdate: (payload) => {
      if (payload.new) {
        updateProject(payload.new.id, payload.new)
      }
    },
    onDelete: (payload) => {
      if (payload.old) {
        removeProject(payload.old.id)
      }
    },
  })
}

/**
 * 문서 실시간 구독
 */
export function useDocumentRealtimeSubscription(projectId?: string) {
  const queryClient = useQueryClient()

  return useRealtimeSubscription({
    table: 'documents',
    filter: projectId ? `project_id=eq.${projectId}` : undefined,
    onInsert: () => {
      // 문서 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.lists(),
      })
    },
    onUpdate: (payload) => {
      // 특정 문서 쿼리 업데이트
      if (payload.new) {
        queryClient.setQueryData(
          queryKeys.documents.detail(payload.new.id),
          payload.new
        )
      }
    },
    onDelete: (payload) => {
      // 문서 목록에서 제거
      if (payload.old) {
        queryClient.removeQueries({
          queryKey: queryKeys.documents.detail(payload.old.id),
        })
      }
    },
  })
}

/**
 * 사용자 활동 실시간 구독
 */
export function useActivityRealtimeSubscription() {
  const queryClient = useQueryClient()

  return useRealtimeSubscription({
    table: 'activities',
    onInsert: () => {
      // 최근 활동 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.analytics.activity(),
      })
    },
  })
}

/**
 * 이미지 생성 실시간 구독
 */
export function useImageGenerationRealtimeSubscription() {
  const queryClient = useQueryClient()

  return useRealtimeSubscription({
    table: 'generated_images',
    onInsert: () => {
      // 이미지 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.images.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.images.recent(),
      })
    },
  })
}

/**
 * 테이블명에 따른 관련 쿼리 키 반환
 */
function getQueryKeysForTable(table: string): string[] {
  switch (table) {
    case 'projects':
      return [...queryKeys.projects.all]
    case 'documents':
      return [...queryKeys.documents.all]
    case 'users':
      return [...queryKeys.users.all]
    case 'activities':
      return [...queryKeys.analytics.all]
    case 'generated_images':
      return [...queryKeys.images.all]
    default:
      return []
  }
}

/**
 * 다중 테이블 실시간 구독을 위한 훅
 */
export function useMultiTableRealtimeSubscription() {
  const projectSubscription = useProjectRealtimeSubscription()
  const documentSubscription = useDocumentRealtimeSubscription()
  const activitySubscription = useActivityRealtimeSubscription()
  const imageSubscription = useImageGenerationRealtimeSubscription()

  return {
    projects: projectSubscription,
    documents: documentSubscription,
    activities: activitySubscription,
    images: imageSubscription,
    isAllConnected: [
      projectSubscription.isConnected,
      documentSubscription.isConnected,
      activitySubscription.isConnected,
      imageSubscription.isConnected,
    ].every(Boolean),
    disconnectAll: () => {
      projectSubscription.disconnect()
      documentSubscription.disconnect()
      activitySubscription.disconnect()
      imageSubscription.disconnect()
    },
  }
}