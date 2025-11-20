"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export type CustomerColumn = {
  id: string
  name: string
  email: string
  phone: string
  type: string
  createdAt: string
  isActive: boolean
}

export const columns: ColumnDef<CustomerColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => <div className="capitalize">{(row.getValue("type") as string).replace('_', ' ')}</div>,
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
        {row.getValue("isActive") ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Registrado",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original

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
            <DropdownMenuItem asChild>
              <Link href={`/customers/${customer.id}`}>
                <Eye className="mr-2 h-4 w-4" /> Ver Detalle
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
