"use server"
import { getServerSession } from "next-auth"
import { headers } from "next/headers"
import "server-only"
import { ApiPostRateLimit } from "~/lib/rate-limits"
import { authOptions } from "../auth"
import { db } from "../db"

export async function sendMessages(message: string) {
    const session = await getServerSession(authOptions)
    const user = session?.user
    console.log(user)
    console.log(session)

    if (!user || !user.email) {
        throw new Error("You must be signed in to send messages")
    }

    if (message === "") {
        return {
            error: "Message cannot be empty",
        }
    }
    //SECTION - rate limit with upstash

    const ip = headers().get("x-forwarded-for")
    if (!ip) {
        throw new Error("No IP address found")
    }

    const { success, remaining, pending, limit, reset } =
        await ApiPostRateLimit.limit(ip)
    console.log(success, reset, remaining, limit, ip, await pending)

    if (!success) {
        return {
            ratelimit: {
                error: "You are sending too many messages. Please try again later.",
                reset,
            },
        }
    }

    //!SECTION

    const DBUser = await db.user.findUnique({
        where: {
            id: user.id,
        },
    })
    if (!DBUser) {
        throw new Error("You must be signed in to send messages")
    }

    const DBMessage = await db.message.create({
        data: {
            content: message,
            createdBy: {
                connect: {
                    id: DBUser.id,
                },
            },
        },
    })
    return {
        ...DBMessage,
        createdBy: DBUser,
    }
}
