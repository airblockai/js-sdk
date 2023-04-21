export class Metamask {
  async checkIfWalletExists() {
    const ethereum = (window as any).ethereum

    if (ethereum && ethereum.isMetaMask) {
      return true
    } else {
      return false
    }
  }
}
