import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';

import { ModalProvider } from "@/providers/admin/modal-provider";
import { ToasterProvider } from "@/providers/admin/toast-provider";
import { ThemeProvider } from "@/providers/admin/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | E-Comm',
    default: 'Home | E-Comm',
  },
  description: "This is an e-comm app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToasterProvider />
          <ModalProvider />
          {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
