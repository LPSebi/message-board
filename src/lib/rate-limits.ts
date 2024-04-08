import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "~/server/db"

export const ApiPostRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  analytics: false,
  prefix: "message-board-api-post",
  ephemeralCache: new Map(),
})
