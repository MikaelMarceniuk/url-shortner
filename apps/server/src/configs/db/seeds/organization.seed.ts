import { auth } from '../../auth.config'
import { userCollection } from '../collections/user.collection'

const organizations = [
  {
    name: 'CodeUI',
    slug: 'codeui',
    instance_host: 'codeui.com.br',
    // logo: 'https://example.com/logo.png', // TODO Create an s3
  },
  {
    name: 'Higher Up English',
    slug: 'higher-up-english',
    instance_host: 'higher-up.com.br',
    // logo: 'https://example.com/logo.png', // TODO Create an s3
  },
] as const

export async function organizationSeed() {
  console.log(`🛠️ Seeding organization`)

  const ownerUser = await userCollection().findOne({
    role: { $eq: 'owner' },
  })

  if (!ownerUser) {
    console.log(`⏭️ Owner user not found. Skipping organizations...`)
    return
  }

  for (const org of organizations) {
    try {
      const { id } = await auth.api.createOrganization({
        body: { ...org, userId: ownerUser._id.toString() },
      })

      console.log(`✅ Organization "${org.name}" created.`)
    } catch (error) {
      console.error(`❌ Error in creating organization "${org.name}":`, error)
    }
  }
}
