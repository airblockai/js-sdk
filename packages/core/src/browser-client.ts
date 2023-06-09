import { AirblockCore } from './core-client.js'
import { BrowserClient, BrowserConfig, Config } from '../../types/src/index.js'
import { createMainCookie, getMainCookie } from './storage/uuid.js'
import { flush, setup } from './destination.js'
import { webAttribution } from './webAttribution.js'
import { CookieStorage } from './storage/Cookie.js'
import { CampaignParser } from './campaign/campaign.js'
import { getStorageKey } from './utils/getStorageKey.js'

import FingerprintJS, { hashComponents } from './fp.esm.js'
import { VERSION } from './version.js'
import { Metamask } from '../../wallets/metamask/src/index.js'
import { Coinbase } from '../../wallets/coinbase/src/coinbase.js'

export const DEFAULT_SESSION_START_EVENT = 'session_start'

export class AirblockBrowser extends AirblockCore implements BrowserClient {
  previousSessionUUID: string | undefined

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config: BrowserConfig = {}

  async init(apiKey: string, serverUrl: string, options?: Config) {
    this.config.apiKey = apiKey
    this.config.optOut = options?.optOut !== null ? false : options?.optOut
    this.config.sessionTimeout = 30 * 60 * 1000
    this.config.cookieExpiration = 365
    this.config.fingerprinting = options?.fingerprinting ?? true
    this.config.wallets = []
    this.config.serverUrl = serverUrl

    if (!apiKey) {
      throw new Error('API_KEY is a required field')
    }

    if (!serverUrl) {
      throw new Error('SERVER_URL is a required field')
    }

    // Metamask init
    const metamask = new Metamask(this)
    if ((window as any).ethereum.isMetaMask) {
      await metamask.metamaskInit()
    }

    // Coinbase init
    const coinbase = new Coinbase(this)
    if ((window as any).coinbaseWalletExtension) {
      await coinbase.coinbaseInit()
    }

    if (this.initializing) {
      return
    }

    this.initializing = true

    await createMainCookie(apiKey, this.config.cookieExpiration, false)

    const cookieData = await getMainCookie(apiKey, this.config.cookieExpiration)
    this.config.lastEventTime = cookieData.lastEventTime ?? null
    this.config.uuid = cookieData.uuid ?? null

    await super._init(this.config.apiKey, this.config, this, this.config.optOut)

    await setup(this.config)

    // Either
    // 1) No previous session; or
    // 2) Previous session expired
    let isNewSession = !this.config.lastEventTime
    if (
      (this.config.lastEventTime &&
        Date.now() - this.config.lastEventTime > this.config.sessionTimeout) ||
      !this.config.lastEventTime
    ) {
      const library = `${VERSION}`
      const metamask_result = await metamask?.checkIfWalletExists()
      const coinbase_result = await coinbase.checkIfWalletExists()

      if (metamask_result) {
        this.config.wallets.push('metamask')
      }

      if (coinbase_result) {
        this.config.wallets.push('coinbase')
      }

      this.track(DEFAULT_SESSION_START_EVENT, undefined, {
        sdk_ver: library,
        wallets: this.config.wallets
      })

      await metamask?.sendMetamaskWalletsEvent()
      await coinbase.sendCoinbaseWalletsEvent()

      if (this.config.fingerprinting) {
        const fpPromise = FingerprintJS.load()
        const fp = await fpPromise
        const result = await fp.get()

        this.track('fingerprint', undefined, {
          architecture: result.components.architecture.value,
          audio: result.components.audio.value,
          canvas_hash: {
            winding: result.components.canvas.value.winding,
            text: hashComponents(result.components.canvas.value.text),
            geometry: hashComponents(result.components.canvas.value.geometry)
          },
          colorDepth: result.components.colorDepth.value,
          colorGamut: result.components.colorGamut.value,
          contrast: result.components.contrast.value,
          cookiesEnabled: result.components.cookiesEnabled.value,
          cpuClass: result.components.cpuClass.value,
          deviceMemory: result.components.deviceMemory.value,
          domBlockers: result.components.domBlockers.value,
          fontPreferences: result.components.fontPreferences.value,
          fonts: result.components.fonts.value,
          forcedColors: result.components.forcedColors.value,
          hardwareConcurrency: result.components.hardwareConcurrency.value,
          hdr: result.components.hdr.value,
          indexedDB: result.components.indexedDB.value,
          invertedColors: result.components.invertedColors.value,
          languages: result.components.languages.value,
          localStorage: result.components.localStorage.value,
          math: result.components.math.value,
          monochrome: result.components.monochrome.value,
          openDatabase: result.components.openDatabase.value,
          osCpu: result.components.osCpu.value,
          pdfViewerEnabled: result.components.pdfViewerEnabled.value,
          platform: result.components.platform.value,
          plugins: result.components.plugins.value,
          reducedMotion: result.components.reducedMotion.value,
          screenFrame: result.components.screenFrame.value,
          screenResolution: result.components.screenResolution.value,
          sessionStorage: result.components.sessionStorage.value,
          timezone: result.components.timezone.value,
          touchSupport: result.components.touchSupport.value,
          vendor: result.components.vendor.value,
          vendorFlavors: result.components.vendorFlavors.value,
          videoCard: result.components.videoCard.value,
          visitorId: result.visitorId
        })
      }

      const storage = new CookieStorage<any>()

      const storageKey = getStorageKey(this.config.apiKey, 'MKTG')

      const [currentCampaign] = await Promise.all([
        new CampaignParser().parse()
      ])

      // const campaignEvent = createCampaignEvent(currentCampaign, {})
      // this.track(campaignEvent)
      this.track('attribution', {
        ...currentCampaign,
        page_url: window.location.href ?? ''
      })

      void storage.set(storageKey, currentCampaign)

      isNewSession = true
    }

    // Do not track any events before this
    // Add web attribution
    if (!this.config.attribution?.disabled) {
      const webAttributionVar = webAttribution({
        excludeReferrers: this.config.attribution?.excludeReferrers,
        initialEmptyValue: this.config.attribution?.initialEmptyValue
      })

      // For Airblock-internal functionality
      // if pluginEnabledOverride === undefined then use plugin default logic
      // if pluginEnabledOverride === true then track attribution
      // if pluginEnabledOverride === false then do not track attribution
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ;(webAttributionVar as any).__pluginEnabledOverride =
        isNewSession || this.config.attribution?.trackNewCampaigns
          ? undefined
          : false
      await webAttributionVar.setup(this.config, this)
    }

    this.initializing = false
  }

  async flush() {
    await flush()
  }
}
