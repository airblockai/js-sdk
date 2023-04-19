import { Campaign, Options } from '@airblock-sdk/types'
import { domainWithoutSubdomain } from '@core/campaign/domain.js'

export const isNewCampaign = (
  current: Campaign,
  previous: Campaign | undefined,
  options: Options
) => {
  const { referrer, referring_domain, ...currentCampaign } = current
  const {
    referrer: _previous_referrer,
    referring_domain: prevReferringDomain,
    ...previousCampaign
  } = previous || {}

  if (
    current.referring_domain &&
    options.excludeReferrers?.includes(current.referring_domain)
  ) {
    return false
  }

  const hasNewCampaign =
    JSON.stringify(currentCampaign) !== JSON.stringify(previousCampaign)

  const hasNewDomain =
    domainWithoutSubdomain(referring_domain || '') !==
    domainWithoutSubdomain(prevReferringDomain || '')

  return !previous || hasNewCampaign || hasNewDomain
}
