export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'creator' | 'admin'
          subscription_plan: 'free' | 'pro' | 'enterprise'
          subscription_id: string | null
          videos_created_this_month: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'creator' | 'admin'
          subscription_plan?: 'free' | 'pro' | 'enterprise'
          subscription_id?: string | null
          videos_created_this_month?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'creator' | 'admin'
          subscription_plan?: 'free' | 'pro' | 'enterprise'
          subscription_id?: string | null
          videos_created_this_month?: number
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          thumbnail_url: string | null
          config: Json
          is_premium: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          thumbnail_url?: string | null
          config: Json
          is_premium?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          thumbnail_url?: string | null
          config?: Json
          is_premium?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      avatars: {
        Row: {
          id: string
          user_id: string | null
          name: string
          style: 'professional' | 'casual' | 'fitness' | 'teacher' | 'business'
          heygen_avatar_id: string | null
          thumbnail_url: string | null
          config: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          style: 'professional' | 'casual' | 'fitness' | 'teacher' | 'business'
          heygen_avatar_id?: string | null
          thumbnail_url?: string | null
          config?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          style?: 'professional' | 'casual' | 'fitness' | 'teacher' | 'business'
          heygen_avatar_id?: string | null
          thumbnail_url?: string | null
          config?: Json | null
          created_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          prompt: string
          template_id: string | null
          avatar_id: string | null
          voice_type: 'male-professional' | 'female-friendly' | 'male-spanish' | 'female-spanish'
          duration: number
          status: 'draft' | 'generating' | 'completed' | 'failed'
          video_url: string | null
          thumbnail_url: string | null
          script_content: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          prompt: string
          template_id?: string | null
          avatar_id?: string | null
          voice_type: 'male-professional' | 'female-friendly' | 'male-spanish' | 'female-spanish'
          duration?: number
          status?: 'draft' | 'generating' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          script_content?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          prompt?: string
          template_id?: string | null
          avatar_id?: string | null
          voice_type?: 'male-professional' | 'female-friendly' | 'male-spanish' | 'female-spanish'
          duration?: number
          status?: 'draft' | 'generating' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          script_content?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          video_id: string
          views: number
          likes: number
          shares: number
          comments: number
          engagement_rate: number
          platform: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          views?: number
          likes?: number
          shares?: number
          comments?: number
          engagement_rate?: number
          platform?: string | null
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          views?: number
          likes?: number
          shares?: number
          comments?: number
          engagement_rate?: number
          platform?: string | null
          date?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'creator' | 'admin'
      subscription_plan: 'free' | 'pro' | 'enterprise'
      video_status: 'draft' | 'generating' | 'completed' | 'failed'
      avatar_style: 'professional' | 'casual' | 'fitness' | 'teacher' | 'business'
      voice_type: 'male-professional' | 'female-friendly' | 'male-spanish' | 'female-spanish'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}