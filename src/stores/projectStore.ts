import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  progress: number
  team_size: number
  created_at: string
  updated_at: string
  owner_id: string
}

interface ProjectState {
  projects: Project[]
  selectedProject: Project | null
  filters: {
    status: string[]
    search: string
    sortBy: 'created_at' | 'updated_at' | 'name' | 'progress'
    sortOrder: 'asc' | 'desc'
  }
  isLoading: boolean

  // Actions
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  removeProject: (id: string) => void
  setSelectedProject: (project: Project | null) => void
  setFilters: (filters: Partial<ProjectState['filters']>) => void
  setLoading: (loading: boolean) => void
  getFilteredProjects: () => Project[]
}

export const useProjectStore = create<ProjectState>()(
  subscribeWithSelector((set, get) => ({
    projects: [],
    selectedProject: null,
    filters: {
      status: [],
      search: '',
      sortBy: 'updated_at',
      sortOrder: 'desc',
    },
    isLoading: false,

    setProjects: (projects) =>
      set({ projects }),

    addProject: (project) =>
      set((state) => ({
        projects: [project, ...state.projects],
      })),

    updateProject: (id, updates) =>
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...project, ...updates } : project
        ),
        selectedProject:
          state.selectedProject?.id === id
            ? { ...state.selectedProject, ...updates }
            : state.selectedProject,
      })),

    removeProject: (id) =>
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        selectedProject:
          state.selectedProject?.id === id ? null : state.selectedProject,
      })),

    setSelectedProject: (project) =>
      set({ selectedProject: project }),

    setFilters: (filters) =>
      set((state) => ({
        filters: { ...state.filters, ...filters },
      })),

    setLoading: (loading) =>
      set({ isLoading: loading }),

    getFilteredProjects: () => {
      const { projects, filters } = get()

      let filtered = projects

      // 상태 필터
      if (filters.status.length > 0) {
        filtered = filtered.filter((project) =>
          filters.status.includes(project.status)
        )
      }

      // 검색 필터
      if (filters.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter(
          (project) =>
            project.name.toLowerCase().includes(search) ||
            project.description.toLowerCase().includes(search)
        )
      }

      // 정렬
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy]
        const bValue = b[filters.sortBy]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const result = aValue.localeCompare(bValue)
          return filters.sortOrder === 'asc' ? result : -result
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const result = aValue - bValue
          return filters.sortOrder === 'asc' ? result : -result
        }

        return 0
      })

      return filtered
    },
  }))
)