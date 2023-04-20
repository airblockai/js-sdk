import { AirblockCore } from '@core/core-client.js'
import {
  AirblockReturn,
  BrowserClient,
  BrowserConfig,
  Config,
  EventOptions,
  Identify as IIdentify
} from '@airblock-sdk/types' // TBR
import { createMainCookie, getMainCookie } from '@core/storage/uuid.js'
import { setup } from '@core/destination.js'
// import { sessionHandlerPlugin } from '@core/sessionHandler.js'
import { webAttribution } from '@core/webAttribution.js'
// import { Identify } from '@core/identify.js'

export const DEFAULT_SESSION_START_EVENT = 'session_start' // TBR
export const DEFAULT_SESSION_END_EVENT = 'session_end' // TBR

export const returnWrapper: {
  (): AirblockReturn<void>
  <T>(awaitable: Promise<T>): AirblockReturn<T>
} = <T>(awaitable?: Promise<T>) => ({
  promise: awaitable || Promise.resolve()
})

export class AirblockBrowser extends AirblockCore implements BrowserClient {
  previousSessionUUID: string | undefined

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config: BrowserConfig = {}

  async init(apiKey: string, options?: Config) {
    this.config.apiKey = apiKey
    this.config.optOut = options?.optOut !== null ? false : options?.optOut
    // this.config.sessionTimeout = 30 * 60 * 1000
    this.config.sessionTimeout = 10000 // TBR - Only for testing purposes. Use above line
    this.config.cookieExpiration = 365

    if (this.initializing) {
      return
    }

    this.initializing = true

    await createMainCookie(apiKey, this.config.cookieExpiration, false)

    const cookieData = await getMainCookie(apiKey, this.config.cookieExpiration)
    this.config.lastEventTime = cookieData.lastEventTime ?? null

    await super._init(this.config.apiKey, this.config, this, this.config.optOut)

    await setup()

    let isNewSession = !this.config.lastEventTime
    if (
      (this.config.lastEventTime &&
        Date.now() - this.config.lastEventTime > this.config.sessionTimeout) ||
      !this.config.lastEventTime
    ) {
      // Either
      // 1) No previous session; or
      // 2) Previous session expired

      this.track(DEFAULT_SESSION_START_EVENT, undefined, {
        time: Date.now()
      })

      isNewSession = true
    }

    // Step 4: Set Up
    // Do not track any events before this
    // await this.add(new Context()).promise;
    // await this.add(sessionHandlerPlugin()).promise;
    // await this.add(new IdentityEventSender()).promise;

    // Add web attribution
    if (!this.config.attribution?.disabled) {
      const webAttributionVar = webAttribution({
        excludeReferrers: this.config.attribution?.excludeReferrers,
        initialEmptyValue: this.config.attribution?.initialEmptyValue,
        resetSessionOnNewCampaign:
          this.config.attribution?.resetSessionOnNewCampaign
      })

      // For Airblock-internal functionality
      // if pluginEnabledOverride === undefined then use plugin default logic
      // if pluginEnabledOverride === true then track attribution
      // if pluginEnabledOverride === false then do not track attribution
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ;(webAttributionVar as any).__pluginEnabledOverride =
        isNewSession || this.config.attribution?.trackNewCampaigns
          ? undefined
          : false
      await webAttributionVar.setup(this.config, this)
    }

    this.initializing = false
  }

  // getUUID() {
  //   return this.config.uuid
  // } // TBR

  // setUUID(uuid: string) {
  //   if (!this.config) {
  //     this.q.push(this.setUUID.bind(this, uuid))
  //     return
  //   } // TBR

  //   this.config.uuid = uuid
  // } //
}
