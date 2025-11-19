export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          sku: string
          description: string | null
          image_path: string | null
          cost_price: number
          selling_price: number
          puntos_acarreo: number
          shipping_policy: 'normal' | 'gratis'
          dimensions: Json | null
          category_id: string | null
          published: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sku: string
          description?: string | null
          image_path?: string | null
          cost_price: number
          selling_price: number
          puntos_acarreo?: number
          shipping_policy?: 'normal' | 'gratis'
          dimensions?: Json | null
          category_id?: string | null
          published?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sku?: string
          description?: string | null
          image_path?: string | null
          cost_price?: number
          selling_price?: number
          puntos_acarreo?: number
          shipping_policy?: 'normal' | 'gratis'
          dimensions?: Json | null
          category_id?: string | null
          published?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string | null
          shipping_address_id: string | null
          pickup_location_id: string | null
          stock_location_id: string
          subtotal: number
          shipping_cost: number | null
          shipping_real_cost: number | null
          total_amount: number | null
          shipping_mode: string | null
          shipping_scope: string | null
          status: 'pending' | 'processing' | 'verified' | 'rejected' | 'shipped' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          shipping_address_id?: string | null
          pickup_location_id?: string | null
          stock_location_id: string
          subtotal: number
          shipping_cost?: number | null
          shipping_real_cost?: number | null
          total_amount?: number | null // Generated column, usually ignored in insert
          shipping_mode?: string | null
          shipping_scope?: string | null
          status?: 'pending' | 'processing' | 'verified' | 'rejected' | 'shipped' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          shipping_address_id?: string | null
          pickup_location_id?: string | null
          stock_location_id?: string
          subtotal?: number
          shipping_cost?: number | null
          shipping_real_cost?: number | null
          shipping_mode?: string | null
          shipping_scope?: string | null
          status?: 'pending' | 'processing' | 'verified' | 'rejected' | 'shipped' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          customer_type: 'persona_natural' | 'empresa'
          first_name: string | null
          last_name: string | null
          document_hash: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          customer_type?: 'persona_natural' | 'empresa'
          first_name?: string | null
          last_name?: string | null
          document_hash?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_type?: 'persona_natural' | 'empresa'
          first_name?: string | null
          last_name?: string | null
          document_hash?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tiers_acarreo: {
        Row: {
          id: string
          nombre_tier: string
          tier_scope: string
          tier_mode: string
          puntos_minimos: number
          puntos_maximos: number
          costo: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre_tier: string
          tier_scope?: string
          tier_mode?: string
          puntos_minimos?: number
          puntos_maximos: number
          costo: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre_tier?: string
          tier_scope?: string
          tier_mode?: string
          puntos_minimos?: number
          puntos_maximos?: number
          costo?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      order_status: 'pending' | 'processing' | 'verified' | 'rejected' | 'shipped' | 'completed' | 'cancelled'
      customer_type: 'persona_natural' | 'empresa'
      tier_mode: 'acarreo' | 'envio_directo'
    }
  }
}