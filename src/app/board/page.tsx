"use client";
import { useEffect, useState } from "react";
import { LoadMessages } from "~/server/actions/loadMessages";

function board() {
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    LoadMessages().then((data) => {
      setMessages(data);
    });
  }, []);

  return (
    <main className="bg-background flex h-screen w-screen items-center justify-center py-5">
      <div className="grid h-full w-[clamp(600px,50%,800px)] grid-rows-[auto,1fr,auto] gap-4 rounded-xl border">
        <div className="flex h-16 items-center justify-center border-b text-4xl font-semibold">
          Message Board
        </div>
        <div className="min-h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex h-16 flex-col items-center justify-center border-b"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={
                      message.createdBy.image ?? "/images/default-avatar.png"
                    }
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="ml-2 flex flex-col">
                    <span className="text-sm font-semibold">
                      {message.createdBy.name ?? message.createdBy.email}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.createdAt.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
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
          <input
            type="text"
            className="rounded-md border border-gray-300 px-4 py-2"
            placeholder="Enter your message"
          />
        </div>
      </div>
    </main>
  );
}

export default board;
