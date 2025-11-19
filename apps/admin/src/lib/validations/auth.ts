// Auth validations schema
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export type LoginInput = z.infer<typeof loginSchema>