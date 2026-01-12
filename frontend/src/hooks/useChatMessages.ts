import { useState } from "react";
import { ChatMessage } from "@/lib/types";

/**
 * Custom hook for managing chat messages state
 * Provides methods to add, remove, and manage messages
 */
export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const removeLastMessage = () => {
    setMessages((prev) => prev.slice(0, -1));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const updateLastMessage = (content: string) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;
      const last = newMessages[lastIndex];
      if (last) {
        newMessages[lastIndex] = { ...last, content };
      }
      return newMessages;
    });
  };

  return {
    messages,
    isLoading,
    error,
    setIsLoading,
    setError,
    addMessage,
    removeLastMessage,
    clearMessages,
    updateLastMessage,
    setMessages,
  };
}
