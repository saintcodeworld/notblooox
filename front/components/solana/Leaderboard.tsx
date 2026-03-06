'use client'

import { useState, useEffect } from 'react'
import { getLeaderboard, LeaderboardEntry } from '@/lib/solana/quests'

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [sortBy, setSortBy] = useState<'totalEarned' | 'totalXP' | 'gamesPlayed'>('totalEarned')

  useEffect(() => {
    const lb = getLeaderboard()
    setEntries(lb)
    const interval = setInterval(() => setEntries(getLeaderboard()), 10000)
    return () => clearInterval(interval)
  }, [])

  const sorted = [...entries].sort((a, b) => b[sortBy] - a[sortBy]).map((e, i) => ({ ...e, rank: i + 1 }))

  const rankColors: Record<number, string> = {
    1: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
    2: 'from-gray-300/15 to-gray-400/5 border-gray-400/30',
    3: 'from-amber-700/15 to-amber-800/5 border-amber-600/30',
  }

  const rankIcons: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-lg">🏆</span> Leaderboard
          </h3>
          <div className="flex gap-1">
            {[
              { key: 'totalEarned' as const, label: 'SOL' },
              { key: 'totalXP' as const, label: 'XP' },
              { key: 'gamesPlayed' as const, label: 'Games' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-2 py-0.5 text-xs rounded-md transition-colors ${
                  sortBy === opt.key
                    ? 'bg-purple-600/50 text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table header */}
      <div className="px-4 py-1.5 grid grid-cols-12 text-xs text-white/30 font-medium border-b border-white/5">
        <div className="col-span-1">#</div>
        <div className="col-span-4">Player</div>
        <div className="col-span-3 text-right">SOL Earned</div>
        <div className="col-span-2 text-right">Level</div>
        <div className="col-span-2 text-right">Games</div>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        {sorted.map((entry) => {
          const isYou = entry.playerName.includes('(You)')
          const rankColor = rankColors[entry.rank] || ''
          return (
            <div
              key={entry.rank + entry.playerName}
              className={`grid grid-cols-12 items-center px-2 py-2 rounded-lg text-xs transition-all ${
                isYou
                  ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 shadow-lg shadow-purple-500/5'
                  : rankColor
                  ? `bg-gradient-to-r ${rankColor} border`
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="col-span-1 font-bold text-white/60">
                {rankIcons[entry.rank] || `#${entry.rank}`}
              </div>
              <div className="col-span-4 truncate">
                <span className={`font-semibold ${isYou ? 'text-purple-300' : 'text-white/80'}`}>
                  {entry.playerName}
                </span>
                <div className="text-white/20 text-[10px] truncate">{entry.walletAddress}</div>
              </div>
              <div className="col-span-3 text-right font-bold text-yellow-400/90">
                {entry.totalEarned.toFixed(3)}
              </div>
              <div className="col-span-2 text-right text-white/60">
                Lv.{entry.level}
              </div>
              <div className="col-span-2 text-right text-white/40">
                {entry.gamesPlayed}
              </div>
            </div>
          )
        })}
      </div>

      {/* Reward pool info */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/30">Weekly Prize Pool</span>
          <span className="text-yellow-400 font-bold">5.00 SOL</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-white/30">Resets in</span>
          <span className="text-white/60">
            <CountdownTimer />
          </span>
        </div>
      </div>
    </div>
  )
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    function calc() {
      const now = new Date()
      const day = now.getDay()
      const daysUntilSunday = (7 - day) % 7 || 7
      const end = new Date(now)
      end.setDate(end.getDate() + daysUntilSunday)
      end.setHours(23, 59, 59, 999)
      const diff = end.getTime() - now.getTime()
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${d}d ${h}h ${m}m`)
    }
    calc()
    const interval = setInterval(calc, 60000)
    return () => clearInterval(interval)
  }, [])

  return <>{timeLeft}</>
}
