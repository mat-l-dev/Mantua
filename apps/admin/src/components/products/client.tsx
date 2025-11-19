'use client'

import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { columns, ProductColumn } from './columns'

interface ProductClientProps {
  data: ProductColumn[]
}

export function ProductClient({ data }: ProductClientProps) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Header con descripción y botón */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona tu catálogo de productos y los puntos de acarreo.
            </p>
          </div>
          <Button
            onClick={() => router.push('/products/new')}
            className="gap-2 rounded-full"
          >
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      <Separator />

      {/* DataTable */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={data}
          filterPlaceholder="Buscar producto..."
          filterColumn="name"
        />
      </div>

      {/* Footer con info */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No hay productos. Comienza creando uno.
          </p>
        </div>
      )}
    </div>
  )
}
