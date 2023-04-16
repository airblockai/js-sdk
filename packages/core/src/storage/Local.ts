// Reviewed

import { Storage } from '@airblock-sdk/types'
import { getGlobalScope } from '@core/utils/getGlobalScope.js'

export class LocalStorage<T> implements Storage<T> {
  async isEnabled() {
    if (!getGlobalScope()) {
      return false
    }

    const random = String(Date.now())
    const testStorage = new LocalStorage<string>()
    const testKey = 'AB_TEST'
    try {
      await testStorage.set(testKey, random)
      const value = await testStorage.get(testKey)
      return value === random
    } catch {
      return false
    } finally {
      await testStorage.remove(testKey)
    }
  }

  async get(key: string) {
    try {
      const value = await this.getRaw(key)
      if (!value) {
        return undefined
      }

      return JSON.parse(value)
    } catch {
      return undefined
    }
  }

  async getRaw(key: string) {
    return getGlobalScope()?.localStorage.getItem(key) || undefined
  }

  async set(key: string, value: T) {
    try {
      getGlobalScope()?.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      //
    }
  }

  async remove(key: string) {
    try {
      getGlobalScope()?.localStorage.removeItem(key)
    } catch {
      //
    }
  }

  async reset() {
    try {
      getGlobalScope()?.localStorage.clear()
    } catch {
      //
    }
  }
}
