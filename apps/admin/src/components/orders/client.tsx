"use client"

import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
import { columns, OrderColumn } from "./columns"
import { CheckCircle2, Circle, Timer, Truck, XCircle } from "lucide-react"

interface OrderClientProps {
  data: OrderColumn[]
}

const statuses = [
  {
    value: "pending",
    label: "Pendiente",
    icon: Circle,
  },
  {
    value: "processing",
    label: "Procesando",
    icon: Timer,
  },
  {
    value: "verified",
    label: "Verificado",
    icon: CheckCircle2,
  },
  {
    value: "rejected",
    label: "Rechazado",
    icon: XCircle,
  },
  {
    value: "shipped",
    label: "Enviado",
    icon: Truck,
  },
  {
    value: "completed",
    label: "Completado",
    icon: CheckCircle2,
  },
  {
    value: "cancelled",
    label: "Cancelado",
    icon: XCircle,
  },
]

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
      </div>
      <Separator className="my-4" />
      <DataTable 
        filterColumn="customer" 
        filterPlaceholder="Buscar cliente..." 
        columns={columns} 
        data={data}
        facetedFilters={[
          {
            column: "status",
            title: "Estado",
            options: statuses,
          }
        ]}
      />
    </>
  )
}
