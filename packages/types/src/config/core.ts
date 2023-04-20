// Reviewed

import { FingerprintOptions } from './browser'

export interface Config {
  apiKey: string
  optOut?: boolean
}

export interface AttributionOptions {
  disabled?: boolean
  excludeReferrers?: string[]
  initialEmptyValue?: string
  resetSessionOnNewCampaign?: boolean
  trackNewCampaigns?: boolean
  trackPageViews?: boolean
}

export interface BrowserConfig extends Config {
  attribution?: AttributionOptions
  cookieExpiration: number
  uuid?: string
  domain: string
  sessionTimeout: number
  lastEventTime?: number
  fingerprintOptions: FingerprintOptions
}
