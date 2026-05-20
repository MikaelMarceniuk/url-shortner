import { ownerUserSeed } from './owner-user.seed'
import { tenantSeed } from './tenant.seed'

async function runSeeds() {
  console.log('🌱 Initializing seeds...')

  await ownerUserSeed()
  await tenantSeed()

  console.log('🚀 Seeding done!')
  process.exit(0)
}

runSeeds().catch((err) => {
  console.error(err)
  process.exit(1)
})
