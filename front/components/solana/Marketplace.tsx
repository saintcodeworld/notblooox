'use client'

import { useState } from 'react'
import { useWallet } from '@/lib/solana/WalletContext'

interface MarketItem {
  id: string
  name: string
  description: string
  price: number
  category: 'skin' | 'trail' | 'emote' | 'boost'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  icon: string
  owned: boolean
}

const MARKET_ITEMS: MarketItem[] = [
  { id: 'skin_neon', name: 'Neon Glow', description: 'Glowing neon player skin', price: 0.05, category: 'skin', rarity: 'rare', icon: '✨', owned: false },
  { id: 'skin_gold', name: 'Golden Warrior', description: 'Shimmering golden armor skin', price: 0.15, category: 'skin', rarity: 'epic', icon: '👑', owned: false },
  { id: 'skin_phantom', name: 'Phantom Shadow', description: 'Dark ethereal phantom skin', price: 0.5, category: 'skin', rarity: 'legendary', icon: '👻', owned: false },
  { id: 'trail_fire', name: 'Fire Trail', description: 'Leave a blazing trail behind', price: 0.03, category: 'trail', rarity: 'common', icon: '🔥', owned: false },
  { id: 'trail_ice', name: 'Frost Trail', description: 'Icy crystal footsteps', price: 0.04, category: 'trail', rarity: 'rare', icon: '❄️', owned: false },
  { id: 'trail_rainbow', name: 'Rainbow Trail', description: 'Colorful rainbow path', price: 0.1, category: 'trail', rarity: 'epic', icon: '🌈', owned: false },
  { id: 'emote_dance', name: 'Victory Dance', description: 'Celebrate with style', price: 0.02, category: 'emote', rarity: 'common', icon: '💃', owned: false },
  { id: 'emote_flex', name: 'Flex Pose', description: 'Show off your strength', price: 0.02, category: 'emote', rarity: 'common', icon: '💪', owned: false },
  { id: 'boost_xp2x', name: '2X XP Boost', description: 'Double XP for 1 hour', price: 0.01, category: 'boost', rarity: 'common', icon: '⚡', owned: false },
  { id: 'boost_sol2x', name: '2X SOL Boost', description: 'Double SOL rewards for 1 hour', price: 0.03, category: 'boost', rarity: 'rare', icon: '💎', owned: false },
  { id: 'skin_cyber', name: 'Cyberpunk', description: 'Futuristic cyberpunk aesthetic', price: 0.08, category: 'skin', rarity: 'rare', icon: '🤖', owned: false },
  { id: 'emote_gg', name: 'GG Salute', description: 'Good game salute animation', price: 0.015, category: 'emote', rarity: 'common', icon: '🫡', owned: false },
]

const rarityColors: Record<string, string> = {
  common: 'border-gray-500/30 from-gray-500/10',
  rare: 'border-blue-500/30 from-blue-500/10',
  epic: 'border-purple-500/30 from-purple-500/10',
  legendary: 'border-yellow-500/30 from-yellow-500/10',
}

const rarityBadge: Record<string, string> = {
  common: 'bg-gray-600/50 text-gray-300',
  rare: 'bg-blue-600/50 text-blue-300',
  epic: 'bg-purple-600/50 text-purple-300',
  legendary: 'bg-yellow-600/50 text-yellow-300',
}

export default function Marketplace() {
  const { wallet } = useWallet()
  const [activeCategory, setActiveCategory] = useState<'all' | 'skin' | 'trail' | 'emote' | 'boost'>('all')
  const [items, setItems] = useState<MarketItem[]>(() => {
    if (typeof window === 'undefined') return MARKET_ITEMS
    const owned = JSON.parse(localStorage.getItem('notblox_owned_items') || '[]') as string[]
    return MARKET_ITEMS.map((item) => ({ ...item, owned: owned.includes(item.id) }))
  })
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const categories: { key: typeof activeCategory; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: '🛒' },
    { key: 'skin', label: 'Skins', icon: '🎨' },
    { key: 'trail', label: 'Trails', icon: '✨' },
    { key: 'emote', label: 'Emotes', icon: '🎭' },
    { key: 'boost', label: 'Boosts', icon: '⚡' },
  ]

  const filtered = activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory)

  const handlePurchase = async (itemId: string) => {
    if (!wallet?.connected) {
      setToast('Connect your wallet to purchase!')
      setTimeout(() => setToast(null), 3000)
      return
    }

    const item = items.find((i) => i.id === itemId)
    if (!item || item.owned) return

    if (wallet.balance < item.price) {
      setToast('Insufficient SOL balance')
      setTimeout(() => setToast(null), 3000)
      return
    }

    setPurchasing(itemId)
    // Simulate transaction time
    await new Promise((r) => setTimeout(r, 1200))

    const updated = items.map((i) => (i.id === itemId ? { ...i, owned: true } : i))
    setItems(updated)

    const ownedIds = updated.filter((i) => i.owned).map((i) => i.id)
    localStorage.setItem('notblox_owned_items', JSON.stringify(ownedIds))

    setPurchasing(null)
    setToast(`Purchased ${item.name}!`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="text-lg">🏪</span> Marketplace
        </h3>
        <p className="text-xs text-white/30 mt-0.5">Buy items with SOL earnings</p>
      </div>

      {/* Category tabs */}
      <div className="flex px-3 gap-1 pb-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === cat.key
                ? 'bg-purple-600/40 text-white border border-purple-500/30'
                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="grid grid-cols-2 gap-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-xl border bg-gradient-to-b to-transparent p-3 transition-all hover:scale-[1.02] ${
                rarityColors[item.rarity]
              } ${item.owned ? 'opacity-60' : ''}`}
            >
              {/* Rarity badge */}
              <span className={`absolute top-2 right-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${rarityBadge[item.rarity]}`}>
                {item.rarity}
              </span>

              <div className="text-3xl mb-2">{item.icon}</div>
              <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
              <p className="text-[10px] text-white/30 mt-0.5 line-clamp-1">{item.description}</p>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-400">{item.price} SOL</span>
                {item.owned ? (
                  <span className="text-[10px] text-green-400/60 font-medium">Owned</span>
                ) : (
                  <button
                    onClick={() => handlePurchase(item.id)}
                    disabled={purchasing === item.id}
                    className="text-[10px] font-bold px-2 py-1 bg-purple-600/60 hover:bg-purple-500/60 text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {purchasing === item.id ? '...' : 'Buy'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
