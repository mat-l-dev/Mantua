'use client'

import { ColumnDef } from '@tanstack/react-table'
import { StockLocation } from '@/actions/locations'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Pencil, Trash } from 'lucide-react'
import { StockLocationForm } from './stock-location-form'
import { deleteStockLocation } from '@/actions/locations'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export const columns: ColumnDef<StockLocation>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'address',
    header: 'Dirección',
  },
  {
    accessorKey: 'is_active',
    header: 'Estado',
    cell: ({ row }) => (
      <div className={row.getValue('is_active') ? 'text-green-600' : 'text-red-600'}>
        {row.getValue('is_active') ? 'Activo' : 'Inactivo'}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const location = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast()

      const onDelete = async () => {
        const result = await deleteStockLocation(location.id)
        if (result.error) {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Éxito',
            description: 'Almacén eliminado correctamente.',
          })
        }
      }

      return (
        <div className="flex items-center gap-2">
          <StockLocationForm
            initialData={location}
            trigger={
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente el almacén.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]
