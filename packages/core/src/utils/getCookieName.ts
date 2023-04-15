export const getCookieName = (apiKey: string) => {
  return `AB_${apiKey.substring(0, 10)}`
}
