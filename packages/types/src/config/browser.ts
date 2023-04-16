export interface FingerprintOptions {
  deviceManufacturer?: boolean
  deviceModel?: boolean
  ipAddress?: boolean
  language?: boolean
  osName?: boolean
  osVersion?: boolean
  platform?: boolean
  [key: string]: boolean | undefined
}
