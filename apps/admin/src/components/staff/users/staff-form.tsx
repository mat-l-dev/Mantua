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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { createStaffMember, updateStaffMember, Staff } from '@/actions/staff'
import { StaffRole } from '@/actions/staff-roles'

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().optional(),
  first_name: z.string().min(2, { message: 'Requerido' }),
  last_name: z.string().min(2, { message: 'Requerido' }),
  role_id: z.string().min(1, { message: 'Selecciona un rol' }),
  phone: z.string().optional(),
  is_active: z.boolean(),
})

type StaffFormValues = z.infer<typeof formSchema>

interface StaffFormProps {
  initialData?: (Staff & { email?: string }) | null
  roles: StaffRole[]
}

export function StaffForm({ initialData, roles }: StaffFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar Usuario' : 'Crear Usuario'
  const description = initialData ? 'Editar un usuario existente.' : 'Añadir un nuevo usuario al staff.'
  const action = initialData ? 'Guardar cambios' : 'Crear'

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData?.email || '',
      password: '',
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      role_id: initialData?.role_id || '',
      phone: initialData?.phone || '',
      is_active: initialData?.is_active ?? true,
    },
  })

  const onSubmit = async (data: StaffFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        const result = await updateStaffMember(initialData.id, data)
        if (result.error) throw new Error(result.error)
      } else {
        if (!data.password) {
          throw new Error('La contraseña es requerida para nuevos usuarios')
        }
        const result = await createStaffMember({
          ...data,
          password: data.password
        })
        if (result.error) throw new Error(result.error)
      }
      router.refresh()
      router.push('/settings/staff')
      toast({
        title: 'Éxito',
        description: `Usuario ${initialData ? 'actualizado' : 'creado'} correctamente.`,
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
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading || !!initialData} placeholder="juan@mantua.pe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{initialData ? 'Contraseña (Opcional)' : 'Contraseña'}</FormLabel>
                  <FormControl>
                    <Input type="password" disabled={loading} placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="999888777" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
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
                      Activo
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </div>
  )
}
