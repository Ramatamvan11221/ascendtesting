"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Pusher from "pusher-js";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export function ChatBox({ squadId, currentUserId }: { squadId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof Pusher.prototype.subscribe> | null>(null);
  // Fetch existing messages
  useEffect(() => {
    fetch(`/api/squads/${squadId}/chat`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load messages");
        setLoading(false);
      });
  }, [squadId]);

  // Subscribe to Pusher
  useEffect(() => {
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });

    const channel = pusherClient.subscribe(`squad-${squadId}`);

    channel.bind("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    channelRef.current = channel;

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusherClient.disconnect();
    };
  }, [squadId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/squads/${squadId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });

      if (!res.ok) throw new Error("Failed to send");

      setInput("");
    } catch {
      toast.error("Failed to send message");
    }
    setSending(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-125">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-500">No messages yet. Start the conversation! 👋</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.user.id === currentUserId;
          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className={`text-xs ${isMe ? "bg-indigo-500/20 text-indigo-400" : "bg-neutral-700 text-neutral-300"}`}>
                  {msg.user.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[70%] ${isMe ? "items-end" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-neutral-500">{msg.user.name}</span>
                  <span className="text-xs text-neutral-600">{formatTime(msg.createdAt)}</span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    isMe
                      ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white rounded-tr-sm"
                      : "bg-neutral-800 text-neutral-200 rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 p-4 border-t border-neutral-800">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="bg-neutral-900 border-neutral-800 text-neutral-50 flex-1"
          disabled={sending}
        />
        <Button
          type="submit"
          disabled={!input.trim() || sending}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}