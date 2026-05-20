import { ownerUserSeed } from './owner-user.seed'
import { organizationSeed } from './organization.seed'

async function runSeeds() {
  console.log('🌱 Initializing seeds...')

  await ownerUserSeed()
  await organizationSeed()

  console.log('🚀 Seeding done!')
  process.exit(0)
}

runSeeds().catch((err) => {
  console.error(err)
  process.exit(1)
})
