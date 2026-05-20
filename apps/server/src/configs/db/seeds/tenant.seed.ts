import { auth } from '../../auth.config'
import { userCollection } from '../collections/user.collection'

const tenants = [
  {
    name: 'CodeUI',
    slug: 'codeui',
    // logo: 'https://example.com/logo.png', // TODO Create an s3
    // metadata,
  },
  {
    name: 'Higher Up English',
    slug: 'higher-up-english',
    // logo: 'https://example.com/logo.png', // TODO Create an s3
    // metadata,
  },
]

export async function tenantSeed() {
  console.log(`🛠️ Seeding tenants`)

  const ownerUser = await userCollection().findOne({
    role: { $eq: 'owner' },
  })

  if (!ownerUser) {
    console.log(`⏭️ Owner user not found. Skipping tenants...`)
    return
  }

  for (const tenant of tenants) {
    try {
      await auth.api.createOrganization({
        body: { ...tenant, userId: ownerUser._id.toString() },
      })

      console.log(`✅ Tenant "${tenant.name}" created.`)
    } catch (error) {
      console.error(`❌ Error in creating tenant "${tenant.name}":`, error)
    }
  }
}
