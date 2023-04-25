import { BrowserClient } from '../../../types/src/index.js'

export class Metamask {
  client: BrowserClient
  ethereum: any

  constructor(browserClient: BrowserClient) {
    this.client = browserClient
    this.ethereum = (window as any).ethereum
  }

  async metamaskInit() {
    if ((window as any).ethereum) {
      await this.checkMetamaskAccountsChanged()
      await this.checkMetamaskChainChanged()
      await this.checkMetamaskMessage()
    }
  }

  async error(err: any) {
    this.client?.track(
      'metamask_error',
      {
        ...err
      },
      undefined,
      undefined
    )
  }

  async checkIfWalletsAreConnected() {
    let provider = this.ethereum

    if (this.ethereum.providers?.length) {
      this.ethereum.providers.forEach(async (p: any) => {
        if (p.isMetaMask) provider = p
      })
    }

    const accounts = await provider.request({ method: 'eth_accounts' })

    return accounts
  }

  async checkIfWalletExists() {
    if (this.ethereum && this.ethereum.isMetaMask) {
      return true
    } else {
      return false
    }
  }

  async sendMetamaskWalletsEvent() {
    if ((window as any).ethereum) {
      const accounts = await this.checkIfWalletsAreConnected()

      if (accounts.length > 0) {
        this.client?.track(
          'metamask_wallets',
          undefined,
          {
            accounts
          },
          undefined
        )
      }
    }
  }

  async checkMetamaskChainChanged() {
    const accounts = await this.checkIfWalletsAreConnected()

    let provider = this.ethereum

    if (this.ethereum.providers?.length) {
      this.ethereum.providers.forEach(async (p: any) => {
        if (p.isMetaMask) provider = p
      })
    }

    provider.on('chainChanged', (chainId: any) => {
      this.client?.track(
        'metamask_chainChanged',
        undefined,
        {
          address: accounts,
          chainId
        },
        undefined
      )
    })
  }

  async getChainId() {
    let provider = this.ethereum

    if (this.ethereum.providers?.length) {
      this.ethereum.providers.forEach(async (p: any) => {
        if (p.isMetaMask) provider = p
      })
    }

    const chainId = await provider.request({ method: 'eth_chainId' })

    return chainId
  }

  async checkMetamaskMessage() {
    let provider = this.ethereum

    if (this.ethereum.providers?.length) {
      this.ethereum.providers.forEach(async (p: any) => {
        if (p.isMetaMask) provider = p
      })
    }

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
    let provider = this.ethereum

    if (this.ethereum.providers?.length) {
      this.ethereum.providers.forEach(async (p: any) => {
        if (p.isMetaMask) provider = p
      })
    }

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
