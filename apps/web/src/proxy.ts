import { NextResponse } from 'next/server' // Importe o NextResponse
import type { NextRequest } from 'next/server'
import { authClient } from './lib/auth.lib'

export const proxy = async (req: NextRequest) => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: req.headers,
    },
  })

  const newUrl = new URL(req.url)
  const isUserSignIn = !!session?.data

  if (!isUserSignIn && newUrl.pathname !== '/sign-in') {
    const redirectUrl = new URL('/sign-in', req.url)
    redirectUrl.searchParams.set('s_error', 'unauthorized')

    console.log('redirectUrl: ', redirectUrl)
    return NextResponse.redirect(redirectUrl)
  }

  console.log('current session: ', session, newUrl.pathname)
}

export const config = {
  matcher: [
    /*
     * Ignora o que você não quer interceptar:
     * - api (rotas de backend se houver)
     * - _next/static e _next/image (os chunks de código e imagens que poluíram seu log)
     * - favicon.ico (o ícone da aba)
     * - .*\\..* (qualquer arquivo que tenha extensão como .js, .css, .png, .svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
