import { authClient } from '@/lib/auth.lib'
import { useMutation } from '@tanstack/react-query'

export const useSignOutMutation = () => {
  const mutation = useMutation({
    mutationFn: async () => await authClient.signOut(),
  })

  return {
    ...mutation,
  }
}
