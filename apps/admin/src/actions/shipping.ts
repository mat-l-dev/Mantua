'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateTierCost(tierId: string, newCost: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tiers_acarreo')
    .update({ costo: newCost })
    .eq('id', tierId)

  if (error) {
    console.error("Error actualizando tier:", error)
    return { error: error.message }
  }

  revalidatePath('/settings/shipping')
  return { success: true }
}

export async function getTiers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tiers_acarreo')
    .select('*')
    .order('puntos_minimos', { ascending: true })

  if (error) return []
  return data
}
