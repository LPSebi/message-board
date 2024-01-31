import { Client } from "@planetscale/database"
import { PrismaPlanetScale } from "@prisma/adapter-planetscale"
import { PrismaClient } from "@prisma/client"
import { Redis } from "@upstash/redis"
import type { RedisConfigNodejs } from "@upstash/redis"

import { env } from "~/env.js"

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const client = new Client({ url: env.DATABASE_URL })

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
        adapter: new PrismaPlanetScale(client),
    })

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db

export const redisConfig: RedisConfigNodejs = {
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
}
export const redis = new Redis(redisConfig)
