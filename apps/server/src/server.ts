import { Elysia } from 'elysia'

import { env } from './configs/env.config'
import { mongoClient } from './configs/db/db.config'
import { openapiConfig } from './configs/openapi.config'
import { corsConfig } from './configs/cors.config'

import { betterAuthMiddleware } from './http/middleware/better-auth.middleware'
import { getOrganizationByDomain } from './http/resources/organization/get-organization-by-domain.route'

export class Server {
  public app!: Awaited<ReturnType<Server['createApp']>>

  private readonly port: number = env.PORT
  private readonly apiPrefix: string = '/api'

  async initialize() {
    await mongoClient.testConnection()
    this.app = await this.createApp()
    this.loadRoutes()
  }

  listen() {
    this.app.listen(this.port)
    console.log(
      `🦊 Elysia is running at ${this.app.server?.hostname}:${this.app.server?.port}`,
    )
  }

  async start() {
    await this.initialize()
    this.listen()
  }

  private async createApp() {
    return new Elysia({ prefix: this.apiPrefix })
      .use(openapiConfig)
      .use(betterAuthMiddleware)
      .use(corsConfig)
  }

  private loadRoutes() {
    this.app.use(getOrganizationByDomain)
  }
}
