'use client'

import { ColumnDef, CellContext } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { CellAction } from './cell-action'
import { formatCurrency } from '@/lib/utils'

export interface ProductColumn {
  id: string
  name: string
  sku: string
  selling_price: number
  cost_price: number
  puntos_acarreo: number
  is_active: boolean
  created_at: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }: CellContext<ProductColumn, unknown>) => (
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-foreground">{row.getValue('name')}</span>
        <span className="text-xs text-muted-foreground">{row.original.sku}</span>
      </div>
    ),
  },
  {
    accessorKey: 'selling_price',
    header: 'Precio Venta',
    cell: ({ row }: CellContext<ProductColumn, unknown>) => (
      <span className="font-medium">{formatCurrency(row.getValue('selling_price') as number)}</span>
    ),
  },
  {
    accessorKey: 'cost_price',
    header: 'Costo',
    cell: ({ row }: CellContext<ProductColumn, unknown>) => (
      <span className="text-muted-foreground">{formatCurrency(row.getValue('cost_price') as number)}</span>
    ),
  },
  {
    accessorKey: 'puntos_acarreo',
    header: 'Puntos',
    cell: ({ row }: CellContext<ProductColumn, unknown>) => {
      const puntos = row.getValue('puntos_acarreo') as number
      return (
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
          >
            {puntos}
          </Badge>
          <span className="text-sm">📦</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Estado',
    cell: ({ row }: CellContext<ProductColumn, unknown>) => {
      const isActive = row.getValue('is_active') as boolean
      return (
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className={isActive 
            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800' 
            : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800'
          }
        >
          {isActive ? '✓ Activo' : '○ Inactivo'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }: CellContext<ProductColumn, unknown>) => <CellAction data={row.original} />,
  },
]
