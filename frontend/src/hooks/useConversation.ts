import { useState, useEffect } from "react";

/**
 * Custom hook for managing conversation state
 * Handles conversation ID tracking with localStorage persistence
 */
export function useConversation() {
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Load conversation ID from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem("current_conversation_id");
    if (savedId) {
      setConversationId(parseInt(savedId, 10));
    }
    setIsLoading(false);
  }, []);

  const updateConversationId = (id: number) => {
    setConversationId(id);
    localStorage.setItem("current_conversation_id", id.toString());
  };

  const clearConversation = () => {
    setConversationId(undefined);
    localStorage.removeItem("current_conversation_id");
  };

  return {
    conversationId,
    updateConversationId,
    clearConversation,
    isLoading,
  };
}
