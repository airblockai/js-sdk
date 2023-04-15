import { IngestionMetadata } from '../ingestion-metadata'
import { Plan } from '../plan'
import { Storage } from '../storage'
import { LogLevel, Logger } from '../logger'
import { ServerZone } from '../server'
import { UserSession } from '..'
import { TrackingOptions } from './browser'

export interface Config {
  apiKey: string
  flushIntervalMillis: number
  flushMaxRetries: number
  flushQueueSize: number
  logLevel: LogLevel
  loggerProvider: Logger
  minIdLength?: number
  optOut: boolean
  plan?: Plan
  ingestionMetadata?: IngestionMetadata
  serverUrl?: string
  serverZone?: keyof typeof ServerZone
  storageProvider?: Storage<Event[]>
  useBatch: boolean
}

export interface DefaultTrackingOptions {
  fileDownloads?: boolean
  formInteractions?: boolean
  pageViews?: boolean | PageTrackingOptions
  sessions?: boolean
}

export interface PageTrackingOptions {
  trackOn?: PageTrackingTrackOn
  trackHistoryChanges?: PageTrackingHistoryChanges
  eventType?: string
}

export type PageTrackingTrackOn = 'attribution' | (() => boolean)

export type PageTrackingHistoryChanges = 'all' | 'pathOnly'

export interface AttributionOptions {
  disabled?: boolean
  excludeReferrers?: string[]
  initialEmptyValue?: string
  resetSessionOnNewCampaign?: boolean
  trackNewCampaigns?: boolean
  trackPageViews?: boolean
}

export interface BrowserConfig extends Config {
  appVersion?: string
  attribution?: AttributionOptions
  defaultTracking?: boolean | DefaultTrackingOptions
  deviceId?: string
  cookieExpiration: number
  cookieSameSite: string
  cookieSecure: boolean
  cookieStorage: Storage<UserSession>
  cookieUpgrade: boolean
  disableCookies: boolean
  domain: string
  lastEventTime?: number
  partnerId?: string
  sessionId?: number
  sessionTimeout: number
  trackingOptions: TrackingOptions
  userId?: string
}

export interface Options extends Partial<Config> {
  apiKey: string
}
