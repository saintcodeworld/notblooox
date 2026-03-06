'use client'

import { useState } from 'react'
import { useWallet } from '@/lib/solana/WalletContext'
import { shortenAddress } from '@/lib/solana/wallet'

export default function WalletButton() {
  const { wallet, isConnecting, hasWalletExtension, connect, disconnect } = useWallet()
  const [showDropdown, setShowDropdown] = useState(false)

  if (!hasWalletExtension) {
    return (
      <a
        href="https://phantom.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
      >
        <SolanaIcon />
        Get Wallet
      </a>
    )
  }

  if (wallet?.connected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/90 to-emerald-600/90 text-white rounded-xl font-semibold text-sm hover:from-green-500 hover:to-emerald-500 transition-all duration-200 shadow-lg hover:shadow-green-500/25 backdrop-blur-sm"
        >
          <SolanaIcon />
          <span>{wallet.balance.toFixed(4)} SOL</span>
          <span className="text-white/60">|</span>
          <span className="text-white/80">{shortenAddress(wallet.publicKey)}</span>
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            <button
              onClick={() => {
                navigator.clipboard.writeText(wallet.publicKey)
                setShowDropdown(false)
              }}
              className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              Copy Address
            </button>
            <button
              onClick={() => {
                disconnect()
                setShowDropdown(false)
              }}
              className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/10 transition-colors border-t border-white/5"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-sm hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <SolanaIcon />
      {isConnecting ? (
        <span className="flex items-center gap-1">
          <span className="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full" />
          Connecting...
        </span>
      ) : (
        'Connect Wallet'
      )}
    </button>
  )
}

function SolanaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 397.7 311.7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <linearGradient id="sol-grad-a" x1="360.879" y1="351.455" x2="141.213" y2="-69.294" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 0 314)">
        <stop offset="0" stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#sol-grad-a)" />
      <linearGradient id="sol-grad-b" x1="264.829" y1="401.601" x2="45.163" y2="-19.148" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 0 314)">
        <stop offset="0" stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#sol-grad-b)" />
      <linearGradient id="sol-grad-c" x1="312.548" y1="376.688" x2="92.882" y2="-44.061" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 -1 0 314)">
        <stop offset="0" stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#sol-grad-c)" />
    </svg>
  )
}
