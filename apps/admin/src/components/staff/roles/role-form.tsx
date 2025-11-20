'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { createStaffRole, updateStaffRole } from '@/actions/staff-roles'

const PERMISSIONS = [
  { id: 'products:view', label: 'Ver Productos' },
  { id: 'products:create', label: 'Crear Productos' },
  { id: 'products:edit', label: 'Editar Productos' },
  { id: 'products:delete', label: 'Eliminar Productos' },
  { id: 'orders:view', label: 'Ver Órdenes' },
  { id: 'orders:verify', label: 'Verificar Pagos' },
  { id: 'orders:manage', label: 'Gestionar Órdenes' },
  { id: 'customers:view', label: 'Ver Clientes' },
  { id: 'staff:manage', label: 'Gestionar Staff' },
  { id: 'settings:manage', label: 'Gestionar Configuración' },
]

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  description: z.string().optional(),
  permissions: z.record(z.string(), z.boolean()),
})

type StaffRoleFormValues = z.infer<typeof formSchema>

interface StaffRoleFormProps {
  initialData?: {
    id: string
    name: string
    description: string | null
    permissions: Record<string, boolean>
  } | null
}

export function StaffRoleForm({ initialData }: StaffRoleFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar Rol' : 'Crear Rol'
  const description = initialData ? 'Editar un rol existente.' : 'Añadir un nuevo rol.'
  const action = initialData ? 'Guardar cambios' : 'Crear'

  const form = useForm<StaffRoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || '',
      permissions: initialData.permissions || {},
    } : {
      name: '',
      description: '',
      permissions: {},
    },
  })

  const onSubmit = async (data: StaffRoleFormValues) => {
    try {
      setLoading(true)
      const formattedData = {
        name: data.name,
        description: data.description || null,
        permissions: data.permissions
      }

      if (initialData) {
        const result = await updateStaffRole(initialData.id, formattedData)
        if (result.error) throw new Error(result.error)
      } else {
        const result = await createStaffRole(formattedData)
        if (result.error) throw new Error(result.error)
      }
      router.refresh()
      router.push('/settings/staff/roles')
      toast({
        title: 'Éxito',
        description: `Rol ${initialData ? 'actualizado' : 'creado'} correctamente.`,
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Algo salió mal'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Administrador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} placeholder="Descripción del rol..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permisos</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {PERMISSIONS.map((permission) => (
                <FormField
                  key={permission.id}
                  control={form.control}
                  name={`permissions.${permission.id}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {permission.label}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </div>
  )
}
