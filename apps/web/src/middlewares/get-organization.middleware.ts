import { api } from '@/lib/axios.lib'
import { NextRequest, NextResponse } from 'next/server'
import { getDomain } from 'tldts'

export const getOrganizationMiddleware = async (
  req: NextRequest,
  res: NextResponse
) => {
  const host = req.headers.get('host')
  if (!host) {
    return NextResponse.json('Organization not found.', { status: 404 })
  }

  const domain = getDomain(host) || 'localhost'
  const { data } = await api.get<string | null>(
    `/api/organization/domain/${domain}`
  )

  if (!data) {
    const errorUrl = new URL('/404', req.url)
    const redirectResponse = NextResponse.redirect(errorUrl)

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

  res.cookies.set('organization_id', data, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return null
}
