import { getOrders } from "@/actions/orders"
import { OrderClient } from "@/components/orders/client"
import { OrderColumn } from "@/components/orders/columns"

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const orders = await getOrders()

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    customer: item.customers 
      ? `${item.customers.first_name || ''} ${item.customers.last_name || ''}`.trim() || 'Cliente Desconocido'
      : 'Cliente Eliminado',
    status: item.status || 'pending',
    total: Number(item.total_amount),
    createdAt: new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(item.created_at)),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}
