import {
  BaseEvent,
  EventOptions,
  Event,
  BrowserConfig,
  Config,
  BrowserClient
} from '../../types/src/index.js'
import { createTrackEvent } from './events/createTrackEvent.js'
import {
  buildResult,
  addToQueue,
  OPT_OUT_MESSAGE,
  CLIENT_NOT_INITIALIZED
} from './destination.js'
import { createMainCookie } from './storage/uuid.js'
import { Context } from './context.js'

export class AirblockCore {
  protected initializing = false
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  coreConfig: Config

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  context: Context

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  coreBrowserConfig: BrowserConfig

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  coreBrowserClient: BrowserClient

  protected q: CallableFunction[] = []

  _init(
    apiKey: string,
    config: BrowserConfig,
    client: BrowserClient,
    optOut?: boolean
  ) {
    this.coreConfig = {
      apiKey: apiKey,
      optOut: optOut
    }

    this.coreBrowserConfig = config
    this.coreBrowserClient = client

    this.context = new Context()
  }

  track(
    eventInput: string | BaseEvent,
    eventProperties?: Record<string, any> | undefined,
    userProperties?: Record<string, any> | undefined,
    eventOptions?: EventOptions | undefined
  ) {
    const event = createTrackEvent(
      eventInput,
      eventProperties,
      userProperties,
      eventOptions
    )
    return this.dispatch(event)
  }

  async dispatch(event: Event) {
    if (!this.coreConfig) {
      buildResult(event, 0, CLIENT_NOT_INITIALIZED)
    }

    this.process(event)
  }

  async process(event: Event) {
    try {
      if (this.coreConfig.optOut) {
        return buildResult(event, 0, OPT_OUT_MESSAGE)
      }

      await createMainCookie(
        this.coreBrowserConfig.apiKey,
        this.coreBrowserConfig.cookieExpiration,
        true
      )

      const e = await this.context.execute(event, this.coreBrowserConfig)
      event = e

      await addToQueue(event)
    } catch (e) {
      const message = String(e)

      const result = buildResult(event, 0, message)

      return result
    }
  }

  setOptOut(optOut: boolean): void {
    if (!this.coreConfig) {
      this.q.push(this.setOptOut.bind(this, Boolean(optOut)))
      return
    }

    this.coreConfig.optOut = Boolean(optOut)
  }
}
