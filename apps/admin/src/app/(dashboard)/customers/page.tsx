import { getCustomers } from "@/actions/customers"
import { CustomerClient } from "@/components/customers/client"
import { CustomerColumn } from "@/components/customers/columns"
import { formatDate } from "@mantua/shared/utils/format"

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const customers = await getCustomers()

  const formattedCustomers: CustomerColumn[] = customers.map((item) => ({
    id: item.id,
    name: `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Sin Nombre',
    email: item.email || '',
    phone: item.phone || '',
    type: item.customer_type,
    isActive: item.is_active ?? false,
    createdAt: formatDate(item.created_at || new Date().toISOString()),
  }))

  return (
    <div className="flex-col animate-fade-in">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <CustomerClient data={formattedCustomers} />
      </div>
    </div>
  )
}
