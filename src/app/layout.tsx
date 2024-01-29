import { Inter } from "next/font/google"
import Providers from "~/lib/providers"
import "~/styles/globals.css"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata = {
    title: "Temporary Message Board",
    description: "A message board that resets every week.",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`font-sans ${inter.variable}`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
