'use server'

import { createClient } from "@/lib/supabase/server"
import { Database } from "@mantua/shared/types/database.types"
import { revalidatePath } from "next/cache"

export type OrderWithCustomer = Database['public']['Tables']['orders']['Row'] & {
  customers: Database['public']['Tables']['customers']['Row'] | null
}

export type OrderDetail = Database['public']['Tables']['orders']['Row'] & {
  customers: Database['public']['Tables']['customers']['Row'] | null
  shipping_addresses: Database['public']['Tables']['shipping_addresses']['Row'] | null
  pickup_locations: Database['public']['Tables']['pickup_locations']['Row'] | null
  order_items: Database['public']['Tables']['order_items']['Row'][]
  payment_proofs: (Database['public']['Tables']['payment_proofs']['Row'] & {
    payment_methods: Database['public']['Tables']['payment_methods']['Row'] | null
  })[]
}

export async function getOrders(): Promise<OrderWithCustomer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select("*, customers(*)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return (data as unknown as OrderWithCustomer[]) || []
}

export async function getOrder(id: string): Promise<OrderDetail | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customers(*),
      shipping_addresses(*),
      pickup_locations(*),
      order_items(*),
      payment_proofs(
        *,
        payment_methods(*)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching order:", error)
    return null
  }

  return data as unknown as OrderDetail
}

export async function verifyPayment(proofId: string, orderId: string) {
  const supabase = await createClient()
  
  const { error: proofError } = await supabase
    .from("payment_proofs")
    .update({ 
      status: "approved",
      verified_at: new Date().toISOString()
    })
    .eq("id", proofId)

  if (proofError) {
    throw new Error(`Error verifying payment: ${proofError.message}`)
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "verified" })
    .eq("id", orderId)

  if (orderError) {
    throw new Error(`Error updating order status: ${orderError.message}`)
  }

  revalidatePath(`/orders/${orderId}`)
  revalidatePath("/orders")
}

export async function rejectPayment(proofId: string, orderId: string, reason: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("payment_proofs")
    .update({ 
      status: "rejected",
      rejection_reason: reason,
      verified_at: new Date().toISOString()
    })
    .eq("id", proofId)

  if (error) {
    throw new Error(`Error rejecting payment: ${error.message}`)
  }

  revalidatePath(`/orders/${orderId}`)
  revalidatePath("/orders")
}
