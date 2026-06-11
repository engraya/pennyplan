"use client";

import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { AiChatMessage } from "@/types";

interface ChatMessageProps {
  message: AiChatMessage;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 max-w-full", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md",
        isUser
          ? "bg-gradient-to-br from-primary to-violet-600"
          : "bg-gradient-to-br from-violet-500 to-fuchsia-600"
      )}>
        {isUser
          ? <User className="w-4 h-4 text-white" />
          : <Sparkles className="w-4 h-4 text-white" />
        }
      </div>

      {/* Bubble */}
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "bg-primary text-primary-foreground rounded-tr-sm"
          : "bg-card border border-border/80 rounded-tl-sm"
      )}>
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
              PennyPlan AI
            </span>
            <Badge className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold px-1 py-0 h-3.5">
              Gemini
            </Badge>
          </div>
        )}
        <p className="whitespace-pre-wrap break-words">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 ml-0.5 bg-current animate-pulse align-middle" />
          )}
        </p>
      </div>
    </div>
  );
}
