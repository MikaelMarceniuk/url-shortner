import { betterAuth } from 'better-auth'
import { admin, organization, openAPI } from 'better-auth/plugins'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { mongoClient } from './db/db.config'
import { ac, user, admin as adminRole, owner } from './roles.config'

export const auth = betterAuth({
  plugins: [
    admin({
      ac,
      roles: {
        user,
        admin: adminRole,
        owner,
      },
      adminRoles: ['admin', 'owner'],
      defaultRole: 'user',
    }),
    organization(),
    openAPI(),
  ],
  database: mongodbAdapter(mongoClient.getDb()),
  experimental: {
    joins: true,
  },
  trustedOrigins: [
    'http://localhost:3333', // Seu próprio servidor
    'http://localhost:3000', // Porta comum de Front-end (Next.js)
  ],
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
