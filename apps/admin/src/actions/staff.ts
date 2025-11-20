'use server'

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { Database } from "@mantua/shared/types/database.types"

export type Staff = Database['public']['Tables']['staff']['Row'] & {
  staff_roles: Database['public']['Tables']['staff_roles']['Row'] | null
}

export async function getStaffMembers(): Promise<(Staff & { email?: string })[]> {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()
  
  const { data: staff, error } = await supabase
    .from('staff')
    .select('*, staff_roles(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching staff:', error)
    return []
  }

  // Fetch emails
  const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
  
  if (usersError) return staff as Staff[]

  const staffWithEmail = staff.map(s => {
    const user = users.find(u => u.id === s.id)
    return {
      ...s,
      email: user?.email
    }
  })

  return staffWithEmail as (Staff & { email?: string })[]
}

export async function getStaffMember(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff')
    .select('*, staff_roles(*)')
    .eq('id', id)
    .single()

  if (error) {
    return null
  }

  return data
}

export async function createStaffMember(data: {
  email: string
  password: string
  first_name: string
  last_name: string
  role_id: string
  phone?: string
}) {
  const supabaseAdmin = createAdminClient()
  
  // 1. Create user in Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      first_name: data.first_name,
      last_name: data.last_name,
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'No se pudo crear el usuario' }
  }

  // 2. Create staff record
  const { error: dbError } = await supabaseAdmin.from('staff').insert({
    id: authData.user.id,
    first_name: data.first_name,
    last_name: data.last_name,
    role_id: data.role_id,
    phone: data.phone,
    is_active: true
  })

  if (dbError) {
    // Rollback auth user creation if DB fails
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return { error: dbError.message }
  }

  revalidatePath('/settings/staff')
  return { success: true }
}

export async function updateStaffMember(id: string, data: {
  first_name: string
  last_name: string
  role_id: string
  phone?: string
  is_active?: boolean
}) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('staff').update({
    first_name: data.first_name,
    last_name: data.last_name,
    role_id: data.role_id,
    phone: data.phone,
    is_active: data.is_active
  }).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/staff')
  return { success: true }
}

export async function deleteStaffMember(id: string) {
  const supabaseAdmin = createAdminClient()
  
  // Delete from Auth (cascade should handle DB, but let's be safe)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/settings/staff')
  return { success: true }
}
