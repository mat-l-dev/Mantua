'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Badge } from '@/components/ui/badge'

export type StaffColumn = {
  id: string
  name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
}

export const columns: ColumnDef<StaffColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
  },
  {
    accessorKey: 'is_active',
    header: 'Estado',
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? 'default' : 'destructive'}>
        {row.original.is_active ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Creado',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
