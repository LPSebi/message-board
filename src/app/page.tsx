"use client"
import { HomeIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Spotlight } from "~/components/ui/Spotlight"
import { Button } from "~/components/ui/button"

export default function HomePage() {
    const router = useRouter()
    return (
        <div className="relative flex h-screen w-full overflow-hidden rounded-md bg-background/[0.96] antialiased bg-grid-black/[0.1] dark:bg-grid-white/[0.02] md:items-center md:justify-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
            <Spotlight
                className="-top-40 left-40 md:-top-60 md:left-[35rem]"
                fill="white"
            />
            <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
                <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
                    Message Board.
                </h1>
                <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
                    <Button onClick={() => router.push("/board")}>
                        <HomeIcon className="mr-1 p-0.5" />
                        Go to the board
                    </Button>
                </p>
            </div>
        </div>
    )
}
