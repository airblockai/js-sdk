import {
  Result,
  Event,
  // SuccessResponse,
  // InvalidResponse,
  Status,
  BrowserConfig
} from '../../types/src/index.js'
import { chunk } from './utils/chunk.js'
import { LocalStorage } from './storage/Local.js'

export const AIRBLOCK_PREFIX = 'AB'
export const QUEUE_STORAGE_PREFIX = `${AIRBLOCK_PREFIX}_queue`
export const FLUSH_QUEUE_STORAGE_PREFIX = `${AIRBLOCK_PREFIX}_flush_queue`

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

const queueStorageKey = `${QUEUE_STORAGE_PREFIX}_storage`
const flushQueueStorageKey = `${FLUSH_QUEUE_STORAGE_PREFIX}_storage`

let queue: any[] = []
let flush_queue: any[] = []
let config: BrowserConfig
let awaitingAPIResponse = false

let scheduled: ReturnType<typeof setTimeout> | null = null

async function setup(browserConfig: BrowserConfig) {
  config = browserConfig

  const localStorage = new LocalStorage()
  const unsent_queue = await localStorage.get(queueStorageKey)

  saveQueue() // sets storage to '[]'

  if (unsent_queue && unsent_queue.length > 0) {
    void Promise.all(
      unsent_queue.map((event: any) => addToQueue(event))
    ).catch()
  }

  return Promise.resolve(undefined)
}

function addToQueue(...list: any) {
  list.forEach((context: any) => {
    queue.push(context)
    return
  })

  saveQueue()
  schedule(2000) // flush interval(in milliseconds)
}

function schedule(timeout: number) {
  if (scheduled) {
    return
  }
  scheduled = setTimeout(() => {
    void flush().then(() => {
      if (queue.length > 0) {
        schedule(timeout)
      }
    })
  }, timeout)
}

async function flush() {
  if (queue.length > 0 && flush_queue.length === 0) {
    // Moving events from queue to flush_queue
    flush_queue = queue
    await saveFlushQueue()

    queue = []
    await saveQueue()
  }

  if (scheduled) {
    clearTimeout(scheduled)
    scheduled = null
  }

  if (!awaitingAPIResponse) {
    const batches = chunk(flush_queue, 30)
    await Promise.all(batches.map((batch: any) => send(batch)))
  }
}

async function send(list: any[]) {
  // if (!this.config.apiKey) {
  //   return this.fulfillRequest(list, 400, MISSING_API_KEY_MESSAGE)
  // }

  const payload = {
    api_key: config.apiKey, //this.apiKey
    events: list
  }

  try {
    console.log(payload)
    awaitingAPIResponse = true

    const res = await fetch(
      // 'https://abc.execute-api.us-east-1.amazonaws.com/test/recordevent',
      'https://x1hrtqk698.execute-api.us-east-1.amazonaws.com/test/recordevent',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    )

    const data = await res.json()

    console.log('Response: ', data)

    awaitingAPIResponse = false

    flush_queue = []
    saveFlushQueue()
  } catch (err) {
    awaitingAPIResponse = false
    //
  }
}

async function saveQueue() {
  const localStorage = new LocalStorage()
  await localStorage.set(queueStorageKey, queue)
}

async function saveFlushQueue() {
  const localStorage = new LocalStorage()
  await localStorage.set(flushQueueStorageKey, flush_queue)
}

export { schedule, addToQueue, saveQueue as saveEvents, flush, send, setup }
