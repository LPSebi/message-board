"use server"
import { db } from "../db"

export async function LoadMessages() {
    if (!db) {
        return []
    }

    const DBmessages = await db.message.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            createdBy: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    })

    return DBmessages
}
