import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import WalletButton from './solana/WalletButton'

export default function Navbar() {
  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 py-4">
          <Image
            src="/LogoFlat.png"
            alt="Logo"
            width={50}
            height={50}
            className="transition-transform duration-300 hover:scale-110 hover:opacity-80 hover:rotate-180 rounded-xl shadow-md"
          />
          <h2 className="text-3xl font-bold leading-none text-black select-none transition-opacity duration-300 hover:opacity-80">
            <Link href="/">
              NotBlox<span className="text-2xl">.fun</span>
            </Link>
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Solana Wallet */}
          <WalletButton />

          {/* Social Icons (X/Twitter) */}
          <div className="hidden md:flex space-x-4">
            <a href="https://x.com/i/communities/2030002380419518556" target="_blank" rel="noopener noreferrer">
              <svg 
                className="h-6 w-6 text-gray-800 cursor-pointer hover:opacity-70 transition-opacity" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                aria-label="X (Twitter)"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
