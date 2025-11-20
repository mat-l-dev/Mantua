import { getOrder } from "@/actions/orders"
import { notFound } from "next/navigation"
import { formatCurrency, formatDate } from "@mantua/shared/utils/format"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PaymentVerification } from "@/components/orders/payment-verification"

interface OrderPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params
  const order = await getOrder(orderId)

  if (!order) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Order {order.id.slice(0, 8)}</h2>
        <div className="flex items-center space-x-2">
          <Badge variant={
            order.status === 'completed' ? 'default' : 
            order.status === 'cancelled' ? 'destructive' : 
            'secondary'
          }>
            {order.status}
          </Badge>
        </div>
      </div>
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.product_name}</span>
                      <span className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                    <span>{formatCurrency(Number(item.unit_price))}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(Number(order.total_amount))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="font-medium">
                  {order.customers?.first_name} {order.customers?.last_name}
                </div>
                <div className="text-sm text-muted-foreground">{order.customers?.phone}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              {order.shipping_mode === 'envio_directo' && order.shipping_addresses ? (
                <div className="grid gap-2">
                  <div className="font-medium">Shipping Address</div>
                  <div className="text-sm text-muted-foreground">
                    {order.shipping_addresses.address}
                    <br />
                    {order.shipping_addresses.distrito}, {order.shipping_addresses.provincia}
                    <br />
                    {order.shipping_addresses.departamento}
                  </div>
                </div>
              ) : order.shipping_mode === 'pickup' && order.pickup_locations ? (
                <div className="grid gap-2">
                  <div className="font-medium">Pickup Location</div>
                  <div className="text-sm text-muted-foreground">
                    {order.pickup_locations.name}
                    <br />
                    {order.pickup_locations.direccion}
                    <br />
                    {order.pickup_locations.distrito}, {order.pickup_locations.provincia}
                    <br />
                    {order.pickup_locations.departamento}
                    {order.pickup_locations.horarios && (
                      <>
                        <br />
                        <span className="text-xs italic">{order.pickup_locations.horarios}</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No delivery information available</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Method</span>
                  <span className="text-sm font-medium capitalize">
                    {order.payment_proofs?.[0]?.payment_methods?.name || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium capitalize">
                    {order.payment_proofs?.[0]?.status || 'Pending'}
                  </span>
                </div>
                {order.payment_proofs && order.payment_proofs.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Payment Proofs</div>
                    <div className="space-y-4">
                      {order.payment_proofs.map((proof) => (
                        <div key={proof.id} className="flex items-center justify-between border p-3 rounded-md">
                          <div className="flex flex-col space-y-1">
                            <a href={proof.proof_image_path} target="_blank" rel="noopener noreferrer" className="text-sm underline hover:text-primary">
                              View Proof
                            </a>
                            <span className="text-xs text-muted-foreground">{formatDate(proof.created_at)}</span>
                          </div>
                          <PaymentVerification 
                            proofId={proof.id} 
                            orderId={order.id} 
                            status={proof.status} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
