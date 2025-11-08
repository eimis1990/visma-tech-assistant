import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Visma Tech Assistant',
  description: 'AI-powered RAG assistant for finding information',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
