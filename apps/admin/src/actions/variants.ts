'use server'

import { createClient } from "@/lib/supabase/server"
import { Database } from "@mantua/shared/types/database.types"
import { revalidatePath } from "next/cache"

export type VariantWithStock = Database['public']['Tables']['product_variants']['Row'] & {
  product_stock: (Database['public']['Tables']['product_stock']['Row'] & {
    stock_locations: Database['public']['Tables']['stock_locations']['Row']
  })[]
}

export async function getVariants(productId: string): Promise<VariantWithStock[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("product_variants")
    .select(`
      *,
      product_stock (
        *,
        stock_locations (*)
      )
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching variants:", error)
    return []
  }

  return (data as unknown as VariantWithStock[]) || []
}

export async function createVariant(data: Database['public']['Tables']['product_variants']['Insert']) {
  const supabase = await createClient()

  const { data: variant, error } = await supabase
    .from("product_variants")
    .insert(data)
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating variant: ${error.message}`)
  }

  revalidatePath(`/products/${data.product_id}`)
  return variant
}

export async function updateVariant(id: string, data: Database['public']['Tables']['product_variants']['Update']) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("product_variants")
    .update(data)
    .eq("id", id)

  if (error) {
    throw new Error(`Error updating variant: ${error.message}`)
  }

  // We need to fetch the product_id to revalidate the correct path
  const { data: variant } = await supabase.from("product_variants").select("product_id").eq("id", id).single()
  if (variant) {
    revalidatePath(`/products/${variant.product_id}`)
  }
}

export async function deleteVariant(id: string) {
  const supabase = await createClient()

  // Fetch product_id before deleting
  const { data: variant } = await supabase.from("product_variants").select("product_id").eq("id", id).single()

  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error(`Error deleting variant: ${error.message}`)
  }

  if (variant) {
    revalidatePath(`/products/${variant.product_id}`)
  }
}

export async function updateStock(variantId: string, locationId: string, quantity: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("product_stock")
    .upsert({
      variant_id: variantId,
      location_id: locationId,
      quantity: quantity
    }, {
      onConflict: 'variant_id, location_id'
    })

  if (error) {
    throw new Error(`Error updating stock: ${error.message}`)
  }

  const { data: variant } = await supabase.from("product_variants").select("product_id").eq("id", variantId).single()
  if (variant) {
    revalidatePath(`/products/${variant.product_id}`)
  }
}

export async function getStockLocations() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("stock_locations")
    .select("*")
    .eq("is_active", true)
    .order("name")

  if (error) {
    console.error("Error fetching stock locations:", error)
    return []
  }

  return data
}
