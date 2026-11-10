import localFont from 'next/font/local'
import './globals.css'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import { Navbar } from '@/components/site/navbar'
import type { Metadata } from 'next'

// All fonts are self-hosted from public/fonts/: the build needs no network
// access and visitors' browsers never contact Google Fonts.
// Inter / Inter Tight are the variable (100–900 weight) Latin files.
const inter = localFont({
  src: '../public/fonts/Inter-Variable.woff2',
  weight: '100 900',
  variable: '--font-sans',
  display: 'swap',
})
const interTight = localFont({
  src: '../public/fonts/InterTight-Variable.woff2',
  weight: '100 900',
  variable: '--font-display',
  display: 'swap',
})
const jetbrainsMono = localFont({
  src: [
    { path: '../public/fonts/JetBrainsMono-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/JetBrainsMono-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: 'Stark Lab — Decoding Regulatory Logic',
  description: 'The Stark Lab integrates computational and experimental approaches to decode regulatory logic in biology.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Stark Lab — Decoding Regulatory Logic',
    description: 'The Stark Lab integrates computational and experimental approaches to decode regulatory logic in biology.',
    images: [{ url: '/og-image.png' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#050A14]`}>
        {/* Rendered once here (not per page) so it stays mounted across
            navigation and the active-link underline can slide between links. */}
        <Navbar />
        {children}
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
