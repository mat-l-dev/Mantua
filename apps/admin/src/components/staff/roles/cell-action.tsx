'use client'

import { useRouter } from 'next/navigation'
import { Copy, Edit, Trash, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { StaffRoleColumn } from './columns'
import { deleteStaffRole } from '@/actions/staff-roles'
import { useToast } from '@/hooks/use-toast'

interface CellActionProps {
  data: StaffRoleColumn
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter()
  const { toast } = useToast()

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast({
      title: 'Copiado',
      description: 'ID del rol copiado al portapapeles',
    })
  }

  const onDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este rol?')) {
      return
    }

    try {
      const result = await deleteStaffRole(data.id)
      
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Éxito',
          description: 'Rol eliminado correctamente',
        })
        router.refresh()
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Algo salió mal',
        variant: 'destructive',
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Copiar ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/settings/staff/roles/${data.id}`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
