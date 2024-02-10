import { useTheme } from "next-themes"
import { Toaster as SonnerToaster } from "sonner"

export default function Toaster() {
    const { resolvedTheme } = useTheme()
    return (
        <SonnerToaster
            richColors
            // expand
            theme={resolvedTheme === "dark" ? "dark" : "light" || "system"}
        />
    )
}
