// Supabase 쿼리 헬퍼 함수들
import { supabase } from './client'
import type {
  Organization,
  User,
  Project,
  ChatSession,
  ChatMessage,
  GeneratedImage
} from '@/types/database'

// User/Profile queries
export const userQueries = {
  // Get current user profile
  getCurrentProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return { data, error }
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<Omit<User, 'preferences'>> & { preferences?: any }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  },

  // Get user by id
  getUserById: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    return { data, error }
  }
}

// Organization queries
export const organizationQueries = {
  // Get user's organization
  getUserOrganization: async (userId: string) => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('owner_id', userId)
      .single()

    return { data, error }
  },

  // Create organization
  createOrganization: async (orgData: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('organizations')
      .insert(orgData)
      .select()
      .single()

    return { data, error }
  },

  // Update organization
  updateOrganization: async (orgId: string, updates: Partial<Organization>) => {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', orgId)
      .select()
      .single()

    return { data, error }
  }
}

// Project queries
export const projectQueries = {
  // Get user's projects
  getUserProjects: async (userId: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .or(`owner_id.eq.${userId},team_members.cs.{${userId}}`)
      .order('updated_at', { ascending: false })

    return { data, error }
  },

  // Get project by id
  getProjectById: async (projectId: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    return { data, error }
  },

  // Create project
  createProject: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'metadata'> & { metadata?: any }) => {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    return { data, error }
  },

  // Update project
  updateProject: async (projectId: string, updates: Partial<Omit<Project, 'metadata'>> & { metadata?: any }) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()

    return { data, error }
  },

  // Delete project
  deleteProject: async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    return { error }
  }
}

// Chat queries
export const chatQueries = {
  // Get project chat sessions
  getProjectChatSessions: async (projectId: string) => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false })

    return { data, error }
  },

  // Get session messages
  getSessionMessages: async (sessionId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    return { data, error }
  },

  // Create chat session
  createChatSession: async (sessionData: Omit<ChatSession, 'id' | 'created_at' | 'updated_at' | 'messages'>) => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert(sessionData)
      .select()
      .single()

    return { data, error }
  },

  // Add message to session
  addMessage: async (messageData: Omit<ChatMessage, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single()

    return { data, error }
  },

  // Update session
  updateSession: async (sessionId: string, updates: Partial<ChatSession>) => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single()

    return { data, error }
  }
}

// Image generation queries
export const imageQueries = {
  // Get project generated images
  getProjectImages: async (projectId: string) => {
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Save generated image
  saveGeneratedImage: async (imageData: Omit<GeneratedImage, 'id' | 'created_at' | 'updated_at' | 'parameters'> & { parameters: any }) => {
    const { data, error } = await supabase
      .from('generated_images')
      .insert(imageData)
      .select()
      .single()

    return { data, error }
  },

  // Delete generated image
  deleteGeneratedImage: async (imageId: string) => {
    const { error } = await supabase
      .from('generated_images')
      .delete()
      .eq('id', imageId)

    return { error }
  }
}

// Real-time subscriptions
export const realtimeSubscriptions = {
  // Subscribe to project updates
  subscribeToProject: (projectId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`project-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to chat messages
  subscribeToChatMessages: (sessionId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`chat-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to generated images
  subscribeToGeneratedImages: (projectId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`images-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'generated_images',
          filter: `project_id=eq.${projectId}`
        },
        callback
      )
      .subscribe()
  },

  // Unsubscribe from channel
  unsubscribe: (subscription: any) => {
    return supabase.removeChannel(subscription)
  }
}