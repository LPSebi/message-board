"use server"
import { getServerSession } from "next-auth"
import "server-only"
import { db } from "../db"
import { authOptions } from "../auth"

export async function sendMessages(message: string) {
    const session = await getServerSession(authOptions)
    const user = session?.user
    console.log(user)
    console.log(session)

    if (!user) {
        throw new Error("You must be signed in to send messages")
    }
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
