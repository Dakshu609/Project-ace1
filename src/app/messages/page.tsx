"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  conversations,
  getMessagesByConversationId,
} from "@/lib/data/mock";

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const activeMessages = getMessagesByConversationId(activeId);
  const activeConversation = conversations.find((c) => c.id === activeId);

  return (
    <div className="container mx-auto flex h-[calc(100vh-8rem)] flex-col px-4 py-4 lg:px-8">
      <h1 className="mb-4 text-2xl font-bold">Messages</h1>
      <Card className="flex flex-1 overflow-hidden">
        <aside className="hidden w-80 shrink-0 border-r md:block">
          <div className="border-b p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9" />
            </div>
          </div>
          <div className="overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => setActiveId(conv.id)}
                className={cn(
                  "flex w-full gap-3 border-b p-4 text-left transition-colors hover:bg-muted/50",
                  activeId === conv.id && "bg-muted"
                )}
              >
                <div className="relative shrink-0">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      fill
                      unoptimized
                    />
                  </div>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{conv.participantName}</span>
                    {conv.unread > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          {activeConversation ? (
            <>
              <div className="flex items-center gap-3 border-b p-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={activeConversation.participantAvatar}
                    alt={activeConversation.participantName}
                    fill
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-semibold">{activeConversation.participantName}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {activeMessages.map((msg) => {
                  const isOwn = msg.senderName === "You";
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2",
                        isOwn ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {!isOwn && (
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={msg.senderAvatar}
                            alt={msg.senderName}
                            fill
                            unoptimized
                          />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                          isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t p-4">
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setMessage("");
                  }}
                >
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              Select a conversation
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
