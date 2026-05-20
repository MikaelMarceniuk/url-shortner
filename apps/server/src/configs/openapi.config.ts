import openapi from '@elysia/openapi'
import { OpenAPI } from '../http/middleware/better-auth.middleware'

export const openapiConfig = openapi({
  documentation: {
    components: await OpenAPI.components,
    paths: await OpenAPI.getPaths(),
  },
})
