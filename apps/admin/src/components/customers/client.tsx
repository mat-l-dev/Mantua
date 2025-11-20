"use client"

import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
import { columns, CustomerColumn } from "./columns"

interface CustomerClientProps {
  data: CustomerColumn[]
}

export const CustomerClient: React.FC<CustomerClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes ({data.length})</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona los clientes registrados en la plataforma
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <DataTable filterColumn="name" filterPlaceholder="Buscar por nombre..." columns={columns} data={data} />
    </>
  )
}
