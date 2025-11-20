import { getCustomer } from "@/actions/customers"
import { notFound } from "next/navigation"
import { formatDate, formatCurrency } from "@mantua/shared/utils/format"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface CustomerPageProps {
  params: Promise<{
    customerId: string
  }>
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { customerId } = await params
  const customer = await getCustomer(customerId)

  if (!customer) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link href="/customers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">
          {customer.first_name} {customer.last_name}
        </h2>
        <Badge variant={customer.is_active ? "default" : "destructive"}>
          {customer.is_active ? "Activo" : "Inactivo"}
        </Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">Email:</span> {customer.email}
            </div>
            <div>
              <span className="font-semibold">Teléfono:</span> {customer.phone || '-'}
            </div>
            <div>
              <span className="font-semibold">Tipo:</span> <span className="capitalize">{customer.customer_type.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="font-semibold">Documento Hash:</span> <span className="text-xs font-mono">{customer.document_hash || '-'}</span>
            </div>
            <div>
              <span className="font-semibold">Registrado:</span> {formatDate(customer.created_at)}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Direcciones ({customer.shipping_addresses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {customer.shipping_addresses.map((addr) => (
                <div key={addr.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="capitalize">{addr.label}</Badge>
                    {addr.is_default && <Badge>Default</Badge>}
                  </div>
                  <p className="text-sm">{addr.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {addr.distrito}, {addr.provincia}, {addr.departamento}
                  </p>
                </div>
              ))}
              {customer.shipping_addresses.length === 0 && (
                <p className="text-muted-foreground">No hay direcciones registradas.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-4" />

      <h3 className="text-xl font-bold">Historial de Órdenes ({customer.orders.length})</h3>
      <div className="rounded-md border">
        <div className="p-4">
          {customer.orders.length > 0 ? (
            <div className="space-y-4">
              {customer.orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">Orden #{order.id.slice(0, 8)}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(order.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{order.status}</Badge>
                    <span className="font-bold">{formatCurrency(Number(order.total_amount))}</span>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Este cliente no ha realizado órdenes.</p>
          )}
        </div>
      </div>
    </div>
  )
}
