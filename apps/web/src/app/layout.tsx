import { Geist_Mono, Inter } from 'next/font/google'

import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { QueryClientContext } from '@/contexts/query-client.context'
import { AuthProviderContext } from '@/contexts/auth.context'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        inter.variable
      )}
    >
      <body>
        <QueryClientContext>
          <AuthProviderContext>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProviderContext>
        </QueryClientContext>
      </body>
    </html>
  )
}
