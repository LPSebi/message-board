import { type Server as NetServer } from "http"
import { type NextResponse } from "next/server"
import { Server as ServerIO } from "socket.io"
import type { NextApiResponseServerIO } from "./types"

export const config = {
    api: { bodyParser: false },
}

export default function ioHandler(
    req: NextResponse,
    res: NextApiResponseServerIO
) {
    if (!res.socket.server.io) {
        const path = "/api/socket/io"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        const httpServer: NetServer = res.socket.server as any
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const io = new ServerIO(httpServer, {
            path,
            addTrailingSlash: false,
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        res.socket.server.io = io
    }
    console.log("ioHandler", res.socket.server.io)
    console.log(res)
    res.end()
}
