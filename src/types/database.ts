// ELUO 플랫폼 데이터베이스 타입 정의

import type { Database } from './supabase'

// Base types
export type BaseEntity = {
  id: string
  created_at: string
  updated_at: string
}

// Organization types
export interface Organization extends BaseEntity {
  name: string
  slug: string
  description?: string
  logo_url?: string
  settings: MetadataRecord
  owner_id: string
}

// User types
export interface User extends BaseEntity {
  email: string
  name?: string
  avatar_url?: string
  role: UserRole
  organization_id?: string
  last_login_at?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    push: boolean
    slack: boolean
  }
  ai_providers: {
    openai: boolean
    anthropic: boolean
    google: boolean
  }
}

// Project types
export interface Project extends BaseEntity {
  name: string
  description?: string
  organization_id: string
  owner_id: string
  status: ProjectStatus
  priority: ProjectPriority
  workflow_types: WorkflowType[]
  metadata: ProjectMetadata
  team_members: string[]
}

export interface ProjectMetadata {
  client_name?: string
  budget?: number
  deadline?: string
  tags: string[]
  custom_fields: MetadataRecord
}

// Planning Module types
export interface PlanningDocument extends BaseEntity {
  project_id: string
  title: string
  content: string
  document_type: PlanningDocumentType
  version: number
  author_id: string
  approved_by?: string
  approved_at?: string
  attachments: string[]
}

export interface Requirement extends BaseEntity {
  project_id: string
  planning_document_id?: string
  title: string
  description: string
  type: RequirementType
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'draft' | 'review' | 'approved' | 'rejected'
  assigned_to?: string
  estimated_hours?: number
  actual_hours?: number
}

// Design Module types
export interface DesignAsset extends BaseEntity {
  project_id: string
  name: string
  description?: string
  file_url: string
  file_type: string
  file_size: number
  asset_type: DesignAssetType
  version: number
  designer_id: string
  approved_by?: string
  approved_at?: string
  tags: string[]
}

export interface DesignSystem extends BaseEntity {
  project_id: string
  name: string
  description?: string
  version: string
  components: DesignComponent[]
  color_palette: ColorPalette
  typography: Typography
  spacing_system: SpacingSystem
}

export interface DesignComponent {
  name: string
  description?: string
  figma_url?: string
  code_url?: string
  props: ComponentProp[]
  variants: ComponentVariant[]
}

// Publishing Module types
export interface PublishingConfig extends BaseEntity {
  project_id: string
  name: string
  build_command: string
  output_directory: string
  environment_variables: Record<string, string>
  deployment_url?: string
  last_deployed_at?: string
  deployment_status: 'pending' | 'building' | 'success' | 'failed'
  deployment_logs: DeploymentLog[]
}

export interface DeploymentLog {
  timestamp: string
  level: 'info' | 'warning' | 'error'
  message: string
  details?: MetadataRecord
}

// Development Module types
export interface Repository extends BaseEntity {
  project_id: string
  name: string
  description?: string
  git_url: string
  branch: string
  language: string
  framework: string
  package_manager: 'npm' | 'yarn' | 'pnpm'
  build_status: 'pending' | 'building' | 'success' | 'failed'
  last_commit_hash?: string
  last_commit_message?: string
  last_commit_at?: string
}

export interface CodeReview extends BaseEntity {
  repository_id: string
  pull_request_id: string
  title: string
  description?: string
  author_id: string
  reviewer_id?: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  files_changed: string[]
  lines_added: number
  lines_deleted: number
  comments: ReviewComment[]
}

export interface ReviewComment {
  id: string
  line_number: number
  file_path: string
  comment: string
  author_id: string
  created_at: string
}

// AI Module types
export interface ChatSession extends BaseEntity {
  project_id: string
  user_id: string
  title: string
  context_type: 'planning' | 'design' | 'publishing' | 'development' | 'general'
  ai_provider: AIProvider
  model_name: string
  system_prompt?: string
  total_tokens_used: number
  messages: ChatMessage[]
}

export interface ChatMessage extends BaseEntity {
  session_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  tokens_used?: number
  metadata?: Json
}

export interface AIResponse extends BaseEntity {
  message_id: string
  provider: AIProvider
  model: string
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  response_time_ms: number
  status: 'success' | 'error' | 'timeout'
  error_message?: string
  metadata?: MetadataRecord
}

// Image Generation types
export interface GeneratedImage extends BaseEntity {
  project_id: string
  user_id: string
  prompt: string
  negative_prompt?: string
  model: string
  provider: AIProvider
  image_url: string
  thumbnail_url?: string
  width: number
  height: number
  file_size: number
  generation_time_ms: number
  parameters: ImageGenerationParams
}

export interface ImageGenerationParams {
  steps: number
  guidance_scale: number
  seed?: number
  sampler?: string
  style?: string
  quality?: 'standard' | 'hd'
}

// File Management types
export interface FileUpload extends BaseEntity {
  project_id: string
  user_id: string
  original_name: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  mime_type: string
  bucket: string
  is_public: boolean
  tags: string[]
  metadata?: MetadataRecord
}

// Notification types
export interface Notification extends BaseEntity {
  user_id: string
  title: string
  message: string
  type: NotificationType
  priority: 'low' | 'medium' | 'high'
  is_read: boolean
  action_url?: string
  metadata?: MetadataRecord
}

// Enum types (imported from main types)
export type UserRole = 'admin' | 'sub_admin' | 'member_1' | 'member_2' | 'member_3' | 'member_4' | 'member_5'
export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'archived'
export type WorkflowType = 'proposal' | 'construction' | 'operational'
export type AIProvider = 'openai' | 'anthropic' | 'google'

// Import Json type from Supabase types
import type { Json } from './supabase'

// Helper types for metadata and complex fields - using Json for Supabase compatibility
type MetadataRecord = Json

// Additional enum types
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent'
export type PlanningDocumentType = 'brd' | 'prd' | 'wireframe' | 'user_story' | 'technical_spec'
export type RequirementType = 'functional' | 'non_functional' | 'business' | 'technical' | 'design'
export type DesignAssetType = 'wireframe' | 'mockup' | 'prototype' | 'icon' | 'illustration' | 'component'
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reminder'

// Design System specific types
export interface ColorPalette {
  primary: string[]
  secondary: string[]
  neutral: string[]
  semantic: {
    success: string
    warning: string
    error: string
    info: string
  }
}

export interface Typography {
  font_families: {
    primary: string
    secondary?: string
    monospace: string
  }
  font_sizes: Record<string, number>
  line_heights: Record<string, number>
  font_weights: Record<string, number>
}

export interface SpacingSystem {
  base_unit: number
  scale: number[]
  breakpoints: Record<string, number>
}

export interface ComponentProp {
  name: string
  type: string
  required: boolean
  default_value?: unknown
  description?: string
}

export interface ComponentVariant {
  name: string
  props: MetadataRecord
  preview_url?: string
}

// Real-time subscription types
export type TableName = keyof Database['public']['Tables']

export interface RealtimePayload<T = Record<string, unknown>> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T | null
  old: T | null
  errors: string[] | null
}

// API Response types
export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  message?: string
  status: number
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}