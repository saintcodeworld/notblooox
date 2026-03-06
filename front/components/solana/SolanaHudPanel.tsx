'use client'

import { useState } from 'react'
import QuestPanel from './QuestPanel'
import Leaderboard from './Leaderboard'
import Marketplace from './Marketplace'
import PlayerStatsBar from './PlayerStatsBar'
import WalletButton from './WalletButton'

export default function SolanaHudPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'quests' | 'leaderboard' | 'marketplace'>('quests')

  const tabs: { key: typeof activeTab; label: string; icon: string }[] = [
    { key: 'quests', label: 'Quests', icon: '📜' },
    { key: 'leaderboard', label: 'Ranks', icon: '🏆' },
    { key: 'marketplace', label: 'Shop', icon: '🏪' },
  ]

  return (
    <>
      {/* Toggle button - top right area */}
      <div className="fixed top-4 right-4 z-50 pointer-events-auto flex items-center gap-2">
        <WalletButton />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg backdrop-blur-md border ${
            isOpen
              ? 'bg-purple-600/80 text-white border-purple-400/30 shadow-purple-500/20'
              : 'bg-black/50 text-white/80 border-white/10 hover:bg-black/60 hover:border-white/20'
          }`}
        >
          <span className="text-base">{isOpen ? '✕' : '💎'}</span>
          {!isOpen && <span className="hidden sm:inline">Earn</span>}
        </button>
      </div>

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[340px] z-40 pointer-events-auto transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full bg-gray-950/90 backdrop-blur-xl border-l border-white/5 flex flex-col shadow-2xl shadow-black/50">
          {/* Stats bar at top */}
          <div className="pt-16 px-3 pb-2">
            <PlayerStatsBar />
          </div>

          {/* Tab navigation */}
          <div className="flex px-3 gap-1 pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab.key
                    ? 'bg-purple-600/30 text-white border border-purple-500/20'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'quests' && <QuestPanel />}
            {activeTab === 'leaderboard' && <Leaderboard />}
            {activeTab === 'marketplace' && <Marketplace />}
          </div>
        </div>
      </div>

      {/* Backdrop overlay when panel is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 pointer-events-auto"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
