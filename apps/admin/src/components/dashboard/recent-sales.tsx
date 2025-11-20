import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { formatCurrency } from "@mantua/shared/utils"

interface RecentSalesProps {
  sales: {
    id: string
    total_amount: number | null
    created_at: string
    status: string | null
    customers: {
      first_name: string | null
      last_name: string | null
      phone: string | null
    } | null
  }[]
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {sale.customers?.first_name?.[0] || 'C'}
              {sale.customers?.last_name?.[0] || ''}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {sale.customers?.first_name} {sale.customers?.last_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {sale.customers?.phone || 'Sin teléfono'}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {formatCurrency(sale.total_amount || 0)}
          </div>
        </div>
      ))}
      {sales.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No hay ventas recientes
        </p>
      )}
    </div>
  )
}
