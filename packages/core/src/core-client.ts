import {
  BaseEvent,
  EventOptions,
  Result,
  Event,
  Identify,
  BrowserConfig
} from '@airblock-sdk/types'
import { Timeline } from '@core/timeline.js'
import { createTrackEvent } from '@core/events/createTrackEvent.js'
import { buildResult } from '@core/destination.js'
import { createIdentifyEvent } from '@core/events/createIdentifyEvent.js'

export class AirblockCore {
  protected initializing = false
  protected name: string
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config: BrowserConfig

  protected q: CallableFunction[] = []
  protected dispatchQ: CallableFunction[] = [] // TBR

  timeline: Timeline // TBR (Has to be removed)

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

  // identify(identify: Identify, eventOptions?: EventOptions) {
  //   const event = createIdentifyEvent(identify, eventOptions)
  //   return this.dispatch(event)
  // }

  dispatchWithCallback(event: Event, callback: (result: Result) => void): void {
    // if (!this.config) {
    //   return callback(buildResult(event, 0, CLIENT_NOT_INITIALIZED))
    // } // TBR
    void this.process(event).then(callback)
  }

  async dispatch(event: Event): Promise<Result> {
    // // if (!this.config) {
    //   return new Promise<Result>(resolve => {
    //     this.dispatchQ.push(
    //       this.dispatchWithCallback.bind(this, event, resolve)
    //     )
    //   })
    // } // TBR

    return this.process(event)
  }

  async process(event: Event): Promise<Result> {
    try {
      // if (this.config.optOut) {
      //   return buildResult(event, 0, OPT_OUT_MESSAGE)
      // } //TBR

      const result = await this.timeline.push(event)

      return result
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

  flush() {
    return this.timeline.flush()
  }
}
