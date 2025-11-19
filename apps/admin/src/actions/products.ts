'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type ProductInsert = {
  name: string
  description: string | null
  cost_price: number
  selling_price: number
  puntos_acarreo: number
  image_path: string | null
  slug: string
  published: boolean
  is_active: boolean
  sku?: string
}

type ProductUpdate = Partial<Omit<ProductInsert, 'slug'>>

export async function createProduct(data: {
  name: string
  description: string | null
  price: number
  cost: number
  puntos_acarreo: number
  image_path: string | null
}) {
  try {
    const supabase = await createClient()

    // Generar slug desde el nombre
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .substring(0, 255)

    // Generar SKU único
    const sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const productData: ProductInsert = {
      name: data.name,
      description: data.description,
      cost_price: data.cost,
      selling_price: data.price,
      puntos_acarreo: data.puntos_acarreo,
      image_path: data.image_path,
      slug: slug,
      sku: sku,
      published: false,
      is_active: true,
    }

    const { error } = await supabase
      .from("products")
      .insert([productData])

    if (error) {
      console.error("Error creando producto:", error)
      return { error: error.message }
    }

    revalidatePath("/products")
    redirect("/products")
  } catch (error) {
    console.error("Error en createProduct:", error)
    return { error: "Error al crear el producto" }
  }
}

export async function getProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error obteniendo productos:", error)
    return []
  }

  return data || []
}

export async function updateProduct(
  id: string,
  data: {
    name?: string
    description?: string | null
    price?: number
    cost?: number
    puntos_acarreo?: number
    image_path?: string | null
    published?: boolean
    is_active?: boolean
  }
) {
  try {
    const supabase = await createClient()

    const updateData: ProductUpdate = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.price !== undefined) updateData.selling_price = data.price
    if (data.cost !== undefined) updateData.cost_price = data.cost
    if (data.puntos_acarreo !== undefined) updateData.puntos_acarreo = data.puntos_acarreo
    if (data.image_path !== undefined) updateData.image_path = data.image_path
    if (data.published !== undefined) updateData.published = data.published
    if (data.is_active !== undefined) updateData.is_active = data.is_active

    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)

    if (error) {
      console.error("Error actualizando producto:", error)
      return { error: error.message }
    }

    revalidatePath("/products")
    return { success: true }
  } catch (error) {
    console.error("Error en updateProduct:", error)
    return { error: "Error al actualizar el producto" }
  }
}

export async function deleteProduct(id: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error eliminando producto:", error)
      return { error: error.message }
    }

    revalidatePath("/products")
    return { success: true }
  } catch (error) {
    console.error("Error en deleteProduct:", error)
    return { error: "Error al eliminar el producto" }
  }
}
