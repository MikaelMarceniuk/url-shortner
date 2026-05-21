import { betterAuth } from 'better-auth'
import { admin, organization, openAPI } from 'better-auth/plugins'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { mongoClient } from './db/db.config'
import { ac, user, admin as adminRole, owner } from './roles.config'
import { env } from './env.config'
import { organizationCollection } from './db/collections/organization.collection'

export const auth = betterAuth({
  plugins: [
    admin({
      ac,
      roles: { user, admin: adminRole, owner },
      adminRoles: ['admin', 'owner'],
      defaultRole: 'user',
    }),
    organization({
      schema: {
        organization: {
          additionalFields: {
            host: {
              type: 'string',
              required: true,
              input: true,
            },
          },
        },
      },
    }),
    openAPI(),
  ],
  database: mongodbAdapter(mongoClient.getDb()),
  experimental: {
    joins: true,
  },
  trustedOrigins: async (request) => {
    if (!request) return []

    const origin = request.headers.get('origin')
    if (!origin) return []

    try {
      const hostname = new URL(origin).hostname
      if (env.NODE_ENV !== 'PRD' && hostname === 'localhost') return [origin]

      const org = await organizationCollection().findOne({
        host: hostname,
      })

      return org ? [origin] : []
    } catch {
      return []
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    disableSignUp: true,
    password: {
      hash: async (password) => await Bun.password.hash(password),
      verify: async ({ password, hash }) =>
        await Bun.password.verify(password, hash),
    },
  },
  basePath: '/api/auth',
})
