export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex h-[100dvh] w-[100dvw] items-center justify-center bg-background py-5">
            {children}
        </main>
    )
}
