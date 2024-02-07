import { type NextResponse } from "next/server"
import type { LoadMessages } from "~/server/actions/loadMessages"
import type { NextApiResponseServerIO } from "./types"
import { Unwrap } from "~/lib/types"

export const config = {
    api: { bodyParser: true },
}

export default function sendIOMessage(
    req: NextResponse & {
        body?: {
            content: Unwrap<typeof LoadMessages>[0]
        }
    }, // Update the type of req to include the body property with the correct type
    res: NextApiResponseServerIO
) {
    if (!res.socket.server.io) {
        return "err"
    }
    console.log("req", req)
    if (!req.body) {
        console.log("no body")
        return "err"
    }

    console.log("req.body.content", req.body.content)
    res.socket.server.io.emit("message", req.body.content)
    res.end()
}
