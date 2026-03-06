import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import Link from 'next/link'

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

        {/* Social Icons (X/Twitter) */}
        <div className="hidden md:flex space-x-4">
          <a href="https://x.com/i/communities/2030002380419518556" target="_blank" rel="noopener noreferrer">
            <X className="h-6 w-6 text-gray-800 cursor-pointer hover:opacity-70 transition-opacity" />
          </a>
        </div>
      </div>
    </section>
  )
}
