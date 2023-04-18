import { BrowserClient, BrowserConfig, Event } from '@airblock-sdk/types'
import {
  DEFAULT_SESSION_END_EVENT,
  DEFAULT_SESSION_START_EVENT
} from '@core/browser-client.js'

export const sessionHandlerPlugin = () => {
  // browserConfig is defined in setup() which will always be called first
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let browserConfig: BrowserConfig
  // airblock is defined in setup() which will always be called first
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let airblock: BrowserClient

  const setup = async (config: BrowserConfig, client: BrowserClient) => {
    browserConfig = config
    airblock = client
  }

  const execute = async (event: Event) => {
    const now = Date.now()

    if (
      event.event_type === DEFAULT_SESSION_START_EVENT ||
      event.event_type === DEFAULT_SESSION_END_EVENT
    ) {
      browserConfig.lastEventTime = now
      return event
    }

    const lastEventTime = browserConfig.lastEventTime || now
    const timeSinceLastEvent = now - lastEventTime

    if (timeSinceLastEvent > browserConfig.sessionTimeout) {
      // assigns new session
      airblock.setSessionId(now)
      event.session_id = airblock.getSessionId()
      event.time = now
    } // else use existing session

    // updates last event time to extend time-based session
    browserConfig.lastEventTime = now

    return event
  }

  return {
    setup,
    execute
  }
}
