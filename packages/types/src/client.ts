import { CoreClient } from './client/core'
import { Config } from './config/core'

export interface BrowserClient extends CoreClient {
  init(apiKey: string, serverUrl: string, options?: Config): Promise<void>
}
