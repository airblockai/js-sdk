import { BaseEvent, EventOptions, TrackEvent } from '@airblock-sdk/types'

export const createTrackEvent = (
  eventInput: BaseEvent | string,
  eventProperties?: Record<string, any>,
  eventOptions?: EventOptions
): TrackEvent => {
  const baseEvent: BaseEvent =
    typeof eventInput === 'string' ? { event_type: eventInput } : eventInput

  return {
    ...baseEvent,
    ...eventOptions,
    ...(eventProperties && { event_properties: eventProperties })
  }
}
