"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "~/components/theme-provider"
import { Toaster } from "~/components/ui/toaster"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>
                {children}
                <Toaster />
            </SessionProvider>
        </ThemeProvider>
    )
}
