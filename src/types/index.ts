// Core types for ELUO project management system
export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export const UserRole = {
  ADMIN: 'admin',
  SUB_ADMIN: 'sub_admin',
  MEMBER_1: 'member_1',
  MEMBER_2: 'member_2',
  MEMBER_3: 'member_3',
  MEMBER_4: 'member_4',
  MEMBER_5: 'member_5'
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface Project {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  updated_at: string
  workflow_type: WorkflowType[]
  status: ProjectStatus
}

export const WorkflowType = {
  PROPOSAL: 'proposal',
  CONSTRUCTION: 'construction',
  OPERATIONAL: 'operational'
} as const

export type WorkflowType = (typeof WorkflowType)[keyof typeof WorkflowType]

export const ProjectStatus = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
} as const

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]

export interface ProjectFile {
  id: string
  project_id: string
  name: string
  file_path: string
  file_type: string
  file_size: number
  uploaded_by: string
  created_at: string
}

export interface AIModelConfig {
  id: string
  provider: AIProvider
  model_name: string
  api_key?: string
  settings: Record<string, unknown>
  created_at: string
}

export const AIProvider = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google'
} as const

export type AIProvider = (typeof AIProvider)[keyof typeof AIProvider]