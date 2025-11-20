'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'

export type StaffRoleColumn = {
  id: string
  name: string
  description: string | null
  created_at: string
}

export const columns: ColumnDef<StaffRoleColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Rol',
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
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
