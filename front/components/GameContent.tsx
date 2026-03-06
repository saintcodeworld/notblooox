// components/GameContent.tsx
'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import GamePlayer from '@/components/GamePlayer'
import { GameInfo } from '@/types'
import gameData from '../public/gameData.json'
import { MiniGameCard } from './GameCard'
import Navbar from './Navbar'
import { trackGamePlayed, trackPlayTime, getQuests, getPlayerStats } from '@/lib/solana/quests'
import { useWallet } from '@/lib/solana/WalletContext'

export default function GameContent({ gameInfo }: { gameInfo: GameInfo }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerName, setPlayerName] = useState<string>('')

  // Load player name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('playerName')
    if (savedName) {
      setPlayerName(savedName)
    }
  }, [])

  const handlePlayClick = () => {
    // Save player name to localStorage
    if (playerName.trim()) {
      localStorage.setItem('playerName', playerName.trim())
    }
    trackGamePlayed()
    setIsPlaying(true)
  }

  // Track play time every 30 seconds while playing
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      trackPlayTime(30)
    }, 30000)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <>
      {isPlaying ? (
        <GamePlayer {...gameInfo} playerName={playerName} />
      ) : (
        <div className="px-4 container mx-auto">
          <Navbar />
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            {/* Image Section - Larger and Clickable */}
            <div className="lg:w-2/3 cursor-pointer" onClick={handlePlayClick}>
              <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300  ">
                <img
                  src={gameInfo.imageUrl}
                  alt={`${gameInfo.title} cover`}
                  className="w-full h-64 md:h-[400px] object-cover transform transition-transform duration-300 group-hover:scale-105"
                />

                {/* Online Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center space-x-2 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div> {/* Green dot */}
                  <span className="text-sm font-medium text-gray-800">Online</span>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent" />
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/10 rounded-full p-4 backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section - Smaller */}
            <div className="lg:w-1/3 flex flex-col justify-center space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{gameInfo.title}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{gameInfo.metaDescription}</p>
              <div className="flex flex-col space-y-4">
                {/* Player Name Input */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="playerName" className="text-sm font-medium text-gray-700">
                    Your Player Name
                  </label>
                  <input
                    type="text"
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <button
                  onClick={handlePlayClick}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-block text-center shadow-lg hover:shadow-xl"
                >
                  Play Now →
                </button>
              </div>
            </div>
          </div>
          {/* Earn-to-Play Solana Section */}
          <EarnToPlayBanner />

          {/* Related Games */}
          <section className="w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4 sm:px-0">More Games</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {gameData.map((game) => (
                <MiniGameCard {...game} key={game.slug} />
              ))}
            </div>
          </section>
          {/* Markdown Content */}
          <section className="w-full mt-12 bg-white p-4 md:p-8 rounded-2xl drop-shadow-sm border border-gray-200">
            <div className="prose max-w-none">
              <ReactMarkdown>{gameInfo.markdown}</ReactMarkdown>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

function EarnToPlayBanner() {
  const stats = getPlayerStats()
  const quests = getQuests()
  const activeQuests = quests.filter((q) => q.status === 'active' || q.status === 'completed')
  const completedToday = quests.filter((q) => q.type === 'daily' && q.status === 'claimed').length

  return (
    <section className="w-full mb-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-violet-900 p-6 md:p-8 shadow-xl border border-purple-500/20">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-6xl">💎</div>
          <div className="absolute bottom-4 left-12 text-4xl">⚡</div>
          <div className="absolute top-1/2 right-1/3 text-3xl">🪙</div>
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <h2 className="text-2xl md:text-3xl font-black text-white">Earn SOL While You Play</h2>
            </div>
            <p className="text-purple-200/80 text-sm md:text-base max-w-lg">
              Complete quests, climb the leaderboard, and earn <span className="text-yellow-400 font-bold">Solana (SOL)</span> rewards.
              Connect your wallet and start earning crypto just by playing!
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <span className="text-yellow-400 font-bold text-sm">{stats.totalEarned.toFixed(4)} SOL</span>
                <span className="text-white/40 text-xs">earned</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <span className="text-cyan-400 font-bold text-sm">Lv.{stats.level}</span>
                <span className="text-white/40 text-xs">{stats.totalXP} XP</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <span className="text-green-400 font-bold text-sm">{completedToday}/4</span>
                <span className="text-white/40 text-xs">daily quests</span>
              </div>
              {stats.dailyStreak > 0 && (
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                  <span className="text-orange-400 font-bold text-sm">🔥 {stats.dailyStreak}</span>
                  <span className="text-white/40 text-xs">day streak</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="text-center bg-black/30 rounded-xl px-6 py-4 border border-white/10">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Active Quests</div>
              <div className="text-3xl font-black text-white">{activeQuests.length}</div>
              <div className="text-xs text-purple-300/60 mt-0.5">rewards waiting</div>
            </div>
          </div>
        </div>

        {/* Active quest previews */}
        {activeQuests.length > 0 && (
          <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeQuests.slice(0, 4).map((quest) => (
              <div
                key={quest.id}
                className={`rounded-xl p-3 border transition-all ${
                  quest.status === 'completed'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{quest.icon}</span>
                  <span className="text-xs font-bold text-white truncate">{quest.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        quest.status === 'completed' ? 'bg-green-400' : 'bg-purple-400'
                      }`}
                      style={{ width: `${Math.min((quest.progress / quest.target) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-yellow-400 font-semibold">+{quest.rewardSOL} SOL</span>
                </div>
                {quest.status === 'completed' && (
                  <div className="text-[10px] text-green-400 font-medium mt-1">Ready to claim in-game!</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
