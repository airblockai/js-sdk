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
  location_lat?: number
  location_lng?: number
  platform?: string
  os_name?: string
  os_version?: string
  device_brand?: string
  device_manufacturer?: string
  device_model?: string
  carrier?: string
  country?: string
  region?: string
  city?: string
  language?: string
  ip?: string
  library?: string
  event_id?: number
  extra?: { [key: string]: any }
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
