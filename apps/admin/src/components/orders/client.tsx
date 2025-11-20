"use client"

import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
import { columns, OrderColumn } from "./columns"

interface OrderClientProps {
  data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Órdenes ({data.length})</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona los pedidos de tu tienda
          </p>
        </div>
        {/* Orders are usually created by customers, but maybe manual creation is needed later */}
        {/* <Button onClick={() => router.push(`/orders/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Orden
        </Button> */}
      </div>
      <Separator className="my-4" />
      <DataTable filterColumn="customer" filterPlaceholder="Buscar cliente..." columns={columns} data={data} />
    </>
  )
}
