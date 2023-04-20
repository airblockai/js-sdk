export const getGlobalScope = (): typeof globalThis | undefined => {
  if (typeof globalThis !== 'undefined') {
    return globalThis
  }
  if (typeof window !== 'undefined') {
    return window
  }
  if (typeof self !== 'undefined') {
    return self
  }
  return undefined
}
