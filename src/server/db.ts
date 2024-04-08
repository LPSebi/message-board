import { PrismaClient } from "@prisma/client"
import { Redis } from "ioredis"

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

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const redisConn = new Redis(env.REDIS_URL)

// NOTE: Adapter for Redis upstash ratelimit
export const redis = {
  sadd: <TData>(key: string, ...members: TData[]) =>
    redisConn.sadd(key, ...members.map((m) => String(m))),
  eval: async <TArgs extends unknown[], TData = unknown>(
    script: string,
    keys: string[],
    args: TArgs
  ) =>
    redisConn.eval(
      script,
      keys.length,
      ...keys,
      ...(args ?? []).map((a) => String(a))
    ) as Promise<TData>,
  hset: async <TArgs extends unknown[], TData = unknown>(
    key: string,
    obj: Record<string, TArgs[0]>
  ) => redisConn.hset(key, obj) as Promise<TData>,
}
