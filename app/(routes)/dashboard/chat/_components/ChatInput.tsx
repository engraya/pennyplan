"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  isStreaming: boolean;
}

export default function ChatInput({ onSend, isStreaming }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = value.trim();
    if (!text || isStreaming) return;
    onSend(text);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your finances…"
          rows={1}
          disabled={isStreaming}
          className={cn(
            "w-full resize-none overflow-hidden rounded-xl border border-border bg-card px-4 py-3 text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
            "transition-all duration-200 max-h-32 disabled:opacity-60"
          )}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={!value.trim() || isStreaming}
        className="h-[46px] w-[46px] rounded-xl shrink-0"
      >
        {isStreaming
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Send className="w-4 h-4" />
        }
      </Button>
    </form>
  );
}
