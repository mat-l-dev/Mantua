'use server'

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { Database } from "@mantua/shared/types/database.types"

export type Customer = Database['public']['Tables']['customers']['Row'] & {
  email?: string
}

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customers:', error)
    return []
  }

  // Fetch emails from auth.users
  // Note: In a real large scale app, we might want to sync email to public.customers or use a different strategy
  // For now, listing all users is fine for admin
  const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

  if (usersError) {
    console.error('Error fetching auth users:', usersError)
    return customers
  }

  const customersWithEmail = customers.map(c => {
    const user = users.find(u => u.id === c.id)
    return {
      ...c,
      email: user?.email
    }
  })

  return customersWithEmail
}

export async function getCustomer(id: string) {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  const { data: customer, error } = await supabase
    .from('customers')
    .select(`
      *,
      shipping_addresses (*),
      orders (
        *,
        order_items (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching customer:', error)
    return null
  }

  const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(id)

  if (userError) {
    console.error('Error fetching auth user:', userError)
  }

  return {
    ...customer,
    email: user?.email
  }
}
