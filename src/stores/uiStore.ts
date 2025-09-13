import { create } from 'zustand'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: number
}

interface Modal {
  id: string
  component: React.ComponentType<any>
  props?: Record<string, any>
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
}

interface UIState {
  // 사이드바 상태
  sidebarOpen: boolean
  sidebarCollapsed: boolean

  // 모달 상태
  modals: Modal[]

  // 알림 상태
  notifications: Notification[]

  // 로딩 상태
  globalLoading: boolean
  loadingMessages: string[]

  // 페이지 상태
  pageTitle: string
  breadcrumbs: Array<{ label: string; href?: string }>

  // Actions
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void

  // 모달 관리
  openModal: (modal: Omit<Modal, 'id'>) => string
  closeModal: (id: string) => void
  closeAllModals: () => void

  // 알림 관리
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // 로딩 관리
  setGlobalLoading: (loading: boolean) => void
  addLoadingMessage: (message: string) => void
  removeLoadingMessage: (message: string) => void

  // 페이지 관리
  setPageTitle: (title: string) => void
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void
}

export const useUIStore = create<UIState>()((set, get) => ({
  // Initial state
  sidebarOpen: true,
  sidebarCollapsed: false,
  modals: [],
  notifications: [],
  globalLoading: false,
  loadingMessages: [],
  pageTitle: 'Eluo Platform',
  breadcrumbs: [],

  // Sidebar actions
  setSidebarOpen: (open) =>
    set({ sidebarOpen: open }),

  setSidebarCollapsed: (collapsed) =>
    set({ sidebarCollapsed: collapsed }),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Modal actions
  openModal: (modal) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newModal = { ...modal, id }
    set((state) => ({
      modals: [...state.modals, newModal],
    }))
    return id
  },

  closeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    })),

  closeAllModals: () =>
    set({ modals: [] }),

  // Notification actions
  addNotification: (notification) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newNotification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? 5000,
    }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // 자동 제거 (duration이 있는 경우)
    if (newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, newNotification.duration)
    }

    return id
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),

  clearNotifications: () =>
    set({ notifications: [] }),

  // Loading actions
  setGlobalLoading: (loading) =>
    set({ globalLoading: loading }),

  addLoadingMessage: (message) =>
    set((state) => ({
      loadingMessages: [...state.loadingMessages, message],
      globalLoading: true,
    })),

  removeLoadingMessage: (message) =>
    set((state) => {
      const newMessages = state.loadingMessages.filter((msg) => msg !== message)
      return {
        loadingMessages: newMessages,
        globalLoading: newMessages.length > 0,
      }
    }),

  // Page actions
  setPageTitle: (title) =>
    set({ pageTitle: title }),

  setBreadcrumbs: (breadcrumbs) =>
    set({ breadcrumbs }),
}))

// 편의 함수들
export const useNotifications = () => {
  const { notifications, addNotification, removeNotification } = useUIStore()

  const showSuccess = (title: string, message: string) =>
    addNotification({ type: 'success', title, message })

  const showError = (title: string, message: string) =>
    addNotification({ type: 'error', title, message, duration: 0 })

  const showWarning = (title: string, message: string) =>
    addNotification({ type: 'warning', title, message })

  const showInfo = (title: string, message: string) =>
    addNotification({ type: 'info', title, message })

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  }
}