// Reviewed

import { CookieStorage } from '@core/storage/Cookie.js'
import { getCookieName } from '@core/utils/getCookieName.js'
import { LocalStorage } from '@core/storage/Local.js'

export async function createUUID(apiKey: string, expirationDays: number) {
  const cookieStorage = new CookieStorage({ expirationDays: expirationDays })
  const localStorage = new LocalStorage()

  const previousCookies: any = await cookieStorage.get(getCookieName(apiKey))
  const previousLocal: any = await localStorage.get(getCookieName(apiKey))

  const cache = {
    uuid:
      previousCookies?.uuid ??
      previousLocal?.uuid ??
      (crypto.randomUUID() as string),
    sessionId:
      previousCookies?.sessionId ?? previousLocal?.sessionId ?? Date.now()
  }

  await cookieStorage.set(getCookieName(apiKey), cache)
  await localStorage.set(getCookieName(apiKey), cache)
}

export async function getUUID(apiKey: string, expirationDays: number) {
  const cookieStorage = new CookieStorage({ expirationDays: expirationDays })
  const localStorage = new LocalStorage()

  await createUUID(apiKey, expirationDays)

  const cookieData: any = await cookieStorage.get(getCookieName(apiKey))
  const localData: any = await localStorage.get(getCookieName(apiKey))

  return {
    uuid: cookieData?.uuid ?? localData?.uuid,
    sessionId: cookieData?.sessionId ?? localData?.sessionId
  }
}
