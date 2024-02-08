import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { io as ClientIO } from "socket.io-client"
import type { Socket } from "socket.io-client"
import { env } from "~/env"

type SocketContextType = {
    socket: Socket
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: {} as Socket,
    isConnected: false,
})

export function useSocket() {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const socketInstance = ClientIO(env.NEXT_PUBLIC_SOCKET_URL, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        })
        socketInstance.on("connect", () => {
            setIsConnected(true)
        })
        socketInstance.on("disconnect", () => {
            setIsConnected(false)
        })
        setSocket(socketInstance) // Update the type of the socket state variable
        return () => {
            socketInstance.disconnect()
        }
    }, [])
    console.log(socket)
    console.log(isConnected)

    if (!socket) {
        return null
    }
    return (
        <SocketContext.Provider value={{ socket: socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}
