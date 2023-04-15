import { BaseEvent, EventOptions, Identify } from '../events'
import { AirblockReturn } from '../promise'
import { Result } from '../result'

export interface CoreClient {
  track(
    eventInput: BaseEvent | string,
    eventProperties?: Record<string, any>,
    eventOptions?: EventOptions
  ): AirblockReturn<Result>
  identify(
    identify: Identify,
    eventOptions?: EventOptions
  ): AirblockReturn<Result>
  setOptOut(optOut: boolean): void
  /**
   * Flush all unsent events.
   *
   *```typescript
   * flush();
   * ```
   */
  flush(): void
}
