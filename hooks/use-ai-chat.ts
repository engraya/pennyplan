"use client";

import { useState, useCallback } from "react";
import type { AiChatMessage } from "@/types";

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export function useAiChat() {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || isStreaming) return;

    const userMessage: AiChatMessage = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setError(null);

    // Build Gemini history format from current messages + new user message
    const history: GeminiMessage[] = [...messages, userMessage].map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to connect to chat");
      }

      // Add empty model message placeholder
      setMessages((prev) => [...prev, { role: "model", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "model", content: fullText };
          return updated;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMessages((prev) => prev.filter((_, i) => i !== prev.length - 1));
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isStreaming, error, sendMessage, clearMessages };
}
