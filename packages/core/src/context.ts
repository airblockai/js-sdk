import { BrowserConfig, Event } from '../../types/src/index.js'
import { VERSION } from './version.js'

export const getLanguage = (): string => {
  if (typeof navigator === 'undefined') return ''
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const userLanguage = (navigator as any).userLanguage as string | undefined

  return navigator.languages?.[0] ?? navigator.language ?? userLanguage ?? ''
}

export class Context {
  // this.config is defined in setup() which will always be called first
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config: BrowserConfig
  eventId = 0

  constructor() {
    let agent: string | undefined
    /* istanbul ignore else */
    if (typeof navigator !== 'undefined') {
      agent = navigator.userAgent
    }
  }

  async execute(context: Event, config: BrowserConfig) {
    const time = new Date().getTime()

    const event = {
      uuid: config.uuid,
      event_time: time,
      ...context
    }
    return event
  }
}
