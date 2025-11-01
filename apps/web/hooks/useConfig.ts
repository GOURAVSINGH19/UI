import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type Config = {
    style?: string
    packageManager: "npm" | "yarn" | "pnpm" | "bun"
    installationType: "cli" | "manual"
    theme?: string
    radius: number
}

const configAtom = atomWithStorage<Config>("config", {
    style: "default",
    packageManager: "pnpm",
    installationType: "cli",
    theme: "zinc",
    radius: 0.5,
})

export function useConfig() {
    return useAtom(configAtom)
}