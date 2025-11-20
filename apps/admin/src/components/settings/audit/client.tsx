'use client'

import { DataTable } from '@/components/ui/data-table'
import { AuditLog, columns } from './columns'
import { Separator } from '@/components/ui/separator'

interface AuditClientProps {
  data: AuditLog[]
}

export function AuditClient({ data }: AuditClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Auditoría</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Registro de cambios y acciones en el sistema.
          </p>
        </div>
      </div>
      <Separator />
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          filterPlaceholder="Buscar por tabla..."
          filterColumn="table_name"
        />
      </div>
    </div>
  )
}
