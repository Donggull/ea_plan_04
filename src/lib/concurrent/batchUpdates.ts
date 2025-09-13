/**
 * React 19 자동 배치 업데이트 최적화 유틸리티
 * 상태 업데이트를 배치 처리하여 성능 개선
 */
import { unstable_batchedUpdates } from 'react-dom'
import { startTransition } from 'react'

// 배치 업데이트 큐 관리
class BatchUpdateQueue {
  private queue: Array<() => void> = []
  private isScheduled = false
  private timeoutId: number | null = null

  // 업데이트를 큐에 추가
  add(update: () => void) {
    this.queue.push(update)

    if (!this.isScheduled) {
      this.schedule()
    }
  }

  // 배치 실행 스케줄링
  private schedule() {
    this.isScheduled = true

    // React 19의 자동 배치를 활용하되, 추가 최적화 적용
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.timeoutId = window.setTimeout(() => {
      this.flush()
    }, 0)
  }

  // 큐에 쌓인 모든 업데이트를 배치 실행
  private flush() {
    if (this.queue.length === 0) return

    const updates = [...this.queue]
    this.queue = []
    this.isScheduled = false
    this.timeoutId = null

    // React 19에서는 자동으로 배치되지만, 명시적으로 startTransition 사용
    startTransition(() => {
      // 추가적으로 unstable_batchedUpdates로 래핑 (하위 호환성)
      unstable_batchedUpdates(() => {
        updates.forEach(update => {
          try {
            update()
          } catch (error) {
            console.error('Batch update error:', error)
          }
        })
      })
    })
  }

  // 큐 비우기
  clear() {
    this.queue = []
    this.isScheduled = false
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}

// 전역 배치 큐 인스턴스
const globalBatchQueue = new BatchUpdateQueue()

// 배치 업데이트 헬퍼 함수들
export const batchUpdates = {
  // 단일 업데이트를 배치에 추가
  add: (update: () => void) => {
    globalBatchQueue.add(update)
  },

  // 여러 업데이트를 한 번에 배치에 추가
  addMultiple: (updates: Array<() => void>) => {
    updates.forEach(update => globalBatchQueue.add(update))
  },

  // 즉시 모든 배치 업데이트 실행
  flushSync: (update: () => void) => {
    startTransition(() => {
      unstable_batchedUpdates(update)
    })
  },

  // 큐 초기화
  clear: () => {
    globalBatchQueue.clear()
  }
}

// 상태 업데이트 최적화를 위한 훅 팩토리
export function createOptimizedUpdater<T>(
  setter: (value: T | ((prev: T) => T)) => void
) {
  let pendingUpdate: T | ((prev: T) => T) | null = null
  let isScheduled = false

  return (value: T | ((prev: T) => T)) => {
    pendingUpdate = value

    if (!isScheduled) {
      isScheduled = true

      globalBatchQueue.add(() => {
        if (pendingUpdate !== null) {
          setter(pendingUpdate)
          pendingUpdate = null
          isScheduled = false
        }
      })
    }
  }
}

// 조건부 배치 업데이트 (특정 조건에서만 배치)
export function conditionalBatchUpdate(
  condition: boolean,
  update: () => void,
  immediateUpdate?: () => void
) {
  if (condition) {
    batchUpdates.add(update)
  } else {
    immediateUpdate?.()
    update()
  }
}

// 성능 측정을 위한 배치 업데이트 래퍼
export function measureBatchUpdate<T>(
  name: string,
  update: () => T
): Promise<T> {
  return new Promise((resolve) => {
    const start = performance.now()

    batchUpdates.add(() => {
      const result = update()
      const end = performance.now()

      console.log(`Batch update "${name}" took ${end - start}ms`)
      resolve(result)
    })
  })
}

// 디바운스된 배치 업데이트
export function debouncedBatchUpdate(
  update: () => void,
  delay: number = 100
) {
  let timeoutId: number | null = null

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = window.setTimeout(() => {
      batchUpdates.add(update)
    }, delay)
  }
}

// 스로틀된 배치 업데이트
export function throttledBatchUpdate(
  update: () => void,
  interval: number = 100
) {
  let lastExecuted = 0
  let timeoutId: number | null = null

  return () => {
    const now = Date.now()

    if (now - lastExecuted > interval) {
      lastExecuted = now
      batchUpdates.add(update)
    } else if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        lastExecuted = Date.now()
        batchUpdates.add(update)
        timeoutId = null
      }, interval - (now - lastExecuted))
    }
  }
}

// React 19 자동 배치와 호환되는 래퍼
export function compatibleBatch(updates: Array<() => void>) {
  // React 19에서는 이미 자동 배치되므로, startTransition만 사용
  startTransition(() => {
    updates.forEach(update => update())
  })
}

// 우선순위 기반 배치 업데이트
export const UpdatePriority = {
  IMMEDIATE: 0,
  HIGH: 1,
  NORMAL: 2,
  LOW: 3
} as const

export type UpdatePriority = typeof UpdatePriority[keyof typeof UpdatePriority]

class PriorityBatchQueue {
  private queues: Record<UpdatePriority, Array<() => void>> = {
    [UpdatePriority.IMMEDIATE]: [],
    [UpdatePriority.HIGH]: [],
    [UpdatePriority.NORMAL]: [],
    [UpdatePriority.LOW]: []
  }

  add(update: () => void, priority: UpdatePriority = UpdatePriority.NORMAL) {
    this.queues[priority].push(update)
    this.schedule()
  }

  private schedule() {
    startTransition(() => {
      // 높은 우선순위부터 실행
      Object.keys(this.queues)
        .map(Number)
        .sort()
        .forEach(priority => {
          const updates = [...this.queues[priority as UpdatePriority]]
          this.queues[priority as UpdatePriority] = []

          if (priority === UpdatePriority.IMMEDIATE) {
            // 즉시 실행
            updates.forEach(update => update())
          } else {
            // 배치 실행
            batchUpdates.addMultiple(updates)
          }
        })
    })
  }
}

export const priorityBatchQueue = new PriorityBatchQueue()

// 성능 모니터링을 위한 배치 통계
export class BatchUpdateStats {
  private static instance: BatchUpdateStats
  private stats = {
    totalBatches: 0,
    totalUpdates: 0,
    averageBatchSize: 0,
    totalTime: 0,
    averageTime: 0
  }

  static getInstance(): BatchUpdateStats {
    if (!this.instance) {
      this.instance = new BatchUpdateStats()
    }
    return this.instance
  }

  recordBatch(updateCount: number, time: number) {
    this.stats.totalBatches++
    this.stats.totalUpdates += updateCount
    this.stats.totalTime += time
    this.stats.averageBatchSize = this.stats.totalUpdates / this.stats.totalBatches
    this.stats.averageTime = this.stats.totalTime / this.stats.totalBatches
  }

  getStats() {
    return { ...this.stats }
  }

  reset() {
    this.stats = {
      totalBatches: 0,
      totalUpdates: 0,
      averageBatchSize: 0,
      totalTime: 0,
      averageTime: 0
    }
  }
}

export const batchStats = BatchUpdateStats.getInstance()