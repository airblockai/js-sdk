import { error } from '../../global/error.js'
import { getGlobalScope } from '../../../core/src/utils/getGlobalScope.js'
import { BrowserClient } from '../../../types/src/index.js'
import { checkInjectedProvider } from '../../global/checkInjectedProvider.js'

export class Coinbase {
  client: BrowserClient
  ethereum: any

  constructor(browserClient: BrowserClient) {
    this.client = browserClient
    this.ethereum = (getGlobalScope() as any).ethereum
  }

  async coinbaseInit() {
    if ((getGlobalScope() as any).ethereum) {
      await this.checkCoinbaseAccountsChanged()
      await this.checkCoinbaseChainChanged()
      await this.checkCoinbaseMessage()
    }
  }

  async checkIfWalletExists() {
    if (this.ethereum) {
      const provider = await checkInjectedProvider(this.ethereum, 'coinbase')

      if (provider.isCoinbaseWallet) {
        return true
      } else {
        return false
      }
    }
  }

  async sendCoinbaseWalletsEvent() {
    if (this.ethereum) {
      const accounts = await this.checkIfWalletsAreConnected()
      const chainId = await this.getChainId()

      if (accounts.length > 0) {
        this.client?.track(
          'coinbase_wallets',
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

  async checkCoinbaseChainChanged() {
    const provider = await checkInjectedProvider(this.ethereum, 'coinbase')

    provider.on('chainChanged', async (chainId: any) => {
      const accounts = await this.checkIfWalletsAreConnected()

      await this.client?.track(
        'coinbase_chainChanged',
        undefined,
        {
          accounts,
          chainId
        },
        undefined
      )
    })
  }

  async checkIfWalletsAreConnected() {
    const provider = await checkInjectedProvider(this.ethereum, 'coinbase')

    const accounts = await provider.request({ method: 'eth_accounts' })

    return accounts
  }

  async error(err: any) {
    await error(err, 'coinbase_error', this.client)
  }

  async getChainId() {
    const provider = await checkInjectedProvider(this.ethereum, 'coinbase')

    const chainId = await provider.request({ method: 'eth_chainId' })

    return chainId
  }

  async checkCoinbaseMessage() {
    const provider = await checkInjectedProvider(this.ethereum, 'coinbase')

    const accounts = await this.checkIfWalletsAreConnected()

    provider.on('message', async (message: any) => {
      const chainId = await this.getChainId()

      this.client?.track(
        'coinbase_message',
        { accounts, chainId, message },
        undefined,
        undefined
      )
    })
  }

  async checkCoinbaseAccountsChanged() {
    const provider = await checkInjectedProvider(this.ethereum, 'coinbase')

    provider.on('accountsChanged', async (accountInfo: any) => {
      const chainId = await this.getChainId()

      this.client?.track(
        'coinbase_accountsChanged',
        undefined,
        { newAddress: accountInfo, chainId },
        undefined
      )
    })
  }
}
