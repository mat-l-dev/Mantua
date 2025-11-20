"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"

export type OrderColumn = {
  id: string
  customer: string
  status: string
  total: number
  createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Orden ID",
    cell: ({ row }) => <div className="w-20 truncate font-mono text-xs">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "customer",
    header: "Cliente",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      let variant: "default" | "secondary" | "destructive" | "outline" = "default"
      let label = status

      switch (status) {
        case "pending":
          variant = "secondary"
          label = "Pendiente"
          break
        case "verified":
          variant = "default" // Blue/Black
          label = "Verificado"
          break
        case "shipped":
          variant = "outline"
          label = "Enviado"
          break
        case "delivered":
          variant = "outline"
          label = "Entregado"
          break
        case "cancelled":
          variant = "destructive"
          label = "Cancelado"
          break
      }

      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{formatCurrency(row.getValue("total"))}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.getValue("createdAt")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copiar ID de orden
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
            <DropdownMenuItem>Ver cliente</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
