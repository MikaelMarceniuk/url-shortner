import { Collection, ObjectId } from 'mongodb'
import { mongoClient } from '../db.config'

export type UserRole = 'owner' | 'admin' | 'user'

export interface User {
  _id: ObjectId
  name: string
  email: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  role: UserRole
  banned: boolean
}

export function userCollection(): Collection<User> {
  return mongoClient.getDb().collection<User>('user')
}
