'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  SolanaWallet,
  connectWallet,
  disconnectWallet,
  getBalance,
  isWalletAvailable,
} from './wallet'
import { updateWalletInStats, trackDailyLogin, getPlayerStats, PlayerStats } from './quests'

interface WalletContextType {
  wallet: SolanaWallet | null
  playerStats: PlayerStats
  isConnecting: boolean
  error: string | null
  hasWalletExtension: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  refreshBalance: () => Promise<void>
  refreshStats: () => void
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null)
  const [playerStats, setPlayerStats] = useState<PlayerStats>(getPlayerStats())
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasWalletExtension, setHasWalletExtension] = useState(false)

  useEffect(() => {
    setHasWalletExtension(isWalletAvailable())
    trackDailyLogin()
    setPlayerStats(getPlayerStats())
  }, [])

  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(null)
    try {
      const w = await connectWallet()
      setWallet(w)
      updateWalletInStats(w.publicKey)
      setPlayerStats(getPlayerStats())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    await disconnectWallet()
    setWallet(null)
  }, [])

  const refreshBalance = useCallback(async () => {
    if (!wallet) return
    const balance = await getBalance(wallet.publicKey)
    setWallet((prev) => (prev ? { ...prev, balance } : null))
  }, [wallet])

  const refreshStats = useCallback(() => {
    setPlayerStats(getPlayerStats())
  }, [])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        playerStats,
        isConnecting,
        error,
        hasWalletExtension,
        connect,
        disconnect,
        refreshBalance,
        refreshStats,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}
