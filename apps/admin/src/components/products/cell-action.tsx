'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Edit, Trash, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ProductColumn } from './columns'
import { deleteProduct } from '@/actions/products'
import { useToast } from '@/hooks/use-toast'

interface CellActionProps {
  data: ProductColumn
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast({
      title: 'Copiado',
      description: 'ID del producto copiado al portapapeles',
    })
  }

  const onDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return
    }

    setLoading(true)
    try {
      const result = await deleteProduct(data.id)
      
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Eliminado',
          description: 'Producto eliminado correctamente',
        })
        router.refresh()
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Algo salió mal',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onCopy(data.id)} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          <span>Copiar ID</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => router.push(`/products/${data.id}`)}
          className="cursor-pointer"
        >
          <Edit className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          disabled={loading}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>{loading ? 'Eliminando...' : 'Eliminar'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
