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
import { createStockLocation, updateStockLocation, StockLocation } from '@/actions/locations'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Requerido' }),
  address: z.string().optional(),
  is_active: z.boolean(),
})

type StockLocationFormValues = z.infer<typeof formSchema>

interface StockLocationFormProps {
  initialData?: StockLocation | null
  trigger?: React.ReactNode
}

export function StockLocationForm({ initialData, trigger }: StockLocationFormProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<StockLocationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      is_active: initialData?.is_active ?? true,
    },
  })

  const onSubmit = async (data: StockLocationFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        const result = await updateStockLocation(initialData.id, data)
        if (result.error) throw new Error(result.error)
      } else {
        const result = await createStockLocation(data)
        if (result.error) throw new Error(result.error)
      }
      setOpen(false)
      form.reset()
      toast({
        title: 'Éxito',
        description: `Almacén ${initialData ? 'actualizado' : 'creado'} correctamente.`,
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
            <Plus className="mr-2 h-4 w-4" /> Nuevo Almacén
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Almacén' : 'Nuevo Almacén'}</DialogTitle>
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
                    <Input disabled={loading} placeholder="Almacén Central" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
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
              {initialData ? 'Guardar Cambios' : 'Crear Almacén'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
