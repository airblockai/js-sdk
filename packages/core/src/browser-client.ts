import { AirblockCore } from '@core/core-client.js'
import {
  AirblockReturn,
  BrowserClient,
  BrowserConfig,
  Config,
  EventOptions,
  Identify as IIdentify
} from '@airblock-sdk/types' // TBR
import { createUUID } from '@core/storage/uuid.js'
import { setup } from '@core/destination.js'
import { sessionHandlerPlugin } from '@core/sessionHandler.js'
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
    console.log('Init Started')
    this.config.apiKey = apiKey
    this.config.optOut = options?.optOut !== null ? false : options?.optOut
    this.config.sessionTimeout = 30 * 60 * 1000
    this.config.cookieExpiration = 365

    if (this.initializing) {
      return
    }

    this.initializing = true

    await createUUID(apiKey, this.config.cookieExpiration)

    super._init(this.config.apiKey, this.config.optOut)

    await setup()
    await sessionHandlerPlugin().setup(this.config, this)

    let isNewSession = !this.config.lastEventTime
    if (
      !this.config.sessionId ||
      (this.config.lastEventTime &&
        Date.now() - this.config.lastEventTime > this.config.sessionTimeout)
    ) {
      // Either
      // 1) No previous session; or
      // 2) Previous session expired
      this.setSessionId(Date.now())
      isNewSession = true
    }

    console.log(isNewSession, this.config.sessionId)

    // Step 4: Install plugins
    // Do not track any events before this
    // await this.add(new Context()).promise;
    // await this.add(sessionHandlerPlugin()).promise;
    // await this.add(new IdentityEventSender()).promise;

    // Add web attribution plugin
    // if (!this.config.attribution?.disabled) {
    //   const webAttribution = webAttributionPlugin({
    //     excludeReferrers: this.config.attribution?.excludeReferrers,
    //     initialEmptyValue: this.config.attribution?.initialEmptyValue,
    //     resetSessionOnNewCampaign: this.config.attribution?.resetSessionOnNewCampaign,
    //   });

    //   // For Amplitude-internal functionality
    //   // if pluginEnabledOverride === undefined then use plugin default logic
    //   // if pluginEnabledOverride === true then track attribution
    //   // if pluginEnabledOverride === false then do not track attribution
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //   (webAttribution as any).__pluginEnabledOverride =
    //     isNewSession || this.config.attribution?.trackNewCampaigns ? undefined : false;
    //   await this.add(webAttribution).promise;

    this.initializing = false

    console.log('Init ended')

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

  getSessionId() {
    return this.config?.sessionId
  }

  setSessionId(sessionId: number) {
    if (!this.config) {
      this.q.push(this.setSessionId.bind(this, sessionId))
      return
    } // TBR

    const previousSessionId = this.getSessionId()
    const previousLastEventTime = this.config.lastEventTime

    this.config.sessionId = sessionId
    this.config.lastEventTime = undefined

    if (previousSessionId && previousLastEventTime) {
      const eventOptions: EventOptions = {
        session_id: previousSessionId,
        time: previousLastEventTime + 1
      }
      eventOptions.uuid = this.previousSessionUUID
      this.track(DEFAULT_SESSION_END_EVENT, undefined, eventOptions)
    }

    this.track(DEFAULT_SESSION_START_EVENT, undefined, {
      session_id: sessionId,
      time: sessionId - 1
    })
    this.previousSessionUUID = this.config.uuid
  }
}
