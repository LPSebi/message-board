export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex h-[100dvh] w-[100dvw] items-center justify-center bg-background py-5 bg-dot-black/[0.2] dark:bg-dot-white/[0.1]">
            {children}
        </main>
    )
}
