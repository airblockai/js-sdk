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
  uuid?: string
  domain: string
  lastEventTime?: number
  fingerprintOptions: FingerprintOptions // TBR
}

// export interface Options extends Partial<Config> {
//   apiKey: string
// } // Use Config Instead(TBR)
