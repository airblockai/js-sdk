import { Campaign } from '../../../types/src/index.js'

export const UTM_CAMPAIGN = 'utm_campaign'
export const UTM_CONTENT = 'utm_content'
export const UTM_ID = 'utm_id'
export const UTM_MEDIUM = 'utm_medium'
export const UTM_SOURCE = 'utm_source'
export const UTM_TERM = 'utm_term'

export const EMPTY_VALUE = 'EMPTY'

export const BASE_CAMPAIGN: Campaign = {
  utm_campaign: undefined,
  utm_content: undefined,
  utm_id: undefined,
  utm_medium: undefined,
  utm_source: undefined,
  utm_term: undefined,
  referrer: undefined,
  referring_domain: undefined
}

export const MKTG = 'MKTG'
