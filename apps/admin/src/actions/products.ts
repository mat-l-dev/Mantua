'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

    const { error } = await supabase.from("products").insert([{
      name: data.name,
      description: data.description,
      price: data.price,
      cost: data.cost,
      puntos_acarreo: data.puntos_acarreo,
      image_path: data.image_path,
      slug: slug,
      published: false,
      is_active: true,
    }] as any)

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

    const { error } = await supabase
      .from("products")
      .update(data as any)
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
