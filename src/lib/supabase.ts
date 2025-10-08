import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://idahoiszluzixfbkwfth.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYWhvaXN6bHV6aXhmYmt3ZnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTAxMjAsImV4cCI6MjA3MTM2NjEyMH0.NMEJwQOA5RqooRaJmoKf40fsafWICa1ANqeaif7U-eY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
          email: string
          ruc: string
          razon_social: string
          actividad_economica: string | null
          estado_contribuyente: string
          direccion: string | null
          telefono: string | null
          role: 'usuario' | 'admin'
          sri_data: Json | null
          nombre_persona: string | null
          nombre_empresa: string | null
          sector: string | null
          ciudad: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          ruc: string
          razon_social: string
          actividad_economica?: string | null
          estado_contribuyente: string
          direccion?: string | null
          telefono?: string | null
          role?: 'usuario' | 'admin'
          sri_data?: Json | null
          nombre_persona?: string | null
          nombre_empresa?: string | null
          sector?: string | null
          ciudad?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          ruc?: string
          razon_social?: string
          actividad_economica?: string | null
          estado_contribuyente?: string
          direccion?: string | null
          telefono?: string | null
          role?: 'usuario' | 'admin'
          sri_data?: Json | null
          nombre_persona?: string | null
          nombre_empresa?: string | null
          sector?: string | null
          ciudad?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      surveys: {
        Row: {
          id: number
          title: string
          description: string | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      questions: {
        Row: {
          id: number
          survey_id: number
          question_text: string
          question_type: 'multiple_choice' | 'scale' | 'text' | 'boolean'
          options: Json | null
          is_required: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          survey_id: number
          question_text: string
          question_type: 'multiple_choice' | 'scale' | 'text' | 'boolean'
          options?: Json | null
          is_required?: boolean
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          survey_id?: number
          question_text?: string
          question_type?: 'multiple_choice' | 'scale' | 'text' | 'boolean'
          options?: Json | null
          is_required?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      survey_responses: {
        Row: {
          id: number
          survey_id: number
          user_id: string
          status: 'in_progress' | 'completed'
          started_at: string
          completed_at: string | null
          progress_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          survey_id: number
          user_id: string
          status?: 'in_progress' | 'completed'
          started_at?: string
          completed_at?: string | null
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          survey_id?: number
          user_id?: string
          status?: 'in_progress' | 'completed'
          started_at?: string
          completed_at?: string | null
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      question_responses: {
        Row: {
          id: number
          survey_response_id: number
          question_id: number
          answer_text: string | null
          answer_number: number | null
          answer_boolean: boolean | null
          answer_json: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          survey_response_id: number
          question_id: number
          answer_text?: string | null
          answer_number?: number | null
          answer_boolean?: boolean | null
          answer_json?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          survey_response_id?: number
          question_id?: number
          answer_text?: string | null
          answer_number?: number | null
          answer_boolean?: boolean | null
          answer_json?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      limesurvey_participants: {
        Row: {
          id: string
          user_id: string
          survey_id: number
          token: string
          firstname: string | null
          lastname: string | null
          email: string | null
          limesurvey_response: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          survey_id: number
          token: string
          firstname?: string | null
          lastname?: string | null
          email?: string | null
          limesurvey_response?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          survey_id?: number
          token?: string
          firstname?: string | null
          lastname?: string | null
          email?: string | null
          limesurvey_response?: Json | null
          created_at?: string
          updated_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}