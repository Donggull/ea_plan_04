// 테스트 환경 설정
import { vi } from 'vitest'

// Mock implementations
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))