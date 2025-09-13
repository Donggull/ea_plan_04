// Core types for ELUO project management system
export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export enum UserRole {
  ADMIN = 'admin',
  SUB_ADMIN = 'sub_admin',
  MEMBER_1 = 'member_1',
  MEMBER_2 = 'member_2',
  MEMBER_3 = 'member_3',
  MEMBER_4 = 'member_4',
  MEMBER_5 = 'member_5'
}

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

export enum WorkflowType {
  PROPOSAL = 'proposal',
  CONSTRUCTION = 'construction',
  OPERATIONAL = 'operational'
}

export enum ProjectStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

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

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google'
}