import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Outfit, Delius } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from "@vercel/analytics/next"
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
  title: 'Vitech Assistant',
  description: 'AI-powered RAG assistant for finding information',
  verification: {
    google: '09323wLa6_3cpj-ivasAIdVvlTNUtLtRlh83Jje1aq4',
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
        <Analytics />
        <Script
          src="https://unpkg.com/@elevenlabs/convai-widget-embed"
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  )
}
