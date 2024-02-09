"use client"
import type { Prisma } from "@prisma/client"
import { AvatarImage } from "@radix-ui/react-avatar"
import { Loader2Icon, SendHorizontalIcon } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { Suspense, useEffect, useRef, useState } from "react"
import SocketIOBadge from "~/components/ui-custom/socketio-badge"
import { useToast } from "~/components/ui-custom/use-toast"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import DarkmodeButton from "~/components/ui/darkmode-button"
import { Input } from "~/components/ui/input"
import { useSocket } from "~/lib/socketio/provider"
import type { Unwrap } from "~/lib/types"
import { LoadMessages } from "~/server/actions/loadMessages"
import { sendMessages } from "~/server/actions/sendMessage"

function Board() {
    const inputRef = useRef<HTMLInputElement>(null)
    const [pressedSend, setPressedSend] = useState(false)
    const [inputContent, setInputContent] = useState("")
    const [messages, setMessages] = useState<Unwrap<typeof LoadMessages>>([])
    const { data: session, status } = useSession()
    const { socket, isConnected } = useSocket()
    const { toast } = useToast()

    useEffect(() => {
        void LoadMessages().then((data) => {
            setMessages(data)
            console.log(data)
        })
        return () => {
            setMessages([])
        }
    }, [])

    useEffect(() => {
        if (pressedSend) {
            setTimeout(() => {
                pressedSend && setPressedSend(false)
            }, 50000)
        }
        inputRef.current?.focus()
    }, [pressedSend])

    useEffect(() => {
        if (!socket || !session) {
            return
        }
        socket.on(
            "message",
            (
                data: Prisma.MessageGetPayload<{ include: { createdBy: true } }>
            ) => {
                console.log(data)
                console.log(session.user.id, data.createdBy.id)

                // check if message exists already
                if (messages.some((message) => message.id === data.id)) {
                    console.log("message exists")
                    return
                }
                // check if the message is from the current user
                if (data.createdBy.id === session?.user?.id) {
                    console.log("message is from current user")
                    return
                }

                setMessages((messages) => [...messages, data])
            }
        )

        return () => {
            socket.off("message")
        }
    }, [session, socket, messages])

    // check if session is loading
    if (status === "loading") {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center justify-center gap-5">
                    <div className="flex gap-3 text-4xl font-semibold">
                        <div className="h-20 w-20 animate-ping rounded-full bg-primary animate-duration-700"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center justify-center gap-5">
                    <div className="text-4xl font-semibold">
                        You are not signed in
                    </div>
                    <Button
                        onClick={async () => {
                            await signIn()
                        }}
                    >
                        Sign in
                    </Button>
                </div>
            </div>
        )
    }

    function sendMessage(message: string) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        sendMessages(message)
            .then((data) => {
                console.log(data)
                // check data for errors
                if (data instanceof Error) {
                    console.error(data)
                    return
                }
                if (data?.error) {
                    toast({
                        title: "Uh oh! Something went wrong!",
                        description: data.error,
                        variant: "destructive",
                    })
                    return
                }
                if (data?.ratelimit) {
                    toast({
                        title: "Uh oh! You're being Ratelimited!",
                        description: `Try again in ${Math.floor(new Date(data.ratelimit.reset).getTime() / 1000 - new Date().getTime() / 1000)} seconds.`,
                        variant: "destructive",
                    })
                    return
                }
                if (!data) {
                    return
                }

                setInputContent("")
                setMessages((messages) => [
                    ...messages,
                    data as (typeof messages)[number],
                ])
            })
            .finally(() => {
                setPressedSend(false)
            })
    }

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef<HTMLDivElement>(null)
        useEffect(() => elementRef?.current?.scrollIntoView())
        return <span ref={elementRef} />
    }

    //TODO - Fix overflow
    return (
        <div className="grid h-full w-[clamp(600px,50%,800px)] grid-rows-[auto,1fr,auto] gap-4 rounded-xl border bg-card">
            <div className="relative flex h-16 border-b text-4xl font-semibold">
                <div className="z-10 mr-5 flex w-full items-center justify-end gap-3">
                    <SocketIOBadge isConnected={isConnected} />
                    <Suspense>
                        <DarkmodeButton />
                    </Suspense>
                </div>
                <div className="absolute flex h-full w-full items-center justify-center">
                    <div>Message Board</div>
                </div>
            </div>
            <div className="flex flex-col gap-5 overflow-x-hidden overflow-y-scroll ">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="flex flex-col items-center justify-center border-b px-5 pb-3 last-of-type:border-b-0"
                    >
                        <div className="flex w-full items-center justify-between">
                            <div className="flex">
                                <Avatar className="mb-3 rounded-none">
                                    <AvatarImage
                                        // get the image from the reference user of the message
                                        src={message.createdBy.image ?? ""}
                                        width={32}
                                        height={32}
                                        alt="User Image of the message creator"
                                        className="h-8 w-8 rounded-full"
                                    />
                                    <AvatarFallback className="bg-background">
                                        {message.createdBy.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-2 flex flex-col">
                                    <span className="text-sm font-semibold">
                                        {message.createdBy.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {/* fix date getting parsed as string from api */}
                                        {new Date(
                                            message.createdAt
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-sm font-semibold">
                                    {message.content}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                <AlwaysScrollToBottom />
            </div>
            <div className="flex h-16 items-center justify-center border-t">
                <form className="flex h-full w-full content-center items-center gap-3 px-16">
                    <Input
                        type="text"
                        autoFocus
                        className="rounded-md"
                        placeholder="Enter your message"
                        disabled={pressedSend || !isConnected}
                        value={inputContent}
                        onChange={(e) => {
                            setInputContent(e.target.value)
                        }}
                        ref={inputRef}
                    />
                    <Button
                        type="submit"
                        disabled={pressedSend || !isConnected}
                        size={"icon"}
                        variant="outline"
                        onClick={() => {
                            setPressedSend(true)
                            sendMessage(inputContent)
                        }}
                    >
                        {!pressedSend && (
                            <SendHorizontalIcon className="" size={20} />
                        )}
                        {pressedSend && (
                            <Loader2Icon className="animate-spin" size={20} />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Board
