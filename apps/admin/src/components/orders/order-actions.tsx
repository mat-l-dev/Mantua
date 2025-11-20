'use client'

import { useState } from "react"
import { updateOrderStatus, OrderStatus } from "@/actions/orders"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, Loader2 } from "lucide-react"

interface OrderActionsProps {
  orderId: string
  currentStatus: string | null
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  processing: "Procesando",
  verified: "Verificado",
  rejected: "Rechazado",
  shipped: "Enviado",
  completed: "Completado",
  cancelled: "Cancelado",
}

const AVAILABLE_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'verified',
  'rejected',
  'shipped',
  'completed',
  'cancelled'
]

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const onUpdateStatus = async (status: OrderStatus) => {
    try {
      setLoading(true)
      await updateOrderStatus(orderId, status)
      toast({
        title: "Estado actualizado",
        description: `La orden ha sido marcada como ${STATUS_LABELS[status]}.`,
      })
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Cambiar Estado"
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {AVAILABLE_STATUSES.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onUpdateStatus(status)}
            disabled={status === currentStatus}
          >
            {STATUS_LABELS[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
