export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex h-screen w-screen items-center justify-center bg-background py-5">
            {children}
        </main>
    )
}
