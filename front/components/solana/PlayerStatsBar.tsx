'use client'

import { useWallet } from '@/lib/solana/WalletContext'
import { xpForNextLevel } from '@/lib/solana/quests'

export default function PlayerStatsBar() {
  const { wallet, playerStats } = useWallet()
  const levelProgress = xpForNextLevel(playerStats.totalXP)
  const progressPct = Math.min((levelProgress.progress / levelProgress.needed) * 100, 100)

  return (
    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
      {/* Level badge */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
        <span className="text-xs font-black text-white">{playerStats.level}</span>
        {/* XP ring */}
        <svg className="absolute inset-0 w-9 h-9 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <circle
            cx="18" cy="18" r="16" fill="none"
            stroke="url(#xp-gradient)" strokeWidth="2"
            strokeDasharray={`${progressPct} ${100 - progressPct}`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="xp-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Stats */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white">{playerStats.playerName}</span>
          {wallet?.connected && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/50">
          <span className="text-yellow-400 font-semibold">{playerStats.totalEarned.toFixed(3)} SOL</span>
          <span>{playerStats.totalXP} XP</span>
          <span>{playerStats.gamesPlayed} games</span>
          {playerStats.dailyStreak > 0 && (
            <span className="text-orange-400">🔥 {playerStats.dailyStreak}d</span>
          )}
        </div>
      </div>
    </div>
  )
}
