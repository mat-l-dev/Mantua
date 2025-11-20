// Login server action
'use server'

import { createClient } from "@/lib/supabase/server"
import { loginSchema } from "@/lib/validations/auth"
import { redirect } from "next/navigation"


export async function loginAction(formData: FormData) {
  // 1. Validar datos de entrada con Zod
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const validation = loginSchema.safeParse(rawData)

  if (!validation.success) {
    return {
      error: "Datos inválidos. Revisa el formulario.",
    }
  }

  const { email, password } = validation.data
  const supabase = await createClient()

  // 2. Intentar iniciar sesión
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Login error:", error.message)
    return {
      error: "Credenciales incorrectas o usuario no encontrado.",
    }
  }

  // 3. Verificar si es Staff (Opcional pero recomendado para el Admin)
  // Podríamos agregar una query aquí para ver si está en la tabla 'staff'
  // Por ahora, si tiene login, lo dejamos pasar.

  // 4. Redireccionar al Dashboard
  redirect("/")
}