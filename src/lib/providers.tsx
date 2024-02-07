"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "~/components/theme-provider"
import { Toaster } from "~/components/ui/toaster"
import { SocketProvider } from "~/lib/socketio/provider"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>
                <SocketProvider>
                    {/* <TooltipProvider> */}
                    {children}
                    {/* </TooltipProvider> */}
                </SocketProvider>
                <Toaster />
            </SessionProvider>
        </ThemeProvider>
    )
}
