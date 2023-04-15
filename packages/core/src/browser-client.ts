import { AirblockCore } from '@core/core-client.js'
import {
  AirblockReturn,
  BrowserOptions,
  EventOptions,
  Identify as IIdentify,
  InstanceProxy,
  QueueProxy,
  Result
} from '@airblock-sdk/types'
import { createUuid, getUuid } from '@core/storage/uuid.js'
import { Identify } from '@core/identify'

export const isInstanceProxy = (
  instance: unknown
): instance is InstanceProxy => {
  const instanceProxy = instance as InstanceProxy
  return instanceProxy && instanceProxy._q !== undefined
}

export const convertProxyObjectToRealObject = <T>(
  instance: T,
  queue: QueueProxy
): T => {
  for (let i = 0; i < queue.length; i++) {
    const { name, args, resolve } = queue[i]
    const fn = instance && instance[name as keyof T]
    if (typeof fn === 'function') {
      const result = fn.apply(instance, args) as AirblockReturn<Result>
      if (typeof resolve === 'function') {
        resolve(result?.promise)
      }
    }
  }
  return instance
}

export class AirblockBrowser extends AirblockCore {
  async init(apiKey = '', options?: BrowserOptions) {
    if (this.initializing) {
      return
    }

    this.initializing = true

    await createUuid(apiKey, options?.disableCookies as boolean)

    console.log(await getUuid(apiKey, options?.disableCookies as boolean))
  }

  identify(identify: IIdentify, eventOptions?: EventOptions) {
    if (isInstanceProxy(identify)) {
      const queue = identify._q
      identify._q = []
      identify = convertProxyObjectToRealObject(new Identify(), queue)
    }
    if (eventOptions?.user_id) {
      this.setUserId(eventOptions.user_id)
    }
    if (eventOptions?.device_id) {
      this.setDeviceId(eventOptions.device_id)
    }
    return super.identify(identify, eventOptions)
  }

  setUserId(userId: string | undefined) {
    if (!this.config) {
      this.q.push(this.setUserId.bind(this, userId))
      return
    }
    if (userId !== this.config.userId || userId === undefined) {
      this.config.userId = userId
      this.setSessionId(Date.now())
      setConnectorUserId(userId)
    }
  }
}
