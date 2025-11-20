'use client'

import { useState } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { createPickupLocation, updatePickupLocation, PickupLocation } from '@/actions/locations'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Requerido' }),
  departamento: z.string().min(2, { message: 'Requerido' }),
  provincia: z.string().min(2, { message: 'Requerido' }),
  distrito: z.string().min(2, { message: 'Requerido' }),
  direccion: z.string().min(5, { message: 'Requerido' }),
  horarios: z.string().optional(),
  capacidad: z.number().min(1, { message: 'Mínimo 1' }),
  is_active: z.boolean(),
})

type PickupLocationFormValues = z.infer<typeof formSchema>

interface PickupLocationFormProps {
  initialData?: PickupLocation | null
  trigger?: React.ReactNode
}

export function PickupLocationForm({ initialData, trigger }: PickupLocationFormProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<PickupLocationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      departamento: initialData?.departamento || '',
      provincia: initialData?.provincia || '',
      distrito: initialData?.distrito || '',
      direccion: initialData?.direccion || '',
      horarios: initialData?.horarios || '',
      capacidad: initialData?.capacidad || 100,
      is_active: initialData?.is_active ?? true,
    },
  })

  const onSubmit = async (data: PickupLocationFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        const result = await updatePickupLocation(initialData.id, data)
        if (result.error) throw new Error(result.error)
      } else {
        const result = await createPickupLocation(data)
        if (result.error) throw new Error(result.error)
      }
      setOpen(false)
      form.reset()
      toast({
        title: 'Éxito',
        description: `Agencia ${initialData ? 'actualizada' : 'creada'} correctamente.`,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nueva Agencia
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Agencia' : 'Nueva Agencia'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Shalom - Arequipa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="provincia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="distrito"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distrito</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        disabled={loading} 
                        {...field} 
                        onChange={e => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="horarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horarios</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Lun-Vie 9-6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-input p-4">
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
            <Button disabled={loading} className="w-full" type="submit">
              {initialData ? 'Guardar Cambios' : 'Crear Agencia'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
