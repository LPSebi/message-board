import { PrismaClient } from "@prisma/client"
import { Redis } from "@upstash/redis"
import type { RedisConfigNodejs } from "@upstash/redis"

import { env } from "~/env.js"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: env.MYSQL_URL,
      },
    },
  })

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db

export const redisConfig: RedisConfigNodejs = {
  url: env.REDIS_REST_URL,
  token: env.REDIS_REST_TOKEN,
}
export const redis = new Redis(redisConfig)
