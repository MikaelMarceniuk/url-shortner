import { authClient } from '@/lib/auth.lib'
import { NextRequest, NextResponse } from 'next/server'

export const getSessionMiddleware = async (
  req: NextRequest,
  res: NextResponse
) => {
  const newUrl = new URL(req.url)

  const session = await authClient.getSession({
    fetchOptions: {
      headers: req.headers,
    },
  })

  const isUserSignIn = !!session?.data

  if (!isUserSignIn && newUrl.pathname !== '/sign-in') {
    const redirectUrl = new URL('/sign-in', req.url)
    redirectUrl.searchParams.set('s_error', 'unauthorized')

    const redirectResponse = NextResponse.redirect(redirectUrl)

    res.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    })

    return redirectResponse
  }

  return null
}
