import { NextRequest, NextResponse } from 'next/server'
import { getOrganizationMiddleware } from './middlewares/get-organization.middleware'
import { getSessionMiddleware } from './middlewares/get-session.middleware'

export const proxy = async (req: NextRequest) => {
  const res = NextResponse.next()

  const organizationResponse = await getOrganizationMiddleware(req, res)
  if (organizationResponse) return organizationResponse

  const sessionResponse = await getSessionMiddleware(req, res)
  if (sessionResponse) return sessionResponse

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
