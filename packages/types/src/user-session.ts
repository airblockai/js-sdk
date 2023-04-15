export interface UserSession {
  userId?: string
  uuid?: string //deviceId
  sessionId?: number
  lastEventTime?: number
  optOut: boolean
  lastEventId?: number
}
