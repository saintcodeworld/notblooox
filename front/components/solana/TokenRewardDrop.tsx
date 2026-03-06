'use client'

import { useState, useEffect, useCallback } from 'react'
import { popPendingReward, getPendingRewardCount, RewardDrop } from '@/lib/solana/quests'

export default function TokenRewardDrop() {
  const [activeReward, setActiveReward] = useState<RewardDrop | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const checkRewards = useCallback(() => {
    if (activeReward) return
    const reward = popPendingReward()
    if (reward) {
      setActiveReward(reward)
      setIsVisible(true)
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => setActiveReward(null), 500)
      }, 4000)
    }
  }, [activeReward])

  useEffect(() => {
    const interval = setInterval(checkRewards, 1000)
    return () => clearInterval(interval)
  }, [checkRewards])

  if (!activeReward) return null

  const typeConfig: Record<string, { color: string; title: string; glow: string }> = {
    quest_complete: { color: 'from-purple-500 to-indigo-500', title: 'Quest Complete!', glow: 'shadow-purple-500/40' },
    level_up: { color: 'from-yellow-500 to-orange-500', title: 'Level Up!', glow: 'shadow-yellow-500/40' },
    daily_bonus: { color: 'from-green-500 to-emerald-500', title: 'Daily Bonus!', glow: 'shadow-green-500/40' },
    achievement: { color: 'from-cyan-500 to-blue-500', title: 'Achievement Unlocked!', glow: 'shadow-cyan-500/40' },
    random_drop: { color: 'from-pink-500 to-rose-500', title: 'Random Drop!', glow: 'shadow-pink-500/40' },
  }

  const config = typeConfig[activeReward.type] || typeConfig.quest_complete

  return (
    <div
      className={`fixed top-32 left-1/2 -translate-x-1/2 z-[100] pointer-events-none transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-90'
      }`}
    >
      <div className={`relative bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 px-8 py-5 shadow-2xl ${config.glow} min-w-[280px]`}>
        {/* Animated glow ring */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${config.color} opacity-20 animate-pulse`} />

        {/* Coin animation */}
        <div className="flex flex-col items-center relative">
          <div className="text-4xl mb-2 animate-bounce">
            💰
          </div>
          <div className={`text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
            {config.title}
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            +{activeReward.amount} <span className="text-yellow-400">SOL</span>
          </div>
          <p className="text-xs text-white/50 mt-1 text-center max-w-[200px]">
            {activeReward.message}
          </p>

          {/* Sparkle particles */}
          <div className="absolute -top-2 -left-4 text-yellow-400/60 animate-ping text-xs">✦</div>
          <div className="absolute -top-1 -right-3 text-purple-400/60 animate-ping text-xs" style={{ animationDelay: '0.3s' }}>✦</div>
          <div className="absolute bottom-0 -left-2 text-cyan-400/60 animate-ping text-xs" style={{ animationDelay: '0.6s' }}>✦</div>
          <div className="absolute bottom-1 -right-4 text-pink-400/60 animate-ping text-xs" style={{ animationDelay: '0.9s' }}>✦</div>
        </div>
      </div>
    </div>
  )
}
