'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@/lib/solana/WalletContext'
import {
  Quest,
  getQuests,
  claimQuestReward,
  validateRewardClaim,
  queueReward,
  xpForNextLevel,
} from '@/lib/solana/quests'

export default function QuestPanel({ onRewardClaimed }: { onRewardClaimed?: () => void }) {
  const { wallet, playerStats, refreshStats } = useWallet()
  const [quests, setQuests] = useState<Quest[]>([])
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'achievement'>('daily')
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const loadQuests = useCallback(() => {
    setQuests(getQuests())
  }, [])

  useEffect(() => {
    loadQuests()
    const interval = setInterval(loadQuests, 5000)
    return () => clearInterval(interval)
  }, [loadQuests])

  const handleClaim = async (questId: string) => {
    if (!wallet?.publicKey) {
      setToast('Connect your wallet first!')
      setTimeout(() => setToast(null), 3000)
      return
    }

    const validation = validateRewardClaim(questId, wallet.publicKey)
    if (!validation.valid) {
      setToast(validation.reason || 'Validation failed')
      setTimeout(() => setToast(null), 3000)
      return
    }

    setClaimingId(questId)
    // Simulate network delay for UX
    await new Promise((r) => setTimeout(r, 800))

    const reward = claimQuestReward(questId)
    if (reward) {
      queueReward({
        amount: reward.sol,
        type: 'quest_complete',
        message: `Quest reward: +${reward.sol} SOL, +${reward.xp} XP`,
      })
      refreshStats()
      loadQuests()
      onRewardClaimed?.()
      setToast(`Claimed ${reward.sol} SOL + ${reward.xp} XP!`)
    } else {
      setToast('Failed to claim reward')
    }
    setClaimingId(null)
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = quests.filter((q) => q.type === activeTab)
  const completedCount = filtered.filter((q) => q.status === 'claimed').length
  const totalCount = filtered.length
  const levelProgress = xpForNextLevel(playerStats.totalXP)

  const tabs: { key: 'daily' | 'weekly' | 'achievement'; label: string; icon: string }[] = [
    { key: 'daily', label: 'Daily', icon: '📅' },
    { key: 'weekly', label: 'Weekly', icon: '📆' },
    { key: 'achievement', label: 'Achievements', icon: '🏆' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Level Bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between text-xs text-white/60 mb-1">
          <span>Level {playerStats.level}</span>
          <span>{levelProgress.progress}/{levelProgress.needed} XP</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((levelProgress.progress / levelProgress.needed) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-white border-b-2 border-purple-400'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Progress summary */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-white/50">
        <span>{completedCount}/{totalCount} completed</span>
        <span className="text-yellow-400">{playerStats.totalEarned.toFixed(4)} SOL earned</span>
      </div>

      {/* Quest list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {filtered.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            isClaiming={claimingId === quest.id}
            onClaim={handleClaim}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-white/30 text-sm py-8">No quests available</div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  )
}

function QuestCard({
  quest,
  isClaiming,
  onClaim,
}: {
  quest: Quest
  isClaiming: boolean
  onClaim: (id: string) => void
}) {
  const progress = Math.min((quest.progress / quest.target) * 100, 100)
  const isClaimed = quest.status === 'claimed'
  const isCompleted = quest.status === 'completed'

  return (
    <div
      className={`relative rounded-xl p-3 transition-all duration-200 ${
        isClaimed
          ? 'bg-white/5 opacity-60'
          : isCompleted
          ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 shadow-lg shadow-purple-500/10'
          : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl mt-0.5">{quest.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-semibold ${isClaimed ? 'text-white/40 line-through' : 'text-white'}`}>
              {quest.title}
            </h4>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-yellow-400 font-bold">+{quest.rewardSOL}</span>
              <span className="text-yellow-400/60">SOL</span>
            </div>
          </div>
          <p className="text-xs text-white/40 mt-0.5">{quest.description}</p>

          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isCompleted || isClaimed
                    ? 'bg-green-400'
                    : 'bg-gradient-to-r from-purple-500 to-cyan-400'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-white/40 tabular-nums min-w-[3rem] text-right">
              {quest.progress >= quest.target ? quest.target : quest.progress}/{quest.target}
            </span>
          </div>

          {/* Claim button */}
          {isCompleted && !isClaimed && (
            <button
              onClick={() => onClaim(quest.id)}
              disabled={isClaiming}
              className="mt-2 w-full py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              {isClaiming ? (
                <>
                  <span className="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full" />
                  Claiming...
                </>
              ) : (
                <>Claim Reward</>
              )}
            </button>
          )}
          {isClaimed && (
            <div className="mt-2 text-xs text-green-400/60 font-medium text-center">Claimed</div>
          )}
        </div>
      </div>
    </div>
  )
}
