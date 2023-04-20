import { UserSession } from '../../../types/src/index.js'
import { MemoryStorage } from '../storage/Memory.js'

export const getDefaultConfig = () => {
  const cookieStorage = new MemoryStorage<UserSession>()
  return {
    disableCookies: false,
    cookieStorage
  }
}
