type KeyValuePair<K extends keyof unknown = string, V = string> = Record<K, V>

declare module "tailwindcss/lib/util/flattenColorPalette" {
    export default function flattenColorPalette(
        colors: KeyValuePair<string, string>
    ): KeyValuePair<string, string>
}
