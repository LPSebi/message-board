import { Badge } from "../ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip"

export default function SocketIOBadge({
    isConnected,
}: {
    isConnected: boolean
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="flex items-center justify-center">
                    <Badge variant={isConnected ? "default" : "destructive"}>
                        {isConnected
                            ? "Live: Realtime Updates"
                            : "Reconnecting..."}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    {isConnected
                        ? "Live: You are receiving new messages in realtime!"
                        : "Disconnected: Reconnecting to server!"}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
