import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Outfit, Delius } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const helveticaNow = localFont({
  src: '../public/helvetica-now-text-medium.woff2',
  variable: '--font-helvetica-now',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const delius = Delius({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-delius',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ViTech Assistant',
  description: 'AI-powered RAG assistant for finding information',
  icons: {
    icon: '/vtech-logo.png',
    apple: '/vtech-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${helveticaNow.variable} ${outfit.variable} ${delius.variable}`}>
        {children}
        <Script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  )
}
