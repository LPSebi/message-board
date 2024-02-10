// server.js

import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())
// TODO: change this to only allow specified domains
// allow all origins
app.options("*", cors())

// Endpoint for sending messages via Socket.IO
app.post("/api/socket/sendIOMessage", (req, res) => {
    const io = req.socket.server.io
    const content = req.body.content

    if (!content) {
        return res.status(400).json({ error: "Content is required" })
    }

    io.emit("message", content)
    res.end()
})

// Endpoint for checking Socket.IO connection status and reconnect if necessary
app.get("/api/socket/io", (req, res) => {
    const io = req.socket.server.io
    console.log(res.socket.server.io)

    // Check if Socket.IO is initialized and connected
    if (!io) {
        console.log("Socket.io is not connected. Reconnecting...")
        const io = new Server(server, {
            path: "/api/socket/io",
            addTrailingSlash: false,
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        })
        res.socket.server.io = io
    }
    return res.end()
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
