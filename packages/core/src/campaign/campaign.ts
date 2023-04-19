import {
  Campaign,
  ClickIdParameters,
  CampaignParser as ICampaignParser,
  ReferrerParameters,
  UTMParameters
} from '@airblock-sdk/types'
import {
  BASE_CAMPAIGN,
  DCLID,
  FBCLID,
  GCLID,
  MSCLKID,
  TWCLID,
  UTM_CAMPAIGN,
  UTM_CONTENT,
  UTM_ID,
  UTM_MEDIUM,
  UTM_SOURCE,
  UTM_TERM
} from '@core/campaign/constants.js'
import { getQueryParams } from '@core/campaign/queryParams.js'

export class CampaignParser implements ICampaignParser {
  async parse(): Promise<Campaign> {
    return {
      ...BASE_CAMPAIGN,
      ...this.getUtmParam(),
      ...this.getReferrer(),
      ...this.getClickIds()
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

  getClickIds(): ClickIdParameters {
    const params = getQueryParams()

    return {
      [DCLID]: params[DCLID],
      [FBCLID]: params[FBCLID],
      [GCLID]: params[GCLID],
      [MSCLKID]: params[MSCLKID],
      [TWCLID]: params[TWCLID]
    }
  }
}
