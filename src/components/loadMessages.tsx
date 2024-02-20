import Linkify from "linkify-react"
import { AlertTriangleIcon, ExternalLinkIcon } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~/components/ui/tooltip"
import type { Unwrap } from "~/lib/types"
import { checkStringOnlyEmoji } from "~/lib/utils"
import type { LoadMessages } from "~/server/actions/loadMessages"
import { Skeleton } from "./ui/skeleton"

export default function RenderMessages({
    messages,
    skeleton,
}: {
    messages: Unwrap<typeof LoadMessages>
    skeleton?: boolean
}) {
    if (skeleton) {
        return Array(20)
            .fill(0)
            .map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center justify-center break-all px-5 pt-3"
                >
                    <div className="flex w-full items-center justify-between">
                        <div className="flex">
                            <span className="relative mb-3 flex h-10 w-10 shrink-0 overflow-hidden rounded-none">
                                <Skeleton className="relative mb-3 flex aspect-square h-8 w-8 shrink-0 overflow-hidden rounded-full" />
                            </span>

                            <div className="ml-2 flex flex-col gap-0.5">
                                <Skeleton className="h-3.5 w-24 text-sm font-semibold" />
                                <Skeleton className="h-3.5 w-14 text-xs text-gray-500" />
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                            <Skeleton className="flex h-5 w-52 text-sm font-semibold" />
                        </div>
                    </div>
                </div>
            ))
    }

    return (
        <>
            {messages.map((message) => (
                <div
                    key={message.id}
                    className="flex flex-col items-center justify-center break-all px-5 pt-3"
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
                            <span
                                className={`${checkStringOnlyEmoji(message.content) ? "text-5xl" : "text-sm"} flex font-semibold`}
                            >
                                <Linkify
                                    options={{
                                        render: ({ attributes, content }) => {
                                            const { href, ...props } =
                                                attributes
                                            return (
                                                <Link
                                                    {...props}
                                                    href={href as string}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="mx-1 text-blue-500"
                                                >
                                                    <Tooltip
                                                        delayDuration={100}
                                                    >
                                                        <TooltipTrigger className="flex items-center justify-center gap-[0.10rem]">
                                                            {content}
                                                            <ExternalLinkIcon
                                                                size={14}
                                                                strokeWidth={
                                                                    2.25
                                                                }
                                                            />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="flex items-center justify-center gap-1">
                                                            <AlertTriangleIcon
                                                                size={14}
                                                                strokeWidth={
                                                                    2.25
                                                                }
                                                                color="hsl(var(--destructive))"
                                                            />
                                                            This link is not
                                                            virus scanned
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </Link>
                                            )
                                        },
                                    }}
                                >
                                    <TooltipProvider>
                                        {message.content}
                                    </TooltipProvider>
                                </Linkify>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
