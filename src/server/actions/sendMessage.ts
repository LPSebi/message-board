"use server"
import { getServerSession } from "next-auth"
import { headers } from "next/headers"
import "server-only"
import { ApiPostRateLimit } from "~/lib/rate-limits"
import { authOptions } from "../auth"
import { db } from "../db"
import { env } from "~/env"
import { checkStringOnlyEmoji } from "~/lib/utils"

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

  // message limit
  if (message.length > 1000) {
    return {
      error: "Message cannot be longer than 1000 characters",
    }
  }

  // message limit for emojis
  console.log(message.length)
  if (checkStringOnlyEmoji(message) && message.length >= 20) {
    console.log(message.length)
    return {
      error: "Message only containing emojis cannot have more than 10 emojis",
    }
  }

  //SECTION - rate limit

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

  const sendIOContent = {
    ...DBMessage,
    createdBy: DBUser,
  }

  await fetch(env.NEXT_PUBLIC_SOCKET_URL + "/api/socket/sendIOMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      content: sendIOContent,
    }),
  })

  return {
    ...DBMessage,
    createdBy: DBUser,
  }
}
