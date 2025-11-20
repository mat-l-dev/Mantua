'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Database } from "@mantua/shared/types/database.types"

export type StaffRole = Database['public']['Tables']['staff_roles']['Row']

export async function getStaffRoles(): Promise<StaffRole[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff_roles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching staff roles:', error)
    return []
  }

  return data
}

export async function getStaffRole(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff_roles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching staff role:', error)
    return null
  }

  return data
}

export async function createStaffRole(data: {
  name: string
  description: string | null
  permissions: Record<string, boolean>
}) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('staff_roles').insert({
    name: data.name,
    description: data.description,
    permissions: data.permissions,
    is_active: true
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/staff/roles')
  return { success: true }
}

export async function updateStaffRole(id: string, data: {
  name: string
  description: string | null
  permissions: Record<string, boolean>
}) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('staff_roles').update({
    name: data.name,
    description: data.description,
    permissions: data.permissions
  }).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/staff/roles')
  return { success: true }
}

export async function deleteStaffRole(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('staff_roles').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/staff/roles')
  return { success: true }
}
