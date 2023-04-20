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
    this.config.sessionTimeout = 10000
    this.config.cookieExpiration = 365

    if (this.initializing) {
      return
    }

    this.initializing = true
    console.log(this.config)

    await createMainCookie(apiKey, this.config.cookieExpiration, false)

    const cookieData = await getMainCookie(apiKey, this.config.cookieExpiration)
    this.config.lastEventTime = cookieData.lastEventTime ?? null

    await super._init(this.config.apiKey, this.config, this, this.config.optOut)

    await setup()
    // await sessionHandlerPlugin().setup(this.config, this)

    console.log('Last', this.config.lastEventTime)

    let isNewSession = !this.config.lastEventTime
    if (
      (this.config.lastEventTime &&
        Date.now() - this.config.lastEventTime > this.config.sessionTimeout) ||
      !this.config.lastEventTime
    ) {
      // Either
      // 1) No previous session; or
      // 2) Previous session expired
      // this.setSessionId(Date.now())

      console.log('If statement ran')

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

      ;(webAttributionVar as any).__pluginEnabledOverride =
        isNewSession || this.config.attribution?.trackNewCampaigns
          ? undefined
          : false
      await webAttributionVar.setup(this.config, this)
    }

    //   // For Amplitude-internal functionality
    //   // if pluginEnabledOverride === undefined then use plugin default logic
    //   // if pluginEnabledOverride === true then track attribution
    //   // if pluginEnabledOverride === false then do not track attribution
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   (webAttribution as any).__pluginEnabledOverride =
    //     isNewSession || this.config.attribution?.trackNewCampaigns ? undefined : false;
    //   await this.add(webAttribution).promise;

    this.initializing = false

    // // Step 6: Run queued dispatch functions
    // await this.runQueuedFunctions('dispatchQ');
  }

  getUUID() {
    return this.config.uuid
  }

  setUUID(uuid: string) {
    if (!this.config) {
      this.q.push(this.setUUID.bind(this, uuid))
      return
    } // TBR

    this.config.uuid = uuid
  }

  // setSessionId(sessionId: number) {
  //   if (!this.config) {
  //     this.q.push(this.setSessionId.bind(this, sessionId))
  //     return
  //   } // TBR

  //   const previousSessionId = this.getSessionId()
  //   const previousLastEventTime = this.config.lastEventTime

  //   this.config.sessionId = sessionId
  //   console.log(previousSessionId)
  //   console.log(this.config.lastEventTime)
  //   this.config.lastEventTime = undefined

  //   if (previousSessionId && previousLastEventTime) {
  //     const eventOptions: EventOptions = {
  //       session_id: previousSessionId,
  //       time: previousLastEventTime + 1
  //     }
  //     eventOptions.uuid = this.previousSessionUUID
  //     this.track(DEFAULT_SESSION_END_EVENT, undefined, eventOptions)
  //   }

  //   this.track(DEFAULT_SESSION_START_EVENT, undefined, {
  //     session_id: sessionId,
  //     time: sessionId - 1
  //   })

  //   this.previousSessionUUID = this.config.uuid
  // }
}
