import { useState, useCallback } from "react";

/**
 * Custom hook for managing chat input state
 * Handles input value, submission, and validation
 */
export function useChatInput() {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const clearInput = useCallback(() => {
    setInput("");
  }, []);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  const canSubmit = useCallback(() => {
    return input.trim().length > 0 && !isComposing;
  }, [input, isComposing]);

  return {
    input,
    setInput: handleInputChange,
    clearInput,
    handleCompositionStart,
    handleCompositionEnd,
    canSubmit,
    isComposing,
  };
}
