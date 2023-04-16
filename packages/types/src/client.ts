import { CoreClient } from './client/core'
import { Config } from './config/core'

interface Client extends CoreClient {
  getUserId(): string | undefined
  setUserId(userId: string | undefined): void
  getDeviceId(): string | undefined
  setDeviceId(deviceId: string): void
  getSessionId(): number | undefined
  setSessionId(sessionId: number): void
  reset(): void
}

export interface BrowserClient extends Client {
  init(apiKey: string, userId?: string, options?: Config): Promise<void>
}
