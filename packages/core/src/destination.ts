import {
  Result,
  Event,
  // SuccessResponse,
  // InvalidResponse,
  Status
} from '../../types/src/index.js'
import { chunk } from './utils/chunk.js'
import { LocalStorage } from './storage/Local.js'
// import { AirblockCore } from './core-client.js'

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

const storageKey = `${STORAGE_PREFIX}_storage`
let queue: any[] = []

let scheduled: ReturnType<typeof setTimeout> | null = null

async function setup() {
  const localStorage = new LocalStorage()

  const unsent = await localStorage.get(storageKey)

  saveEvents() // sets storage to '[]'

  if (unsent && unsent.length > 0) {
    void Promise.all(unsent.map((event: any) => addToQueue(event))).catch()
  }

  return Promise.resolve(undefined)
}

function addToQueue(...list: any) {
  list.forEach((context: any) => {
    queue.push(context)

    schedule(2000) // flush interval(in milliseconds)
    return
  })

  saveEvents()
}

function schedule(timeout: number) {
  if (scheduled) {
    return
  }
  scheduled = setTimeout(() => {
    void flush(true).then(() => {
      if (queue.length > 0) {
        schedule(timeout)
      }
    })
  }, timeout)
}

async function flush(useRetry = false) {
  if (queue.length > 0) {
    const list: any[] = []
    queue.forEach((context: any) => list.push(context))

    if (scheduled) {
      clearTimeout(scheduled)
      scheduled = null
    }

    const batches = chunk(list, 30)

    await Promise.all(batches.map((batch: any) => send(batch, useRetry)))
  } else {
    return
  }
}

async function send(list: any[], useRetry = true) {
  // if (!this.config.apiKey) {
  //   return this.fulfillRequest(list, 400, MISSING_API_KEY_MESSAGE)
  // }

  const payload = {
    api_key: 'apiKey', //this.apiKey
    events: list
  }

  try {
    console.log(payload)
    queue = []
  } catch (err) {
    queue = [...list, ...queue]
    console.log('Queue ', queue)
  }

  saveEvents() // Not written like this, Empties localstorage
}

// try {
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
// }

// handleReponse(res: Response, list: any[]) {
//   const { statusText } = res
//   // switch (statusText) {
//   //   case Status.Success:
//   //     this.handleSuccessResponse(res, list)
//   //     break

//   //   case Status.Invalid:
//   //     this.handleInvalidResponse(res, list)
//   //     break

//   //   default:
//   //     this.handleOtherReponse(list)
//   // }
// }

// handleSuccessResponse(res: SuccessResponse, list: any[]) {
//   this.fulfillRequest(list, res.statusCode, SUCCESS_MESSAGE)
// }

// handleInvalidResponse(res: InvalidResponse, list: any[]) {
//   if (res.body.missingField || res.body.error.startsWith(INVALID_API_KEY)) {
//     this.fulfillRequest(list, res.statusCode, res.body.error)
//     return
//   }
// }

// handleOtherReponse(list: any[]) {
//   this.addToQueue(
//     ...list.map(context => {
//       context.timeout = context.attempts * this.retryTimeout
//       return context
//     })
//   )
// }

// fulfillRequest(list: any, res: any, msg: any) {
//   this.saveEvents()
//   // TBR
// }

async function saveEvents() {
  const localStorage = new LocalStorage()
  await localStorage.set(storageKey, queue)
}

export { schedule, addToQueue, saveEvents, flush, send, setup }
