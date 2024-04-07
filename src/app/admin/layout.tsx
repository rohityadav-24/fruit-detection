import { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

import { ModalProvider } from '@/providers/admin/modal-provider'
import { ToastProvider } from '@/providers/admin/toast-provider'
import { ThemeProvider } from '@/providers/admin/theme-provider'

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        <ToastProvider />
        <ModalProvider />
        {children}
      </ThemeProvider>
    </ClerkProvider>
  )
}
