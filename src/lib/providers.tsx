"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "~/components/theme-provider"
import Toaster from "~/components/ui-custom/toaster"
import { SocketProvider } from "~/lib/socketio/provider"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>
                <SocketProvider>{children}</SocketProvider>
                <Toaster />
                <SpeedInsights />
            </SessionProvider>
        </ThemeProvider>
    )
}
