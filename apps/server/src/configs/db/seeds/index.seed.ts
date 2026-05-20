import { ownerUserSeed } from './owner-user.seed'

async function runSeeds() {
  console.log('🌱 Initializing seeds...')

  await ownerUserSeed()

  console.log('🚀 Seeding done!')
  process.exit(0)
}

runSeeds().catch((err) => {
  console.error(err)
  process.exit(1)
})
