import { UserSession } from '@airblock-sdk/types'
import { MemoryStorage } from '@core/storage/Memory.js'

export const getDefaultConfig = () => {
  const cookieStorage = new MemoryStorage<UserSession>()
  return {
    disableCookies: false,
    cookieStorage
  }
}
