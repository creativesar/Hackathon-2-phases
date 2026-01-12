"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { PaperAirplaneIcon, ArrowPathIcon, SparklesIcon, MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useTranslations } from "next-intl";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onCompositionStart?: () => void;
  onCompositionEnd?: () => void;
  onFileAttach?: (files: File[]) => void;
}

/**
 * ChatInput Component
 * Enhanced dark theme input with advanced animations, multiline support, and voice input
 */
export default function ChatInput({
  value,
  onChange,
  onSubmit,
  onClear,
  isLoading = false,
  disabled = false,
  placeholder,
  onCompositionStart,
  onCompositionEnd,
  onFileAttach,
}: ChatInputProps) {
  const t = useTranslations("HomePage");
  const [isComposing, setIsComposing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isFormattingMenuOpen, setIsFormattingMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice input hook
  const {
    isListening,
    transcript,
    isSupported: isVoiceSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput();

  // Update input value when transcript changes
  useEffect(() => {
    if (transcript) {
      onChange(transcript);
    }
  }, [transcript, onChange]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  // Handle file attachment
  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);

      if (onFileAttach) {
        onFileAttach(newFiles);
      }
    }
  };

  // Insert formatting at cursor position
  const insertFormatting = (format: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = value.substring(start, end);
    let newText = '';

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        break;
      case 'link':
        newText = `[${selectedText}](url)`;
        break;
      default:
        newText = selectedText;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Set cursor position after insertion
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPosition = start + newText.length;
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        textareaRef.current.focus();
      }
    }, 0);

    setIsFormattingMenuOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      if (value.trim() && !isLoading && !disabled) {
        onSubmit();
      }
    }
  };

  const handleSubmit = () => {
    if (value.trim() && !isLoading && !disabled) {
      onSubmit();
      resetTranscript();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative bg-white/[0.04] backdrop-blur-xl border-t border-white/15 p-4 animate-fade-in-up hover:bg-white/[0.05] hover:border-white/[0.20] transition-all duration-300 shadow-lg" role="form" aria-label="Chat Input Form">
      <div className="relative max-w-4xl mx-auto">
        {/* Voice error message */}
        {voiceError && (
          <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in" role="alert" aria-live="polite">
            {voiceError}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex gap-2 items-end" role="form">
          {/* Attachment and formatting toolbar */}
          <div className="flex flex-col gap-1">
            {/* Formatting buttons */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFormattingMenuOpen(!isFormattingMenuOpen)}
                className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title={t("chat.formattingOptions")}
                aria-label={t("chat.formattingOptions")}
                aria-expanded={isFormattingMenuOpen}
                aria-haspopup="true"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsFormattingMenuOpen(!isFormattingMenuOpen);
                  } else if (e.key === 'Escape' && isFormattingMenuOpen) {
                    setIsFormattingMenuOpen(false);
                  }
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.346l.346-2a2 2 0 00-2-2H9a2 2 0 00-2 2l.346 2H7a2 2 0 00-2 2v4a2 2 0 002 2zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.346l.346-2a2 2 0 00-2-2H9a2 2 0 00-2 2l.346 2H7a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Formatting dropdown menu */}
              {isFormattingMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-40 bg-white/[0.08] backdrop-blur-lg border border-white/15 rounded-lg shadow-xl z-10 p-2">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => insertFormatting('bold')}
                      className="px-3 py-2 text-xs text-white/80 hover:bg-white/10 rounded text-left"
                      title={t("chat.bold") + " (Ctrl+B)"}
                      aria-label={t("chat.bold")}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          insertFormatting('bold');
                        } else if (e.key === 'Escape') {
                          setIsFormattingMenuOpen(false);
                        }
                      }}
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('italic')}
                      className="px-3 py-2 text-xs text-white/80 hover:bg-white/10 rounded text-left"
                      title={t("chat.italic") + " (Ctrl+I)"}
                      aria-label={t("chat.italic")}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          insertFormatting('italic');
                        } else if (e.key === 'Escape') {
                          setIsFormattingMenuOpen(false);
                        }
                      }}
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('code')}
                      className="px-3 py-2 text-xs text-white/80 hover:bg-white/10 rounded text-left"
                      title={t("chat.code") + " (Ctrl+E)"}
                      aria-label={t("chat.code")}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          insertFormatting('code');
                        } else if (e.key === 'Escape') {
                          setIsFormattingMenuOpen(false);
                        }
                      }}
                    >
                      <code>&lt;/&gt;</code>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('link')}
                      className="px-3 py-2 text-xs text-white/80 hover:bg-white/10 rounded text-left"
                      title={t("chat.link") + " (Ctrl+K)"}
                      aria-label={t("chat.link")}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          insertFormatting('link');
                        } else if (e.key === 'Escape') {
                          setIsFormattingMenuOpen(false);
                        }
                      }}
                    >
                      {t("chat.link")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* File attachment button */}
            <label
              className="cursor-pointer p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title={t("chat.attachFiles")}
              aria-label={t("chat.attachFiles")}
            >
              <input
                type="file"
                multiple
                onChange={handleFileAttachment}
                className="hidden"
                title={t("chat.attachFiles")}
                aria-label={t("chat.attachFiles")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Trigger the file input
                    (e.target as HTMLInputElement).click();
                  }
                }}
              />
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828L15.172 7zm-6.586 6.586a2 2 0 11-2.828-2.828l6.586-6.586a2 2 0 112.828 2.828l-6.586 6.586z" />
              </svg>
            </label>
          </div>

          {/* Textarea field with enhanced styling */}
          <div className="relative flex-1 group">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => {
                setIsComposing(true);
                onCompositionStart?.();
              }}
              onCompositionEnd={() => {
                setIsComposing(false);
                onCompositionEnd?.();
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isListening ? t("chat.listening") : (placeholder || t("chat.typePlaceholder"))}
              disabled={disabled || isLoading}
              rows={1}
              className="
                relative w-full px-3 py-2.5 rounded-lg
                bg-white/[0.04] backdrop-blur
                text-white placeholder:text-white/40
                border border-white/10
                focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/25
                focus:bg-white/[0.06]
                hover:bg-white/[0.05] hover:border-white/15
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
                outline-none
                resize-none
                min-h-[44px]
                max-h-[200px]
                shadow-sm
              "
              aria-label="Type your message"
              aria-describedby={value.length > 0 ? "character-count" : undefined}
            />

            {/* Character counter - shows when typing */}
            {value.length > 0 && !isLoading && !isListening && (
              <div id="character-count" className="absolute right-3 top-2 text-xs animate-fade-in" aria-live="polite">
                <span className={`font-medium transition-colors duration-300 ${
                  value.length > 1800 ? 'text-red-400' :
                  value.length > 1500 ? 'text-amber-400' :
                  'text-white/40'
                }`}>
                  {value.length}/2000
                </span>
              </div>
            )}

            {/* Listening indicator */}
            {isListening && (
              <div className="absolute right-3 bottom-3 flex items-center gap-2 animate-fade-in" aria-live="polite">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </div>
                <span className="text-xs text-red-400 font-medium">{t("chat.recording")}</span>
              </div>
            )}
          </div>

          {/* Voice button */}
          {isVoiceSupported && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              disabled={disabled || isLoading}
              className={`
                group/voice relative inline-flex items-center justify-center
                p-3 rounded-lg font-semibold
                ${isListening
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 shadow-lg shadow-red-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30'
                }
                text-white
                hover:shadow-xl ${isListening ? 'hover:shadow-red-500/40' : 'hover:shadow-blue-500/40'}
                hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-100
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-lg
                transition-all duration-300
                overflow-hidden
                border border-white/20
              `}
              title={isListening ? t("chat.stopRecording") : t("chat.voiceInput")}
              aria-label={isListening ? t("chat.stopRecording") : t("chat.voiceInput")}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isLoading) {
                  e.preventDefault();
                  handleVoiceToggle();
                }
              }}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 ${isListening ? 'bg-gradient-to-r from-rose-600 to-pink-600' : 'bg-gradient-to-r from-cyan-600 to-teal-600'} opacity-0 group-hover/voice:opacity-100 transition-opacity duration-500`} />

              {/* Pulsing glow for recording */}
              {isListening && (
                <div className="absolute inset-0 bg-red-500/30 blur-xl animate-pulse" />
              )}

              {isListening ? (
                <StopIcon className="h-5 w-5 relative z-10 animate-pulse" />
              ) : (
                <MicrophoneIcon className="h-5 w-5 relative z-10 group-hover/voice:scale-110 transition-transform duration-300" />
              )}
            </button>
          )}

          {/* Submit button with enhanced animations */}
          <button
            type="submit"
            disabled={!value.trim() || isLoading || disabled}
            className="
              group/btn relative inline-flex items-center justify-center gap-2
              p-3 rounded-lg font-semibold
              bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white
              shadow-lg shadow-violet-500/30
              hover:shadow-xl hover:shadow-violet-500/40
              hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-100
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-lg
              transition-all duration-300
              overflow-hidden
              border border-white/20
            "
            aria-label={isLoading ? t("chat.sending") : t("chat.send")}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isLoading && value.trim()) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Pulsing glow */}
            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 bg-violet-500/20 blur-xl animate-pulse-glow" />

            {isLoading ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin relative z-10" />
                <span className="relative z-10">{t("chat.sending")}</span>
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-5 w-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300 relative z-10" />
              </>
            )}

            {/* Corner sparkle */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover/btn:opacity-100 animate-ping transition-opacity duration-300" />
          </button>
        </form>

        {/* Premium Footer with animated sparkle */}
        <div className="mt-3 flex items-center justify-between text-xs text-white/50 font-medium">
          <div className="flex items-center gap-2 animate-fade-in group cursor-default hover:text-white/70 transition-colors duration-300" style={{ animationDelay: '0.1s' }}>
            <SparklesIcon className="h-3 w-3 animate-pulse group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 text-violet-400" />
            <span>{t("chat.pressEnter")} • {t("chat.shiftEnterNewLine")}{isVoiceSupported && ` • ${t("chat.clickMicForVoice")}`}</span>
          </div>
          <div className="flex items-center gap-2 animate-fade-in group cursor-default hover:text-white/70 transition-colors duration-300" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse group-hover:scale-125 transition-transform duration-300" />
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="font-semibold">{t("chat.poweredBy")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
