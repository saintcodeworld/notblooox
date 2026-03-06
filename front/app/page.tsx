import GameCard from '@/components/GameCard'
import Navbar from '@/components/Navbar'
import { GameInfo } from '../types'
import gameData from '../public/gameData.json'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NotBlox - Play & Earn Solana | Multiplayer Browser Games',
    description:
      'Play multiplayer games in your browser and earn Solana (SOL) crypto rewards. Complete quests, climb leaderboards, and trade items.',
    openGraph: {
      title: 'NotBlox - Play & Earn Solana | Multiplayer Browser Games',
      description:
        'Play multiplayer games in your browser and earn Solana (SOL) crypto rewards. Complete quests, climb leaderboards, and trade items.',
      images: ['/PreviewTestGame.webp'],
      siteName: 'NotBlox.fun',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@iercan_',
      creator: '@iercan_',
    },
  }
}

export default async function Home() {
  const games = gameData as GameInfo[]
  return (
    <div className="space-y-8 flex flex-col items-center px-4 container">
      <Navbar />

      {/* Earn-to-Play Hero Banner */}
      <section className="w-full">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950 p-8 md:p-12 shadow-2xl border border-purple-500/10">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute top-8 right-12 text-5xl opacity-20 select-none">💎</div>
            <div className="absolute bottom-6 left-16 text-4xl opacity-15 select-none">⚡</div>
            <div className="absolute top-1/2 right-1/4 text-3xl opacity-10 select-none">🪙</div>
          </div>

          <div className="relative flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/20 rounded-full px-4 py-1.5 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-purple-200 font-medium">Powered by Solana</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              Play Games.{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                Earn SOL.
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-lg">
              Complete daily quests, climb the leaderboard, and earn real <span className="text-yellow-400 font-semibold">Solana</span> rewards — just by playing your favorite browser games.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-2">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-5 py-3 border border-white/5">
                <span className="text-2xl">📜</span>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">Daily Quests</div>
                  <div className="text-white/40 text-xs">Earn up to 0.007 SOL/day</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-5 py-3 border border-white/5">
                <span className="text-2xl">🏆</span>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">Leaderboard</div>
                  <div className="text-white/40 text-xs">5 SOL weekly prize pool</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-5 py-3 border border-white/5">
                <span className="text-2xl">🏪</span>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">Marketplace</div>
                  <div className="text-white/40 text-xs">Buy skins, trails & boosts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {games &&
          games.map((game, index) => (
            <div
              className={`col-span-1 ${
                // Only make the last item span full width when total count is odd
                index === games.length - 1 && games.length % 2 !== 0 ? 'md:col-span-2' : ''
              }`}
              key={index}
            >
              <GameCard {...game} />
            </div>
          ))}
      </div>

    </div>
  )
}
