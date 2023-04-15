import {
  BaseEvent,
  Config,
  EventOptions,
  Result,
  Event,
  Identify,
  BrowserOptions,
  BrowserConfig
} from '@airblock-sdk/types'
import { Timeline } from '@core/timeline.js'
import { createTrackEvent } from '@core/events/createTrackEvent.js'
import { buildResult } from '@core/destination.js'

export class AirblockCore {
  protected initializing = false
  protected name: string
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config: BrowserConfig

  protected q: CallableFunction[] = []
  protected dispatchQ: CallableFunction[] = []

  timeline: Timeline

  constructor(name = '$default') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.timeline = new Timeline()
    this.name = name
  }

  track(
    eventInput: string | BaseEvent,
    eventProperties?: Record<string, any> | undefined,
    eventOptions?: EventOptions | undefined
  ) {
    const event = createTrackEvent(eventInput, eventProperties, eventOptions)
    return this.dispatch(event)
  }

  identify(identify: Identify, eventOptions?: EventOptions) {
    //
  }

  dispatchWithCallback(event: Event, callback: (result: Result) => void): void {
    // if (!this.config) {
    //   return callback(buildResult(event, 0, CLIENT_NOT_INITIALIZED))
    // }
    void this.process(event).then(callback)
  }

  async dispatch(event: Event): Promise<Result> {
    // // if (!this.config) {
    //   return new Promise<Result>(resolve => {
    //     this.dispatchQ.push(
    //       this.dispatchWithCallback.bind(this, event, resolve)
    //     )
    //   })
    // }

    return this.process(event)
  }

  async process(event: Event): Promise<Result> {
    try {
      // if (this.config.optOut) {
      //   return buildResult(event, 0, OPT_OUT_MESSAGE)
      // }

      const result = await this.timeline.push(event)

      // result.code === 200
      //   ? this.config.loggerProvider.log(result.message)
      //   : this.config.loggerProvider.error(result.message)

      return result
    } catch (e) {
      const message = String(e)
      // this.config.loggerProvider.error(message)
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
    //
  }

  flush() {
    return this.timeline.flush()
  }
}
