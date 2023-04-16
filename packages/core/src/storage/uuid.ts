// Reviewed

import { CookieStorage } from '@core/storage/Cookie.js'
import { getCookieName } from '@core/utils/getCookieName.js'
import { LocalStorage } from '@core/storage/Local.js'

export async function createUUID(apiKey: string) {
  const cookieStorage = new CookieStorage()
  const localStorage = new LocalStorage()

  const uuid: string =
    ((await cookieStorage.get(getCookieName(apiKey))) as string) ??
    (await localStorage.get(getCookieName(apiKey) as string)) ??
    (crypto.randomUUID() as string)

  await cookieStorage.set(getCookieName(apiKey), uuid)
  await localStorage.set(getCookieName(apiKey), uuid)
}

export async function getUUID(apiKey: string) {
  const cookieStorage = new CookieStorage()
  const localStorage = new LocalStorage()

  await createUUID(apiKey)

  return (
    (await cookieStorage.get(getCookieName(apiKey))) ??
    (await localStorage.get(getCookieName(apiKey)))
  )
}
