import {
  Identify as IIdentify,
  EventOptions,
  IdentifyEvent,
  SpecialEventType
} from '@airblock-sdk/types'

export const createIdentifyEvent = (
  identify: IIdentify,
  eventOptions?: EventOptions
): IdentifyEvent => {
  const identifyEvent: IdentifyEvent = {
    ...eventOptions,
    event_type: SpecialEventType.IDENTIFY,
    user_properties: identify.getUserProperties()
  }

  return identifyEvent
}
