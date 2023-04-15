import { CoreClient } from './client/core'
import { BrowserOptions } from './config/browser'

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
  init(apiKey: string, userId?: string, options?: BrowserOptions): Promise<void>
}
