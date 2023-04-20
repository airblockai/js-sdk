import {
  Campaign,
  CampaignParser as ICampaignParser,
  ReferrerParameters,
  UTMParameters
} from '../../../types/src/index.js'
import {
  BASE_CAMPAIGN,
  UTM_CAMPAIGN,
  UTM_CONTENT,
  UTM_ID,
  UTM_MEDIUM,
  UTM_SOURCE,
  UTM_TERM
} from '../campaign/constants.js'
import { getQueryParams } from '../campaign/queryParams.js'

export class CampaignParser implements ICampaignParser {
  async parse(): Promise<Campaign> {
    return {
      ...BASE_CAMPAIGN,
      ...this.getUtmParam(),
      ...this.getReferrer()
    } as Campaign
  }

  getUtmParam(): UTMParameters {
    const params = getQueryParams()

    const utmCampaign = params[UTM_CAMPAIGN]
    const utmContent = params[UTM_CONTENT]
    const utmId = params[UTM_ID]
    const utmMedium = params[UTM_MEDIUM]
    const utmSource = params[UTM_SOURCE]
    const utmTerm = params[UTM_TERM]

    return {
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_id: utmId,
      utm_medium: utmMedium,
      utm_source: utmSource,
      utm_term: utmTerm
    }
  }

  getReferrer(): ReferrerParameters {
    const data: ReferrerParameters = {
      referrer: undefined,
      referring_domain: undefined
    }
    try {
      data.referrer = document.referrer || undefined
      data.referring_domain = data.referrer?.split('/')[2] ?? undefined
    } catch {
      // nothing to track
    }
    return data
  }
}
