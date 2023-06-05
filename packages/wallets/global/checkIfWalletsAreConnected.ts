async function checkIfWalletsAreConnected(provider: any) {
  const accounts = await provider.request({ method: 'eth_accounts' })
  return accounts
}

export { checkIfWalletsAreConnected }
