import { BaseEvent, EventOptions } from '../events'

export interface CoreClient {
  track(
    eventInput: BaseEvent | string,
    eventProperties?: Record<string, any>,
    userProperties?: Record<string, any>,
    eventOptions?: EventOptions
  ): Promise<void>
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
