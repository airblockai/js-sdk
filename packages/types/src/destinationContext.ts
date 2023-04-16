import { Event } from './events'

export interface DestinationContext {
  event: Event
  attempts: number
  timeout: number
}
