import {
  Result,
  DestinationContext as Context,
  Event,
  SuccessResponse,
  InvalidResponse,
  Status
} from '@airblock-sdk/types'
import { chunk } from '@core/utils/chunk.js'
import { LocalStorage } from '@core/storage/Local.js'

export const AIRBLOCK_PREFIX = 'AB'
export const STORAGE_PREFIX = `${AIRBLOCK_PREFIX}_unsent`

export const SUCCESS_MESSAGE = 'Event tracked successfully'
export const UNEXPECTED_ERROR_MESSAGE = 'Unexpected error occurred'
export const MAX_RETRIES_EXCEEDED_MESSAGE =
  'Event rejected due to exceeded retry count'
export const OPT_OUT_MESSAGE = 'Event skipped due to optOut config'
export const MISSING_API_KEY_MESSAGE = 'Event rejected due to missing API key'
export const INVALID_API_KEY = 'Invalid API key'
export const CLIENT_NOT_INITIALIZED = 'Client not initialized'

export const buildResult = (
  event: Event,
  code = 0,
  message: string = Status.Unknown
): Result => {
  return { event, code, message }
}

export class Destination {
  name = 'airblock'

  retryTimeout = 1000
  throttleTimeout = 30000
  storageKey = `${STORAGE_PREFIX}_storage`

  private scheduled: ReturnType<typeof setTimeout> | null = null
  queue: Context[] = []

  constructor() {
    this.setup()
  }

  async setup() {
    const localStorage = new LocalStorage()

    const unsent = await localStorage.get(this.storageKey)

    this.saveEvents() // sets storage to '[]'
    if (unsent && unsent.length > 0) {
      void Promise.all(unsent.map((event: any) => this.execute(event))).catch()
    }
  }

  execute(event: Event): Promise<Result> {
    return new Promise(resolve => {
      const context = {
        event,
        attempts: 0,
        callback: (result: Result) => resolve(result),
        timeout: 0
      }

      void this.addToQueue(context)
    })
  }

  addToQueue(...list: Context[]) {
    const tryable = list.filter(context => {
      if (context.attempts < 5) {
        context.attempts += 1
        return true
      }
      void this.fulfillRequest([context], 500, MAX_RETRIES_EXCEEDED_MESSAGE)
      return false
    })

    tryable.forEach(context => {
      this.queue = this.queue.concat(context)
      if (context.timeout === 0) {
        this.schedule(5000)
        return
      }

      setTimeout(() => {
        context.timeout = 0
        this.schedule(5000)
      }, context.timeout)
    })

    this.saveEvents()
  }

  schedule(timeout: number) {
    if (this.scheduled) return
    this.scheduled = setTimeout(() => {
      void this.flush(true).then(() => {
        if (this.queue.length > 0) {
          this.schedule(timeout)
        }
      })
    }, timeout)
  }

  async flush(useRetry = false) {
    console.log('Flushed')
    const list: Context[] = []
    const later: Context[] = []
    this.queue.forEach(context =>
      context.timeout === 0 ? list.push(context) : later.push(context)
    )
    this.queue = later

    if (this.scheduled) {
      clearTimeout(this.scheduled)
      this.scheduled = null
    }

    const batches = chunk(list, 30)
    console.log('Batches: ', batches)
    await Promise.all(batches.map((batch: any) => this.send(batch, useRetry)))
  }

  async send(list: Context[], useRetry = true) {
    // if (!this.config.apiKey) {
    //   return this.fulfillRequest(list, 400, MISSING_API_KEY_MESSAGE)
    // }
    console.log(list)

    const payload = {
      api_key: 'apiKey', //this.apiKey
      events: list, // they mapped
      options: {
        min_id_length: 5
      }
    }

    console.log(payload)
    this.saveEvents()

    // try {
    // const { serverUrl } = createServerConfig(
    //   this.config.serverUrl,
    //   this.config.serverZone,
    //   this.config.useBatch
    // )
    // const res = await this.config.transportProvider.send(serverUrl, payload)
    // if (res === null) {
    //   this.fulfillRequest(list, 0, UNEXPECTED_ERROR_MESSAGE)
    //   return
    // }
    // if (!useRetry) {
    //   if ('body' in res) {
    //     let responseBody = ''
    //     try {
    //       responseBody = JSON.stringify(res.body, null, 2)
    //     } catch {
    //       // to avoid crash, but don't care about the error, add comment to avoid empty block lint error
    //     }
    //     this.fulfillRequest(
    //       list,
    //       res.statusCode,
    //       `${res.status}: ${responseBody}`
    //     )
    //   } else {
    //     this.fulfillRequest(list, res.statusCode, res.status)
    //   }
    //   return
    // }
    // this.handleReponse(res, list)
  }

  handleReponse(res: Response, list: Context[]) {
    const { statusText } = res
    // switch (statusText) {
    //   case Status.Success:
    //     this.handleSuccessResponse(res, list)
    //     break

    //   case Status.Invalid:
    //     this.handleInvalidResponse(res, list)
    //     break

    //   default:
    //     this.handleOtherReponse(list)
    // }
  }

  handleSuccessResponse(res: SuccessResponse, list: Context[]) {
    this.fulfillRequest(list, res.statusCode, SUCCESS_MESSAGE)
  }

  handleInvalidResponse(res: InvalidResponse, list: Context[]) {
    if (res.body.missingField || res.body.error.startsWith(INVALID_API_KEY)) {
      this.fulfillRequest(list, res.statusCode, res.body.error)
      return
    }
  }

  handleOtherReponse(list: Context[]) {
    this.addToQueue(
      ...list.map(context => {
        context.timeout = context.attempts * this.retryTimeout
        return context
      })
    )
  }

  fulfillRequest(list: Context[], code: number, message: string) {
    this.saveEvents()
    list.forEach(context => {
      context.callback(buildResult(context.event, code, message))
    })
  }

  /**
   * Saves events to storage
   * This is called on
   * 1) new events are added to queue; or
   * 2) response comes back for a request
   */
  async saveEvents() {
    const events = Array.from(this.queue.map(context => context.event))

    const localStorage = new LocalStorage()
    await localStorage.set(this.storageKey, events)
  }
}
