import { getGlobalScope } from '../../../core/src/utils/getGlobalScope.js'
import { BrowserClient } from '../../../types/src/index.js'
import { error } from '../../global/error.js'
import { checkIfWalletsAreConnected } from '../../global/checkIfWalletsAreConnected.js'
import { checkInjectedProvider } from '../../global/checkInjectedProvider.js'

export class Metamask {
  client: BrowserClient
  ethereum: any

  constructor(browserClient: BrowserClient) {
    this.client = browserClient
    this.ethereum = (getGlobalScope() as any).ethereum
  }

  async metamaskInit() {
    if ((getGlobalScope() as any).ethereum) {
      await this.checkMetamaskAccountsChanged()
      await this.checkMetamaskChainChanged()
      await this.checkMetamaskMessage()
    }
  }

  async error(err: any) {
    await error(err, 'metamask_error', this.client)
  }

  async checkIfWalletsAreConnected() {
    const provider = await checkInjectedProvider(this.ethereum, 'metamask')
    const accounts = await checkIfWalletsAreConnected(provider)

    return accounts ? accounts : []
  }

  async checkIfWalletExists() {
    if (this.ethereum && this.ethereum.isMetaMask) {
      return true
    } else {
      return false
    }
  }

  async sendMetamaskWalletsEvent() {
    if (this.ethereum) {
      const accounts = await this.checkIfWalletsAreConnected()
      const chainId = await this.getChainId()

      if (accounts.length > 0) {
        this.client?.track(
          'metamask_wallets',
          undefined,
          {
            accounts,
            chainId: chainId
          },
          undefined
        )
      }
    }
  }

  async checkMetamaskChainChanged() {
    const provider = await checkInjectedProvider(this.ethereum, 'metamask')

    provider.on('chainChanged', async (chainId: any) => {
      const accounts = await this.checkIfWalletsAreConnected()

      await this.client?.track(
        'metamask_chainChanged',
        undefined,
        {
          accounts,
          chainId
        },
        undefined
      )
    })
  }

  async getChainId() {
    const provider = await checkInjectedProvider(this.ethereum, 'metamask')

    const chainId = await provider.request({ method: 'eth_chainId' })

    return chainId
  }

  async checkMetamaskMessage() {
    const provider = await checkInjectedProvider(this.ethereum, 'metamask')

    const accounts = await this.checkIfWalletsAreConnected()

    provider.on('message', async (message: any) => {
      const chainId = await this.getChainId()

      this.client?.track(
        'metamask_message',
        { accounts, chainId, message },
        undefined,
        undefined
      )
    })
  }

  async checkMetamaskAccountsChanged() {
    const provider = await checkInjectedProvider(this.ethereum, 'metamask')

    provider.on('accountsChanged', async (accountInfo: any) => {
      const chainId = await this.getChainId()

      this.client?.track(
        'metamask_accountsChanged',
        undefined,
        { newAddress: accountInfo, chainId },
        undefined
      )
    })
  }
}
