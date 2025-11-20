'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Database } from "@mantua/shared/types/database.types"

export type PickupLocation = Database['public']['Tables']['pickup_locations']['Row']
export type StockLocation = Database['public']['Tables']['stock_locations']['Row']

// --- Pickup Locations ---

export async function getPickupLocations() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pickup_locations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pickup locations:', error)
    return []
  }

  return data
}

export async function createPickupLocation(data: Database['public']['Tables']['pickup_locations']['Insert']) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pickup_locations')
    .insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/locations')
  return { success: true }
}

export async function updatePickupLocation(id: string, data: Database['public']['Tables']['pickup_locations']['Update']) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pickup_locations')
    .update(data)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/locations')
  return { success: true }
}

export async function deletePickupLocation(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pickup_locations')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/locations')
  return { success: true }
}

// --- Stock Locations ---

export async function getStockLocations() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stock_locations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching stock locations:', error)
    return []
  }

  return data
}

export async function createStockLocation(data: Database['public']['Tables']['stock_locations']['Insert']) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('stock_locations')
    .insert(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/locations')
  return { success: true }
}

export async function updateStockLocation(id: string, data: Database['public']['Tables']['stock_locations']['Update']) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('stock_locations')
    .update(data)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/locations')
  return { success: true }
}

export async function deleteStockLocation(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('stock_locations')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/locations')
  return { success: true }
}
