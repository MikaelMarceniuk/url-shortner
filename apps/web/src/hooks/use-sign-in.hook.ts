import { authClient } from '@/lib/auth.lib'
import { SignInSchema } from '@/schemas/sign-in.schema'
import { useMutation } from '@tanstack/react-query'

export const useSignIn = () => {
  const mutation = useMutation({
    mutationFn: async ({ email, password }: SignInSchema) => {
      const result = await authClient.signIn.email({ email, password })

      // TODO Improve errors handling
      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data
    },
  })

  return {
    ...mutation,
  }
}
