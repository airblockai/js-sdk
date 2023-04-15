import { EventCallback, Event } from './events'

export interface DestinationContext {
  event: Event
  attempts: number
  callback: EventCallback
  timeout: number
}
