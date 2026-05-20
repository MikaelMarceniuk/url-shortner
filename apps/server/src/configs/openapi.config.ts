import openapi from '@elysia/openapi'
import { OpenAPI } from '../http/handlers/better-auth.handler'

export const openapiConfig = openapi({
  documentation: {
    components: await OpenAPI.components,
    paths: await OpenAPI.getPaths(),
  },
})
