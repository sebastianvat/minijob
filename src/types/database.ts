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
