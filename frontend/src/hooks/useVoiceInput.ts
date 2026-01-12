"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseVoiceInputReturn {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

/**
 * Custom hook for voice input using Web Speech API
 * Provides speech-to-text functionality for voice commands
 */
export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Check browser support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);

        // Initialize speech recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        // Handle results
        recognition.onresult = (event: any) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);
        };

        // Handle errors
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        // Handle end
        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
        setError("Speech recognition is not supported in this browser");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition is not supported");
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        setError(null);
        setTranscript("");
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting recognition:", err);
        setError("Failed to start voice recognition");
      }
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
