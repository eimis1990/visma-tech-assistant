import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.css'

const helveticaNow = localFont({
  src: '../public/helvetica-now-text-medium.woff2',
  variable: '--font-helvetica-now',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={helveticaNow.variable}>
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
