import { Elysia } from 'elysia'

import { betterAuthMiddleware } from '../middleware/better-auth.middleware'

export const router = new Elysia().use(betterAuthMiddleware)
