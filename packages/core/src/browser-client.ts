// Reviewed

import { AirblockCore } from '@core/core-client.js'
import {
  BrowserConfig,
  Config,
  Identify as IIdentify
} from '@airblock-sdk/types' // TBR
import { createUUID } from '@core/storage/uuid.js'
import { setup } from '@core/destination.js'
// import { Identify } from '@core/identify.js'

export const DEFAULT_SESSION_START_EVENT = 'session_start' // TBR
export const DEFAULT_SESSION_END_EVENT = 'session_end' // TBR

export class AirblockBrowser extends AirblockCore {
  previousSessionDeviceId: string | undefined
  previousSessionUserId: string | undefined

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config: BrowserConfig = {}

  async init(apiKey: string, options?: Config) {
    console.log(apiKey)
    this.config.apiKey = apiKey
    this.config.optOut = options?.optOut !== null ? false : options?.optOut

    if (this.initializing) {
      return
    }

    this.initializing = true

    await createUUID(apiKey)

    super._init(this.config.apiKey, this.config.optOut)

    await setup()

    // Plugins
    // 2 lines at end
  }

  setUUID(uuid: string) {
    if (!this.config) {
      this.q.push(this.setUUID.bind(this, uuid))
      return
    }
    this.config.uuid = uuid
  }
}
