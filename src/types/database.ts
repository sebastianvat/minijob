// MiniJob.ro - Database Types
// Auto-generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'client' | 'provider' | 'admin'
export type BusinessType = 'pfa' | 'srl' | 'individual'
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
export type PriceType = 'fixed' | 'hourly' | 'custom'
export type PaymentMethod = 'cash' | 'card' | 'platform'

// New types for Projects & Skills
export type ProjectStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type UrgencyLevel = 'urgent' | 'normal' | 'flexible'
export type SkillLevel = 'new' | 'experienced' | 'expert' | 'master' | 'top_pro'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: UserRole
          location_city: string | null
          location_lat: number | null
          location_lng: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          location_city?: string | null
          location_lat?: number | null
          location_lng?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          location_city?: string | null
          location_lat?: number | null
          location_lng?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      providers: {
        Row: {
          id: string
          user_id: string
          business_type: BusinessType
          business_name: string | null
          cui: string | null
          categories: string[]
          bio: string | null
          rating: number
          total_reviews: number
          total_bookings: number
          verified: boolean
          verified_at: string | null
          service_radius_km: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_type?: BusinessType
          business_name?: string | null
          cui?: string | null
          categories?: string[]
          bio?: string | null
          rating?: number
          total_reviews?: number
          total_bookings?: number
          verified?: boolean
          verified_at?: string | null
          service_radius_km?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_type?: BusinessType
          business_name?: string | null
          cui?: string | null
          categories?: string[]
          bio?: string | null
          rating?: number
          total_reviews?: number
          total_bookings?: number
          verified?: boolean
          verified_at?: string | null
          service_radius_km?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          icon: string | null
          price_type: PriceType
          price_min: number | null
          price_max: number | null
          duration_min: number | null
          duration_max: number | null
          instant_booking: boolean
          active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          icon?: string | null
          price_type?: PriceType
          price_min?: number | null
          price_max?: number | null
          duration_min?: number | null
          duration_max?: number | null
          instant_booking?: boolean
          active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          icon?: string | null
          price_type?: PriceType
          price_min?: number | null
          price_max?: number | null
          duration_min?: number | null
          duration_max?: number | null
          instant_booking?: boolean
          active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          provider_id: string
          category_id: string
          title: string
          description: string | null
          price_type: PriceType
          price: number
          duration_minutes: number | null
          photos: string[]
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          category_id: string
          title: string
          description?: string | null
          price_type?: PriceType
          price: number
          duration_minutes?: number | null
          photos?: string[]
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          category_id?: string
          title?: string
          description?: string | null
          price_type?: PriceType
          price?: number
          duration_minutes?: number | null
          photos?: string[]
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          client_id: string
          provider_id: string
          service_id: string | null
          category_id: string
          status: BookingStatus
          scheduled_date: string
          scheduled_time: string
          address: string
          address_details: string | null
          location_lat: number | null
          location_lng: number | null
          price: number
          platform_fee: number
          payment_method: PaymentMethod
          notes: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          provider_id: string
          service_id?: string | null
          category_id: string
          status?: BookingStatus
          scheduled_date: string
          scheduled_time: string
          address: string
          address_details?: string | null
          location_lat?: number | null
          location_lng?: number | null
          price: number
          platform_fee?: number
          payment_method?: PaymentMethod
          notes?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          provider_id?: string
          service_id?: string | null
          category_id?: string
          status?: BookingStatus
          scheduled_date?: string
          scheduled_time?: string
          address?: string
          address_details?: string | null
          location_lat?: number | null
          location_lng?: number | null
          price?: number
          platform_fee?: number
          payment_method?: PaymentMethod
          notes?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          photos: string[]
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          photos?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          photos?: string[]
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          booking_id: string
          sender_id: string
          content: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          sender_id: string
          content: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          sender_id?: string
          content?: string
          read_at?: string | null
          created_at?: string
        }
      }
      // New tables for Projects & Skills
      skills: {
        Row: {
          id: string
          category_id: string
          slug: string
          name: string
          description: string | null
          icon: string | null
          price_unit: string
          price_min: number | null
          price_max: number | null
          active: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          slug: string
          name: string
          description?: string | null
          icon?: string | null
          price_unit?: string
          price_min?: number | null
          price_max?: number | null
          active?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          slug?: string
          name?: string
          description?: string | null
          icon?: string | null
          price_unit?: string
          price_min?: number | null
          price_max?: number | null
          active?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      provider_skills: {
        Row: {
          id: string
          provider_id: string
          skill_id: string
          price: number
          price_type: PriceType
          jobs_completed: number
          rating: number
          reviews_count: number
          level: SkillLevel
          skill_score: number
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          skill_id: string
          price: number
          price_type?: PriceType
          jobs_completed?: number
          rating?: number
          reviews_count?: number
          level?: SkillLevel
          skill_score?: number
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          skill_id?: string
          price?: number
          price_type?: PriceType
          jobs_completed?: number
          rating?: number
          reviews_count?: number
          level?: SkillLevel
          skill_score?: number
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skill_portfolio: {
        Row: {
          id: string
          provider_skill_id: string
          photo_url: string
          title: string | null
          description: string | null
          project_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          provider_skill_id: string
          photo_url: string
          title?: string | null
          description?: string | null
          project_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          provider_skill_id?: string
          photo_url?: string
          title?: string | null
          description?: string | null
          project_date?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string
          category_id: string
          skill_id: string | null
          title: string
          description: string
          photos: string[]
          budget_min: number | null
          budget_max: number | null
          location_city: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          deadline: string | null
          urgency: UrgencyLevel
          status: ProjectStatus
          offers_count: number
          accepted_offer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          category_id: string
          skill_id?: string | null
          title: string
          description: string
          photos?: string[]
          budget_min?: number | null
          budget_max?: number | null
          location_city: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          deadline?: string | null
          urgency?: UrgencyLevel
          status?: ProjectStatus
          offers_count?: number
          accepted_offer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          category_id?: string
          skill_id?: string | null
          title?: string
          description?: string
          photos?: string[]
          budget_min?: number | null
          budget_max?: number | null
          location_city?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          deadline?: string | null
          urgency?: UrgencyLevel
          status?: ProjectStatus
          offers_count?: number
          accepted_offer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_offers: {
        Row: {
          id: string
          project_id: string
          provider_id: string
          provider_skill_id: string | null
          price: number
          message: string | null
          estimated_duration: string | null
          available_from: string | null
          includes_materials: boolean
          status: OfferStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          provider_id: string
          provider_skill_id?: string | null
          price: number
          message?: string | null
          estimated_duration?: string | null
          available_from?: string | null
          includes_materials?: boolean
          status?: OfferStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          provider_id?: string
          provider_skill_id?: string | null
          price?: number
          message?: string | null
          estimated_duration?: string | null
          available_from?: string | null
          includes_materials?: boolean
          status?: OfferStatus
          created_at?: string
          updated_at?: string
        }
      }
      skill_reviews: {
        Row: {
          id: string
          booking_id: string | null
          project_id: string | null
          provider_skill_id: string
          client_id: string
          rating: number
          review_text: string | null
          photos: string[]
          would_recommend: boolean
          created_at: string
        }
        Insert: {
          id?: string
          booking_id?: string | null
          project_id?: string | null
          provider_skill_id: string
          client_id: string
          rating: number
          review_text?: string | null
          photos?: string[]
          would_recommend?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string | null
          project_id?: string | null
          provider_skill_id?: string
          client_id?: string
          rating?: number
          review_text?: string | null
          photos?: string[]
          would_recommend?: boolean
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Provider = Database['public']['Tables']['providers']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Message = Database['public']['Tables']['messages']['Row']

// New helper types
export type Skill = Database['public']['Tables']['skills']['Row']
export type ProviderSkill = Database['public']['Tables']['provider_skills']['Row']
export type SkillPortfolio = Database['public']['Tables']['skill_portfolio']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectOffer = Database['public']['Tables']['project_offers']['Row']
export type SkillReview = Database['public']['Tables']['skill_reviews']['Row']

// Extended types with relations
export type ProviderWithProfile = Provider & {
  profile: Profile
}

export type ServiceWithProvider = Service & {
  provider: ProviderWithProfile
  category: Category
}

export type BookingWithDetails = Booking & {
  client: Profile
  provider: ProviderWithProfile
  service: Service | null
  category: Category
  reviews: Review[]
  messages: Message[]
}

// New extended types
export type SkillWithCategory = Skill & {
  category: Category
}

export type ProviderSkillWithDetails = ProviderSkill & {
  skill: Skill
  portfolio: SkillPortfolio[]
  reviews: SkillReview[]
}

export type ProviderWithSkills = Provider & {
  profile: Profile
  skills: ProviderSkillWithDetails[]
}

export type ProjectWithDetails = Project & {
  client: Profile
  category: Category
  skill: Skill | null
  offers: ProjectOfferWithProvider[]
}

export type ProjectOfferWithProvider = ProjectOffer & {
  provider: ProviderWithProfile
  provider_skill: ProviderSkillWithDetails | null
}

// Badge display helpers
export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  new: '🥉 Nou',
  experienced: '🥈 Experimentat',
  expert: '🥇 Expert',
  master: '💎 Master',
  top_pro: '👑 Top Pro'
}

export const SKILL_LEVEL_COLORS: Record<SkillLevel, string> = {
  new: 'bg-slate-100 text-slate-700 border-slate-200',
  experienced: 'bg-blue-50 text-blue-700 border-blue-200',
  expert: 'bg-amber-50 text-amber-700 border-amber-200',
  master: 'bg-purple-50 text-purple-700 border-purple-200',
  top_pro: 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200'
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  open: 'Deschis',
  in_progress: 'În desfășurare',
  completed: 'Finalizat',
  cancelled: 'Anulat'
}

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  urgent: '🔥 Urgent',
  normal: '📅 Normal',
  flexible: '🕐 Flexibil'
}
