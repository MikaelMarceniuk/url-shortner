import { t } from 'elysia'
import { organizationCollection } from '../../../configs/db/collections/organization.collection'
import { router } from '../router'

// TODO Add AuthMiddleware
export const getOrganizationByDomain = router.get(
  '/organization/domain/:domain',
  async ({ params }): Promise<string | null> => {
    const organization = await organizationCollection().findOne({
      host: { $eq: params.domain },
    })

    return organization ? organization._id.toString() : null
  },
  {
    params: t.Object({
      domain: t.String({ format: 'hostname' }),
    }),
  },
)
