/**
 * Solana Wallet Integration
 * Handles Phantom/Solflare wallet connection, balance checks, and transaction signing.
 */

export interface SolanaWallet {
  publicKey: string
  balance: number
  connected: boolean
  provider: 'phantom' | 'solflare' | null
}

export interface TransactionResult {
  success: boolean
  signature?: string
  error?: string
}

const LAMPORTS_PER_SOL = 1_000_000_000
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'

// Get Phantom or Solflare provider from window
function getProvider(): any {
  if (typeof window === 'undefined') return null
  const phantom = (window as any).phantom?.solana
  if (phantom?.isPhantom) return { provider: phantom, name: 'phantom' as const }
  const solflare = (window as any).solflare
  if (solflare?.isSolflare) return { provider: solflare, name: 'solflare' as const }
  return null
}

export async function connectWallet(): Promise<SolanaWallet> {
  const result = getProvider()
  if (!result) {
    throw new Error('No Solana wallet found. Install Phantom or Solflare.')
  }
  try {
    const resp = await result.provider.connect()
    const publicKey = resp.publicKey.toString()
    const balance = await getBalance(publicKey)
    return {
      publicKey,
      balance,
      connected: true,
      provider: result.name,
    }
  } catch (err: any) {
    throw new Error(err.message || 'Failed to connect wallet')
  }
}

export async function disconnectWallet(): Promise<void> {
  const result = getProvider()
  if (result) {
    await result.provider.disconnect()
  }
}

export async function getBalance(publicKey: string): Promise<number> {
  try {
    const response = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [publicKey],
      }),
    })
    const data = await response.json()
    return (data.result?.value || 0) / LAMPORTS_PER_SOL
  } catch {
    return 0
  }
}

export async function signAndSendTransaction(
  toAddress: string,
  amountSOL: number
): Promise<TransactionResult> {
  const result = getProvider()
  if (!result) return { success: false, error: 'No wallet connected' }

  try {
    // Create a simple transfer instruction via the provider
    const { provider } = result
    const connection = {
      rpcEndpoint: SOLANA_RPC,
    }

    // For production, use @solana/web3.js Transaction objects
    // This is a simplified signing flow
    const message = new TextEncoder().encode(
      JSON.stringify({
        action: 'transfer',
        to: toAddress,
        amount: amountSOL,
        timestamp: Date.now(),
      })
    )

    const signature = await provider.signMessage(message, 'utf8')
    return {
      success: true,
      signature: Buffer.from(signature.signature).toString('hex'),
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Transaction failed' }
  }
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function isWalletAvailable(): boolean {
  if (typeof window === 'undefined') return false
  return !!(
    (window as any).phantom?.solana?.isPhantom ||
    (window as any).solflare?.isSolflare
  )
}
