'use client'

import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { columns, StaffColumn } from './columns'

interface StaffClientProps {
  data: StaffColumn[]
}

export function StaffClient({ data }: StaffClientProps) {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Usuarios de Staff</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona los usuarios que tienen acceso al panel administrativo.
            </p>
          </div>
          <Button
            onClick={() => router.push('/settings/staff/new')}
            className="gap-2 rounded-full"
          >
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <Separator />

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={data}
          filterPlaceholder="Buscar usuario..."
          filterColumn="name"
        />
      </div>
    </div>
  )
}
