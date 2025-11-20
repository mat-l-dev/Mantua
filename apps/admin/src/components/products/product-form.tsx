"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createProduct, updateProduct } from "@/actions/products"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ImageUpload from "@/components/ui/image-upload"
import { Loader2 } from "lucide-react"
import { Database } from "@mantua/shared/types/database.types"

const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido").max(255),
  description: z.string().optional(),
  price: z.coerce.number().positive("Precio debe ser mayor a 0"),
  cost: z.coerce.number().positive("Costo debe ser mayor a 0"),
  puntos_acarreo: z.coerce
    .number()
    .int()
    .min(0, "Mínimo 0 puntos")
    .max(100, "Máximo 100 puntos"),
  category_id: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: Database['public']['Tables']['products']['Row'] | null
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || "",
      price: initialData.selling_price,
      cost: initialData.cost_price,
      puntos_acarreo: initialData.puntos_acarreo,
      images: initialData.image_path ? [initialData.image_path] : [],
    } : {
      name: "",
      description: "",
      price: 0,
      cost: 0,
      puntos_acarreo: 0,
      images: [],
    },
  })

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
      setLoading(true)
      
      if (initialData) {
        const result = await updateProduct(initialData.id, {
          name: values.name,
          description: values.description || null,
          price: values.price,
          cost: values.cost,
          puntos_acarreo: values.puntos_acarreo,
          image_path: values.images?.[0] || null,
        })

        if (result.error) {
          alert(`Error: ${result.error}`)
          return
        }
        
        router.refresh()
      } else {
        const result = await createProduct({
          name: values.name,
          description: values.description || null,
          price: values.price,
          cost: values.cost,
          puntos_acarreo: values.puntos_acarreo,
          image_path: values.images?.[0] || null,
        })

        if (result.error) {
          alert(`Error: ${result.error}`)
          return
        }

        router.push("/products")
      }
    } catch (error) {
      console.error("Error:", error)
      alert(initialData ? "Error al actualizar producto" : "Error al crear producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Kit Starlink v3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Detalles del producto..."
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Imágenes */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imágenes del Producto</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={loading}
                    value={field.value || []}
                    onChange={(url: string) => {
                      form.setValue("images", [...(field.value || []), url])
                    }}
                    onRemove={(url: string) => {
                      form.setValue(
                        "images",
                        (field.value || []).filter((img: string) => img !== url)
                      )
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Puedes subir una o más imágenes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Precio y Costo */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de Venta (S/)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo (S/)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Puntos de Acarreo (Destacado) */}
          <FormField
            control={form.control}
            name="puntos_acarreo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">📦</span>
                  Puntos de Acarreo (0-100)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20"
                    placeholder="ej: 25"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Escala de peso/volumen para calcular costo de envío
                  automáticamente
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Guardando..." : "Creando..."}
              </>
            ) : (
              initialData ? "Guardar Cambios" : "Crear Producto"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}