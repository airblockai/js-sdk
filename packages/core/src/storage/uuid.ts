import { CookieStorage } from '@core/storage/Cookie.js'
import { getCookieName } from '@core/utils/getCookieName.js'
import { LocalStorage } from '@core/storage/Local.js'

export async function createMainCookie(
  apiKey: string,
  expirationDays: number,
  updateLastEventTime: boolean
) {
  const cookieStorage = new CookieStorage({ expirationDays: expirationDays })
  const localStorage = new LocalStorage()

  const previousCookies: any = await cookieStorage.get(getCookieName(apiKey))
  const previousLocal: any = await localStorage.get(getCookieName(apiKey))

  const cache = {
    uuid:
      previousCookies?.uuid ??
      previousLocal?.uuid ??
      (crypto.randomUUID() as string),
    lastEventTime: updateLastEventTime
      ? Date.now()
      : previousCookies?.lastEventTime ??
        previousLocal?.lastEventTime ??
        undefined
  }

  await cookieStorage.set(getCookieName(apiKey), cache)
  await localStorage.set(getCookieName(apiKey), cache)
}

export async function getMainCookie(apiKey: string, expirationDays: number) {
  const cookieStorage = new CookieStorage({ expirationDays: expirationDays })
  const localStorage = new LocalStorage()

  const cookieData: any = await cookieStorage.get(getCookieName(apiKey))
  const localData: any = await localStorage.get(getCookieName(apiKey))

  return {
    uuid: cookieData?.uuid ?? localData?.uuid,
    lastEventTime: cookieData?.lastEventTime ?? localData?.lastEventTime
  }
}
