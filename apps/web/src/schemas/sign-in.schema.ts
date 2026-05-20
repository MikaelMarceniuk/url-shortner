import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email({ message: 'E-mail inválido' }),
  password: z.string().min(1, { message: 'Senha obrigatória' }),
})

export type SignInSchema = z.infer<typeof signInSchema>
