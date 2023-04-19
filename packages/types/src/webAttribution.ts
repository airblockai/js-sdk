import { BrowserClient } from './client'

export interface Options {
  disabled?: boolean
  excludeReferrers?: string[]
  initialEmptyValue?: string
  resetSessionOnNewCampaign?: boolean
}

export interface CreateWebAttribution {
  (client: BrowserClient, options?: Options): any
  (options?: Options): any
}

export type CreateWebAttributionParameters =
  | [BrowserClient, Options?]
  | [Options?]
