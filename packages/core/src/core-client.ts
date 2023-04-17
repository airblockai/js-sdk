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
  setup
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
    // // if (!this.config) {
    //   return new Promise<Result>(resolve => {
    //     this.dispatchQ.push(
    //       this.dispatchWithCallback.bind(this, event, resolve)
    //     )
    //   })
    // } // TBR

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
    // TBR
  }
}
