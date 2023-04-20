import {
  BrowserClient,
  BrowserConfig,
  CreateWebAttributionParameters,
  Options,
  UserSession,
  Storage,
  Campaign
} from '@airblock-sdk/types'
import { getStorageKey } from '@core/utils/getStorageKey.js'
import { CookieStorage } from '@core/storage/Cookie.js'
import { CampaignParser } from '@core/campaign/campaign.js'
import { isNewCampaign } from '@core/campaign/isNewCampaign.js'
import { createCampaignEvent } from '@core/campaign/createCampaignEvent.js'

export const webAttribution = function (
  ...args: CreateWebAttributionParameters
) {
  let airblock: BrowserClient | undefined
  let options: Options = {}

  const [clientOrOptions, configOrUndefined] = args
  if (clientOrOptions && 'init' in clientOrOptions) {
    airblock = clientOrOptions
    if (configOrUndefined) {
      options = configOrUndefined
    }
  } else if (clientOrOptions) {
    options = clientOrOptions
  }

  const excludeReferrers = options.excludeReferrers ?? []
  if (typeof location !== 'undefined') {
    excludeReferrers.unshift(location.hostname)
  }

  options = {
    disabled: false,
    initialEmptyValue: 'EMPTY',
    ...options,
    excludeReferrers
  }

  const main = {
    setup: async function (config: BrowserConfig, client?: BrowserClient) {
      airblock = airblock ?? client
      if (!airblock) {
        const receivedType = clientOrOptions ? 'Options' : 'undefined'
        console.error(
          `Argument of type '${receivedType}' is not assignable to parameter of type 'BrowserClient'.`
        )
        return
      }

      if (options.disabled) {
        console.log(
          '@airblock/web-attribution is disabled. Attribution is not tracked.'
        )
        return
      }

      const cookieStorage = new CookieStorage<UserSession>()

      // Share cookie storage with user session storage
      const storage = cookieStorage as unknown as Storage<Campaign>
      const storageKey = getStorageKey(config.apiKey, 'MKTG')

      const [currentCampaign, previousCampaign] = await Promise.all([
        new CampaignParser().parse(),
        storage.get(storageKey)
      ])

      if (isNewCampaign(currentCampaign, previousCampaign, options)) {
        console.log('Tracking attribution.')

        const campaignEvent = createCampaignEvent(currentCampaign, options)
        airblock.track(campaignEvent)
        void storage.set(storageKey, currentCampaign)
      }
    },

    execute: async (event: Event) => event
  }

  return main
}
