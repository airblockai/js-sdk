import {
  BaseEvent,
  EventOptions,
  Event,
  BrowserConfig,
  Config
} from '@airblock-sdk/types'
import { createTrackEvent } from '@core/events/createTrackEvent.js'
import {
  buildResult,
  addToQueue,
  OPT_OUT_MESSAGE,
  setup,
  CLIENT_NOT_INITIALIZED
} from '@core/destination.js'

export class AirblockCore {
  protected initializing = false
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config: Config

  protected q: CallableFunction[] = []

  _init(apiKey: string, optOut?: boolean) {
    this.config = {
      apiKey: apiKey,
      optOut: optOut
    }
  }

  track(
    eventInput: string | BaseEvent,
    eventProperties?: Record<string, any> | undefined,
    eventOptions?: EventOptions | undefined
  ) {
    const event = createTrackEvent(eventInput, eventProperties, eventOptions)
    return this.dispatch(event)
  }

  // identify(identify: Identify, eventOptions?: EventOptions) {
  //   const event = createIdentifyEvent(identify, eventOptions)
  //   return this.dispatch(event)
  // }

  async dispatch(event: Event) {
    if (!this.config) {
      buildResult(event, 0, CLIENT_NOT_INITIALIZED)
    }

    this.process(event)
  }

  async process(event: Event) {
    try {
      if (this.config.optOut) {
        return buildResult(event, 0, OPT_OUT_MESSAGE)
      }

      await addToQueue(event)
    } catch (e) {
      const message = String(e)

      const result = buildResult(event, 0, message)

      return result
    }
  }

  // identify(
  //   identify: Identify,
  //   eventOptions?: EventOptions | undefined
  // ): AirblockReturn<Result> {

  // }

  setOptOut(optOut: boolean): void {
    if (!this.config) {
      this.q.push(this.setOptOut.bind(this, Boolean(optOut)))
      return
    } // TBR

    this.config.optOut = Boolean(optOut)
  }
}
