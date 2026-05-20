import { auth } from '../../auth.config'
import { userCollection } from '../collections/user.collection'

const ownerUser = {
  email: 'mikael.marceniuk@codeui.com',
  password: '12345678',
  name: 'Mikael Marceniuk',
}

export async function ownerUserSeed() {
  console.log(`🛠️ Seeding owner user`)

  try {
    const doesUserExist = await userCollection().findOne({
      email: { $eq: ownerUser.email },
    })

    if (doesUserExist) {
      console.log(`⏭️ Owner user already exists...`)
      return
    }

    await auth.api.createUser({
      body: { ...ownerUser },
    })

    console.log(`✅ Owner user created.`)
  } catch (error) {
    console.error(`❌ Error in creating owner user:`, error)
  }
}
