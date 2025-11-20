/**
 * Tipos autogenerados de Supabase Database
 * 
 * NOTA: Después de cambios en el schema, regenera con:
 * npx supabase gen types typescript --project-id <tu-project-id> > ./database.types.ts
 * 
 * Ver docs/database.md para instrucciones
 */

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
      categories: {
        Row: {
          id: string
          name: string
          slug: string | null
          published: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          published?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          published?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
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
          shipping_policy: string
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
          shipping_policy?: string
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
          shipping_policy?: string
          category_id?: string | null
          published?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          customer_type: string
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
          customer_type?: string
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
          customer_type?: string
          first_name?: string | null
          last_name?: string | null
          document_hash?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipping_addresses: {
        Row: {
          id: string
          customer_id: string
          label: string
          address: string
          departamento: string
          provincia: string
          distrito: string
          is_default: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          label?: string
          address: string
          departamento: string
          provincia: string
          distrito: string
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          label?: string
          address?: string
          departamento?: string
          provincia?: string
          distrito?: string
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_addresses_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      pickup_locations: {
        Row: {
          id: string
          name: string
          departamento: string
          provincia: string
          distrito: string
          direccion: string
          horarios: string | null
          capacidad: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          departamento: string
          provincia: string
          distrito: string
          direccion: string
          horarios?: string | null
          capacidad?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          departamento?: string
          provincia?: string
          distrito?: string
          direccion?: string
          horarios?: string | null
          capacidad?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          id: string
          name: string
          is_active: boolean | null
          instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          is_active?: boolean | null
          instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          is_active?: boolean | null
          instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_proofs: {
        Row: {
          id: string
          order_id: string
          payment_method_id: string | null
          proof_image_path: string
          operation_number: string | null
          amount: number
          status: string | null
          verified_by: string | null
          verified_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          payment_method_id?: string | null
          proof_image_path: string
          operation_number?: string | null
          amount: number
          status?: string | null
          verified_by?: string | null
          verified_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          payment_method_id?: string | null
          proof_image_path?: string
          operation_number?: string | null
          amount?: number
          status?: string | null
          verified_by?: string | null
          verified_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_proofs_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
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
          status: string | null
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
          total_amount?: number | null
          shipping_mode?: string | null
          shipping_scope?: string | null
          status?: string | null
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
          total_amount?: number | null
          shipping_mode?: string | null
          shipping_scope?: string | null
          status?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            referencedRelation: "shipping_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pickup_location_id_fkey"
            columns: ["pickup_location_id"]
            referencedRelation: "pickup_locations"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          variant_id: string | null
          product_name: string
          unit_price: number
          unit_cost: number | null
          quantity: number
          puntos_acarreo: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          variant_id?: string | null
          product_name: string
          unit_price: number
          unit_cost?: number | null
          quantity: number
          puntos_acarreo?: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          variant_id?: string | null
          product_name?: string
          unit_price?: number
          unit_cost?: number | null
          quantity?: number
          puntos_acarreo?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      stock_locations: {
        Row: {
          id: string
          name: string
          address: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string | null
          sku: string | null
          attributes: Json | null
          selling_price: number
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name?: string | null
          sku?: string | null
          attributes?: Json | null
          selling_price: number
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string | null
          sku?: string | null
          attributes?: Json | null
          selling_price?: number
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_stock: {
        Row: {
          id: string
          variant_id: string
          location_id: string
          quantity: number
          reserved_quantity: number
        }
        Insert: {
          id?: string
          variant_id: string
          location_id: string
          quantity?: number
          reserved_quantity?: number
        }
        Update: {
          id?: string
          variant_id?: string
          location_id?: string
          quantity?: number
          reserved_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_stock_variant_id_fkey"
            columns: ["variant_id"]
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stock_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "stock_locations"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          table_name: string
          record_id: string
          action: string
          old_data: Json | null
          new_data: Json | null
          changed_by: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          table_name: string
          record_id: string
          action: string
          old_data?: Json | null
          new_data?: Json | null
          changed_by?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          table_name?: string
          record_id?: string
          action?: string
          old_data?: Json | null
          new_data?: Json | null
          changed_by?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: []
      }
      staff_roles: {
        Row: {
          id: string
          name: string
          permissions: Json
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          permissions?: Json
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          permissions?: Json
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          id: string
          role_id: string | null
          first_name: string
          last_name: string
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role_id?: string | null
          first_name: string
          last_name: string
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role_id?: string | null
          first_name?: string
          last_name?: string
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "staff_roles"
            referencedColumns: ["id"]
          }
        ]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
