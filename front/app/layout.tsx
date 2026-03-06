import '@/styles/globals.css'
import { WalletProvider } from '@/lib/solana/WalletContext'

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <WalletProvider>
          <main>{children}</main>
        </WalletProvider>
      </body>
    </html>
  )
}
