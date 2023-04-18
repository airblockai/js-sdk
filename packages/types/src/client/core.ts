import { BaseEvent, EventOptions, Identify } from '../events'

export interface CoreClient {
  track(
    eventInput: BaseEvent | string,
    eventProperties?: Record<string, any>,
    eventOptions?: EventOptions
  ): Promise<void>
  // identify(
  //   identify: Identify,
  //   eventOptions?: EventOptions
  // ): AirblockReturn<Result> // TBR
  setOptOut(optOut: boolean): void
  /**
   * Flush all unsent events.
   *
   *```typescript
   * flush();
   * ```
   */
  // flush(): void // TBR
}
