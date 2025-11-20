'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function getDashboardStats() {
  const supabase = createAdminClient()

  // 1. Ingresos Totales (Suma de total_amount de órdenes completadas)
  const { data: revenueData, error: revenueError } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'completed')

  if (revenueError) {
    console.error('Error fetching revenue:', revenueError)
  }

  const totalRevenue = revenueData?.reduce((acc: number, order: { total_amount: number | null }) => acc + (order.total_amount || 0), 0) || 0

  // 2. Órdenes Pendientes (status = 'pending' o 'processing')
  const { count: pendingOrdersCount, error: pendingError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'processing'])

  if (pendingError) {
    console.error('Error fetching pending orders:', pendingError)
  }

  // 3. Total de Clientes
  const { count: customersCount, error: customersError } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  if (customersError) {
    console.error('Error fetching customers count:', customersError)
  }

  // 4. Productos Activos
  const { count: productsCount, error: productsError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  if (productsError) {
    console.error('Error fetching products count:', productsError)
  }

  return {
    totalRevenue,
    pendingOrdersCount: pendingOrdersCount || 0,
    customersCount: customersCount || 0,
    productsCount: productsCount || 0,
  }
}

export async function getRecentSales() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      created_at,
      status,
      customers (
        first_name,
        last_name,
        phone
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching recent sales:', error)
    return []
  }

  return data
}
