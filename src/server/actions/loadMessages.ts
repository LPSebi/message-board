"use server"
import { db } from "../db"

export async function LoadMessages(): Promise<
    {
        createdBy: {
            name: string | null
            email: string | null
            image: string | null
        }
        id: number
        content: string
        createdAt: Date
        updatedAt: Date
        createdById: string
    }[]
> {
    if (!db) {
        return []
    }

    const DBmessages = await db.message.findMany({
        orderBy: { createdAt: "asc" },
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
