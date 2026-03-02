import GameCard from '@/components/GameCard'
import Navbar from '@/components/Navbar'
import { GameInfo } from '../types'
import gameData from '../public/gameData.json'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blox - Play multiplayer games in your browser',
    description:
      'Play multiplayer games in your browser. Create your own games and share them with your friends.',
    openGraph: {
      title: 'Blox - Play multiplayer games in your browser',
      description:
        'Play multiplayer games in your browser. Create your own games and share them with your friends.',
      images: ['/PreviewTestGame.webp'],
      siteName: 'Blox Online',
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
