import './globals.css'

import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { ConvexClientProvider } from './convex-client-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Async Combobox | React Single & Multi-Select',
  description:
    'Customizable async React comboboxes with search, infinite scrolling, and single or multiple selection. Built with Base UI and shadcn/ui.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <footer className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <Separator />
          <div className="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground">
            <p>
              Made by{' '}
              <a
                href="https://github.com/hieu-lai"
                className="rounded-sm underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Hieu Lai
              </a>
              .
            </p>
            <a
              href="https://github.com/hieu-lai/async-combobox"
              className="rounded-sm underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
