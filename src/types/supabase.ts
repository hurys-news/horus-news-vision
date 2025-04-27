// أنواع البيانات لـ Supabase
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
      news: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string | null
          category_id: string
          image: string | null
          created_at: string
          updated_at: string | null
          source: string | null
          author_id: string | null
          is_top_story: boolean
          is_breaking: boolean
          view_count: number
          tags: string[] | null
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          content?: string | null
          category_id: string
          image?: string | null
          created_at?: string
          updated_at?: string | null
          source?: string | null
          author_id?: string | null
          is_top_story?: boolean
          is_breaking?: boolean
          view_count?: number
          tags?: string[] | null
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string | null
          category_id?: string
          image?: string | null
          created_at?: string
          updated_at?: string | null
          source?: string | null
          author_id?: string | null
          is_top_story?: boolean
          is_breaking?: boolean
          view_count?: number
          tags?: string[] | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image: string | null
          parent_id: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          avatar: string | null
          title: string | null
          bio: string | null
        }
        Insert: {
          id?: string
          name: string
          avatar?: string | null
          title?: string | null
          bio?: string | null
        }
        Update: {
          id?: string
          name?: string
          avatar?: string | null
          title?: string | null
          bio?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          news_id: string
          user_id: string
          content: string
          created_at: string
          likes: number
          parent_id: string | null
        }
        Insert: {
          id?: string
          news_id: string
          user_id: string
          content: string
          created_at?: string
          likes?: number
          parent_id?: string | null
        }
        Update: {
          id?: string
          news_id?: string
          user_id?: string
          content?: string
          created_at?: string
          likes?: number
          parent_id?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          avatar: string | null
          role: string
          saved_news: string[] | null
          followed_categories: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          avatar?: string | null
          role?: string
          saved_news?: string[] | null
          followed_categories?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          avatar?: string | null
          role?: string
          saved_news?: string[] | null
          followed_categories?: string[] | null
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
      [_ in never]: never
    }
  }
}

// أنواع مساعدة للوصول السهل إلى الجداول
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updateable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
