import { CookieStorage } from '@core/storage/Cookie.js'
import { getCookieName } from '@core/utils/getCookieName.js'
import { LocalStorage } from '@core/storage/Local.js'

export async function createUuid(apiKey: string, disableCookies: boolean) {
  const cookieStorage = new CookieStorage()
  const localStorage = new LocalStorage()

  const uuid: string =
    ((await cookieStorage.get(getCookieName(apiKey))) as string) ??
    (await localStorage.get(getCookieName(apiKey) as string)) ??
    (crypto.randomUUID() as string)

  if (!disableCookies) {
    await cookieStorage.set(getCookieName(apiKey), uuid)
    await localStorage.set(getCookieName(apiKey), uuid)
  } else if (disableCookies) {
    await localStorage.set(getCookieName(apiKey), uuid)
  }
}

export async function getUuid(apiKey: string, disableCookies: boolean) {
  const cookieStorage = new CookieStorage()
  const localStorage = new LocalStorage()

  await createUuid(apiKey, disableCookies)

  return (
    (await cookieStorage.get(getCookieName(apiKey))) ??
    (await localStorage.get(getCookieName(apiKey)))
  )
}
