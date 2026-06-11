"use client";

import { useEffect, useRef } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useAiChat } from "@/hooks/use-ai-chat";

const SUGGESTIONS = [
  "How am I doing with my budgets this month?",
  "Where am I overspending?",
  "Can I afford a $500 purchase right now?",
];

export default function ChatPanel() {
  const { messages, isStreaming, error, sendMessage, clearMessages } = useAiChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-4 mb-4">
        <div>
          <h2 className="text-lg font-extrabold gradient-text-brand">Ask AI</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Powered by Google Gemini · knows your actual financial data
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-muted-foreground hover:text-destructive h-8 px-2"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-xl shadow-primary/30">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold mb-1">Your AI Finance Advisor</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Ask anything about your budgets, spending, or savings goals.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className={cn(
                    "text-left text-sm px-4 py-3 rounded-xl border border-border/80 bg-secondary/40",
                    "hover:bg-primary/8 hover:border-primary/30 hover:text-primary transition-all duration-200"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage
                key={i}
                message={msg}
                isStreaming={isStreaming && i === messages.length - 1 && msg.role === "model"}
              />
            ))}
          </>
        )}

        {error && (
          <p className="text-xs text-destructive text-center py-2">{error}</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/70 pt-4">
        <ChatInput onSend={sendMessage} isStreaming={isStreaming} />
        <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
          AI can make mistakes — verify important financial decisions independently.
        </p>
      </div>
    </div>
  );
}
