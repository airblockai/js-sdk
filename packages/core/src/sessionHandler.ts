// import { BrowserClient, BrowserConfig, Event } from '@airblock-sdk/types'
// import {
//   DEFAULT_SESSION_END_EVENT,
//   DEFAULT_SESSION_START_EVENT
// } from '@core/browser-client.js'

// export const sessionHandlerPlugin = () => {
//   // browserConfig is defined in setup() which will always be called first
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   // airblock is defined in setup() which will always be called first
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore

//   const setup = async (config: BrowserConfig, client: BrowserClient) => {
//     // browserConfig = config
//     // airblock = client
//   }

//   const execute = async (
//     event: Event,
//     config: BrowserConfig,
//     airblock: BrowserClient
//   ) => {
//     const now = Date.now()

//     if (
//       event.event_type === DEFAULT_SESSION_START_EVENT ||
//       event.event_type === DEFAULT_SESSION_END_EVENT
//     ) {
//       config.lastEventTime = now
//       return event
//     }

//     const lastEventTime = config.lastEventTime || now
//     const timeSinceLastEvent = now - lastEventTime

//     if (timeSinceLastEvent > config.sessionTimeout) {
//       // assigns new session
//       airblock.setSessionId(now)
//       event.session_id = airblock.getSessionId()
//       event.time = now
//     } // else use existing session

//     // updates last event time to extend time-based session
//     config.lastEventTime = now

//     return event
//   }

//   return {
//     setup,
//     execute
//   }
// }
