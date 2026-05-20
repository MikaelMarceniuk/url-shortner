'use client'

import { createContext, useContext, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/lib/auth.lib'
import type { SignInSchema } from '@/schemas/sign-in.schema'
import { withChildren } from '@/types/with-children.type'
import { useSignIn } from '@/hooks/use-sign-in.hook'
import { useSignOutMutation } from '@/hooks/use-sign-out.hook'

type Session = typeof authClient.$Infer.Session.session
type User = typeof authClient.$Infer.Session.user

interface AuthContext {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (data: SignInSchema) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContext | null>(null)

export const AuthProviderContext: React.FC<withChildren> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const signInMutation = useSignIn()
  const signOutMutation = useSignOutMutation()

  const { data, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const session = await authClient.getSession()
      return session.data
    },
    refetchInterval: 1000 * 60 * 5, // Revalida a sessão a cada 5 minutos
    retry: false,
  })

  // Redireciona para sign-in se a sessão expirar
  useEffect(() => {
    if (isLoading) return

    if (!data?.session && pathname !== '/sign-in') {
      router.replace('/sign-in?s_error=session_ended')
    }
  }, [data, isLoading, pathname, router])

  const signIn = useCallback(
    async (data: SignInSchema) => {
      await signInMutation.mutateAsync(data, {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ['session'] })
          router.push('/')
        },
      })
    },
    [signInMutation]
  )

  const signOut = useCallback(async () => {
    await signOutMutation.mutateAsync(undefined, {
      onSuccess: () => {
        queryClient.clear()
        router.push('/sign-in')
      },
    })
  }, [signOutMutation])

  return (
    <AuthContext.Provider
      value={{
        user: data?.user ?? null,
        session: data?.session ?? null,
        isLoading: isLoading || signInMutation.isPending,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProviderContext')
  }

  return context
}
