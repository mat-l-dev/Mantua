'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

export type AuditLog = {
  id: string
  table_name: string
  record_id: string
  action: string
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  changed_by: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return format(new Date(row.getValue('created_at')), 'dd/MM/yyyy HH:mm', { locale: es })
    },
  },
  {
    accessorKey: 'action',
    header: 'Acción',
    cell: ({ row }) => {
      const action = row.getValue('action') as string
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default'
      
      if (action === 'INSERT') variant = 'default' // Greenish usually
      if (action === 'UPDATE') variant = 'secondary' // Blueish
      if (action === 'DELETE') variant = 'destructive' // Red

      return <Badge variant={variant}>{action}</Badge>
    },
  },
  {
    accessorKey: 'table_name',
    header: 'Tabla',
  },
  {
    accessorKey: 'record_id',
    header: 'ID Registro',
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('record_id')}</span>,
  },
  {
    accessorKey: 'changed_by',
    header: 'Usuario',
    cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('changed_by') || 'Sistema'}</span>,
  },
]
