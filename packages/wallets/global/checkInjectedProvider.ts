async function checkInjectedProvider(
  ethereum: any,
  wallet: 'metamask' | 'coinbase'
) {
  let provider = ethereum

  if (ethereum.providers?.length) {
    ethereum.providers.forEach((p: any) => {
      if (wallet === 'metamask' && p.isMetaMask) provider = p
      if (wallet === 'coinbase' && p.isCoinbaseWallet) provider = p
    })
  }

  return provider
}

export { checkInjectedProvider }
