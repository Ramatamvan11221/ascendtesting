"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Play, StopCircle, Clock, Users, BookOpen, Send, Flame, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import Pusher from "pusher-js";

interface Participant {
  id: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  startTime: string;
  status: string;
}

interface ChatMsg {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

const COLORS = [
  "from-pink-500/20 to-rose-500/20",
  "from-purple-500/20 to-violet-500/20",
  "from-blue-500/20 to-cyan-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-yellow-500/20 to-amber-500/20",
  "from-red-500/20 to-orange-500/20",
  "from-indigo-500/20 to-blue-500/20",
  "from-teal-500/20 to-green-500/20",
];

export function StudyRoom({ roomId, currentUserId, squadId: _squadId }: {
  roomId: string;
  currentUserId: string;
  squadId: string;
}) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isStudying, setIsStudying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [sending, setSending] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line react-hooks/purity
  const [now, setNow] = useState(Date.now());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetch(`/api/rooms/${roomId}/study`)
      .then((res) => res.json())
      .then((data) => setParticipants(Array.isArray(data) ? data : []));

    fetch(`/api/rooms/${roomId}/chat`)
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []));
  }, [roomId]);

  // Pusher subscriptions
  useEffect(() => {
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });

    const studyChannel = pusherClient.subscribe(`study-${roomId}`);
    studyChannel.bind("user-joined", (data: Participant) => {
      setParticipants((prev) => [...prev, data]);
      toast.success(`${data.user.name} joined the study room!`);
    });
    studyChannel.bind("user-left", (data: { userId: string; duration: number }) => {
      setParticipants((prev) => prev.filter((p) => p.user.id !== data.userId));
    });

    const chatChannel = pusherClient.subscribe(`room-${roomId}`);
    chatChannel.bind("new-message", (data: ChatMsg) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      studyChannel.unbind_all();
      studyChannel.unsubscribe();
      chatChannel.unbind_all();
      chatChannel.unsubscribe();
      pusherClient.disconnect();
    };
  }, [roomId]);

  // Timer
  useEffect(() => {
    if (isStudying) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStudying]);

  const handleStartStudy = async () => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/study`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      if (res.ok) {
        setIsStudying(true);
        setTimer(0);
        toast.success("Study session started!");
      }
    } catch {
      toast.error("Failed to start study session");
    }
  };

  const handleStopStudy = async () => {
    try {
      await fetch(`/api/rooms/${roomId}/study`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      });
      setIsStudying(false);
      toast.success(`Study session ended! ${formatTime(timer)}`);
    } catch {
      toast.error("Failed to end study session");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await fetch(`/api/rooms/${roomId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      setInput("");
    } catch {
      toast.error("Failed to send");
    }
    setSending(false);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const getElapsed = (startTime: string) => {
    return Math.floor((now - new Date(startTime).getTime()) / 1000);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-16 w-16 rounded-2xl flex items-center justify-center",
              isStudying ? "bg-green-500/20" : "glass"
            )}>
              {isStudying ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Flame className="h-8 w-8 text-green-400" />
                </motion.div>
              ) : (
                <Timer className="h-8 w-8 text-neutral-500" />
              )}
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-50 font-mono">
                {formatTime(timer)}
              </p>
              <p className="text-xs text-neutral-500">
                {isStudying ? "Studying..." : "Ready to study"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isStudying ? (
              <Button onClick={handleStartStudy} className="bg-green-500 hover:bg-green-600 text-white font-semibold">
                <Play className="mr-2 h-4 w-4" />
                Start Studying
              </Button>
            ) : (
              <Button onClick={handleStopStudy} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <StopCircle className="mr-2 h-4 w-4" />
                Stop
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {participants.map((p, i) => {
                const colorIndex = i % COLORS.length;
                const elapsed = getElapsed(p.startTime);

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={cn(
                      "p-4 rounded-2xl bg-linear-to-br border border-white/5 flex flex-col items-center text-center gap-3",
                      COLORS[colorIndex]
                    )}
                  >
                    <Avatar className="h-14 w-14 ring-2 ring-white/10">
                      <AvatarFallback className="text-lg font-semibold bg-white/10 text-white">
                        {p.user.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-200 truncate">
                        {p.user.name}
                        {p.user.id === currentUserId && " (You)"}
                      </p>
                      <p className="text-xs text-neutral-400 flex items-center justify-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(elapsed)}
                      </p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px]">
                      <Flame className="h-2 w-2 mr-1" />
                      Studying
                    </Badge>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {participants.length === 0 && !isStudying && (
              <div className="col-span-full text-center py-20">
                <BookOpen className="h-12 w-12 text-neutral-700 mx-auto mb-4" />
                <p className="text-neutral-500">No one is studying right now.</p>
                <p className="text-neutral-600 text-sm mt-1">
                  Click Start Studying to begin!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-80 border-l border-white/5 flex flex-col">
        <div className="p-3 border-b border-white/5">
          <p className="text-sm font-medium text-neutral-400 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Study Chat
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarFallback className="text-[10px] bg-indigo-500/20 text-indigo-400">
                  {msg.user.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs">
                  <span className="font-medium text-neutral-300">{msg.user.name}</span>
                  <span className="text-neutral-500 ml-2">{msg.content}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="p-3 border-t border-white/5 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chat..."
            className="bg-white/5 border-white/10 text-neutral-50 h-9 text-sm rounded-lg"
            disabled={sending}
          />
          <Button type="submit" disabled={!input.trim() || sending} size="icon" className="h-9 w-9 bg-indigo-500 hover:bg-indigo-600 rounded-lg shrink-0">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}