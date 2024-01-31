import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "~/server/db"

export const ApiPostRateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(1, "20 s"),
    analytics: true,
    prefix: "message-board-api-post",
    ephemeralCache: new Map(),
})
