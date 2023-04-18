import { CoreClient } from './client/core'
import { Config } from './config/core'

interface Client extends CoreClient {
  getUUID(): string | undefined
  // setUUID(deviceId: string): void // TBR
  getSessionId(): number | undefined
  setSessionId(sessionId: number): void
  // reset(): void // TBR
}

export interface BrowserClient extends Client {
  init(apiKey: string, options?: Config): Promise<void>
}
