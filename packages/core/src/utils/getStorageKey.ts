export const getStorageKey = (apiKey: string, postKey = '', limit = 10) => {
  return ['AB', postKey, apiKey.substring(0, limit)].filter(Boolean).join('_')
}
