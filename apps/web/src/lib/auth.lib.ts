import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL:
    typeof window !== 'undefined'
      ? window.location.origin // usa o domínio atual da organization em runtime
      : process.env.NEXT_PUBLIC_API_URL, // SSR fallback
})
