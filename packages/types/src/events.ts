export interface BaseEvent extends EventOptions {
  event_type: string
  event_properties?: { [key: string]: any } | undefined
  user_properties?: { [key: string]: any } | undefined
  group_properties?: { [key: string]: any } | undefined
  groups?: { [key: string]: any } | undefined
}

export interface EventOptions {
  uuid?: string
  event_time?: number
  sdk_ver?: string
}

export type ValidPropertyType =
  | number
  | string
  | boolean
  | Array<string | number>
  | { [key: string]: ValidPropertyType }

/**
 * Strings that have special meaning when used as an event's type
 * and have different specifications.
 */
export enum SpecialEventType {}

export interface TrackEvent extends BaseEvent {
  event_type: Exclude<string, SpecialEventType>
}

export type Event = TrackEvent
