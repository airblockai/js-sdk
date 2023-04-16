// Reviewed

import { AirblockCore } from '@core/core-client.js'
import { Config, Identify as IIdentify } from '@airblock-sdk/types' // TBR
import { createUUID } from '@core/storage/uuid.js'
// import { Identify } from '@core/identify.js'

export const DEFAULT_SESSION_START_EVENT = 'session_start' // TBR
export const DEFAULT_SESSION_END_EVENT = 'session_end' // TBR

export class AirblockBrowser extends AirblockCore {
  previousSessionDeviceId: string | undefined
  previousSessionUserId: string | undefined

  async init(apiKey = '', options?: Config) {
    if (this.initializing) {
      return
    }

    this.initializing = true

    await createUUID(apiKey)

    // Plugins
    // 2 lines at end
  }

  // TBR
  getSessionId() {
    return this.config?.sessionId
  }

  setUUID(uuid: string) {
    if (!this.config) {
      this.q.push(this.setUUID.bind(this, uuid))
      return
    }
    this.config.uuid = uuid
  }

  // TBR
  setSessionId(sessionId: number) {
    if (!this.config) {
      this.q.push(this.setSessionId.bind(this, sessionId))
      return
    }
    const previousSessionId = this.getSessionId()
    const previousLastEventTime = this.config.lastEventTime

    this.config.sessionId = sessionId
    this.config.lastEventTime = undefined

    // if (isSessionTrackingEnabled(this.config.defaultTracking)) {
    //   if (previousSessionId && previousLastEventTime) {
    //     const eventOptions: EventOptions = {
    //       session_id: previousSessionId,
    //       time: previousLastEventTime + 1
    //     }
    //     eventOptions.device_id = this.previousSessionDeviceId
    //     eventOptions.user_id = this.previousSessionUserId
    //     this.track(DEFAULT_SESSION_END_EVENT, undefined, eventOptions)
    //   }

    //   this.track(DEFAULT_SESSION_START_EVENT, undefined, {
    //     session_id: sessionId,
    //     time: sessionId - 1
    //   })
    //   this.previousSessionDeviceId = this.config.deviceId
    //   this.previousSessionUserId = this.config.userId
    // }
  }
}
