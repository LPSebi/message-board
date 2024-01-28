"use client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Loader2Icon, SendHorizontalIcon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import DarkmodeButton from "~/components/ui/darkmode-button";
import { Input } from "~/components/ui/input";
import { LoadMessages } from "~/server/actions/loadMessages";

function Board() {
  const [pressedSend, setPressedSend] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [messages, setMessages] = useState<
    {
      id: number;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      createdById: string;
      createdBy: {
        name: string | null;
        email: string | null;
        image: string | null;
      };
    }[]
  >([]);

  const exampleMessages = [
    {
      id: 1,
      content: "This is a message",
      createdAt: "2021-10-10T00:00:00.000Z",
      updatedAt: "2021-10-10T00:00:00.000Z",
      createdById: "1",
      createdBy: {
        name: "John Doe",
        email: null,
        image: null,
      },
    },
    {
      id: 2,
      content: "This is another message",
      createdAt: "2021-10-10T00:00:00.000Z",
      updatedAt: "2021-10-10T00:00:00.000Z",
      createdById: "2",
      createdBy: {
        name: "Jane Doe",
        email: null,
        image: null,
      },
    },
  ];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    LoadMessages().then((data) => {
      setMessages(data);
    });
  }, []);

  useEffect(() => {
    if (pressedSend) {
      setTimeout(() => {
        pressedSend && setPressedSend(false);
      }, 5000);
    }
  }, [pressedSend]);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-background py-5">
      <div className="grid h-full w-[clamp(600px,50%,800px)] grid-rows-[auto,1fr,auto] gap-4 rounded-xl border bg-card">
        <div className="relative flex h-16 border-b text-4xl font-semibold">
          <div className="mr-5 flex w-full items-center justify-end">
            <Suspense>
              <DarkmodeButton />
            </Suspense>
          </div>
          <div className="absolute flex h-full w-full items-center justify-center">
            <div>Message Board</div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {exampleMessages.map((message) => (
            <div
              key={message.id}
              className="flex flex-col items-center justify-center border-b px-5 pb-3"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex">
                  <Avatar className="mb-3">
                    <AvatarImage
                      src={message.createdBy.image ?? ""}
                      width={32}
                      height={32}
                      alt="User Image of the message creator"
                      className="h-8 w-8 rounded-full"
                    />
                    <AvatarFallback className="bg-background">
                      {message.createdBy.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-2 flex flex-col">
                    <span className="text-sm font-semibold">
                      {message.createdBy.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.createdAt.toLocaleString()}
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
        </div>
        <div className="flex h-16 items-center justify-center border-t">
          <div className="flex h-full w-full content-center items-center gap-3 px-16">
            <Input
              type="text"
              className="rounded-md"
              placeholder="Enter your message"
              disabled={pressedSend}
            />
            <Button
              onClick={() => {
                setPressedSend(true);
              }}
              disabled={pressedSend}
              size={"icon"}
              variant="outline"
            >
              {!pressedSend && <SendHorizontalIcon className="" size={20} />}
              {pressedSend && (
                <Loader2Icon className="animate-spin" size={20} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Board;
