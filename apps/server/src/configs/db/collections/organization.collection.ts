import { Collection, ObjectId } from 'mongodb'
import { mongoClient } from '../db.config'

export interface LinkDomain {
  _id: ObjectId
  host: string
  verified: boolean
  verification_token: string
  ssl_enabled: boolean
  created_at: Date
}

export interface OrganizationSettings {
  default_redirect_type: '301' | '302'
  default_utm: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
  }
  branding: {
    logo_url?: string
    primary_color?: string
    favicon_url?: string
  }
}

export interface Organization {
  _id: ObjectId
  name: string
  slug: string

  domain: string // Domínio que cliente acessa
  // link_domains: LinkDomain[] // Domínios que cliente gera links

  // settings: OrganizationSettings
  // plan: 'free' | 'pro' | 'enterprise'
  created_at: Date
  // updated_at: Date
}

export function organizationCollection(): Collection<Organization> {
  return mongoClient.getDb().collection<Organization>('organization')
}
