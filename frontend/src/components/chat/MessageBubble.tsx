"use client";

import { useState } from "react";
import { ChatMessage } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SparklesIcon, CheckCircleIcon, UserCircleIcon, ClipboardDocumentIcon, TrashIcon, ArrowPathIcon, ArrowDownIcon, HandThumbUpIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import CodeBlock from "./CodeBlock";
import { useTranslations } from "next-intl";

interface MessageBubbleProps {
  message: ChatMessage;
  isLatest?: boolean;
  userName?: string;
  onDelete?: (messageId: number) => void;
  onRegenerate?: () => void;
  onReact?: (messageId: number, emoji: string) => void;
  onReply?: (messageId: number) => void;
}

/**
 * MessageBubble Component
 * Enhanced dark theme message bubble with advanced animations, reactions, and reply functionality
 */
export default function MessageBubble({ message, isLatest = false, userName, onDelete, onRegenerate, onReact, onReply }: MessageBubbleProps) {
  const t = useTranslations("HomePage");
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReaction = (emoji: string) => {
    if (message.id && onReact) {
      onReact(message.id, emoji);
    }
  };

  const handleReply = () => {
    if (message.id && onReply) {
      onReply(message.id);
    }
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 ${
        isUser ? "animate-slide-in-right" : "animate-slide-in-left"
      }`}
      role="article"
      aria-label={`${isUser ? t('chat.you') : t('chat.assistant')} message`}
      aria-roledescription="chat message"
    >
      <div
        className={`group relative max-w-[80%] rounded-2xl px-5 py-4 backdrop-blur-xl border transition-all duration-300 overflow-hidden ${
          isUser
            ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white border-violet-500/30 shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/50 hover:-translate-y-1 hover:scale-[1.02] border border-white/20"
            : "bg-white/[0.04] text-white border-white/15 hover:bg-white/[0.06] hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-1 hover:scale-[1.02] border border-white/20 shadow-lg"
        }`}
        role="group"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Focus on the first actionable element within the message bubble
            const firstActionable = e.currentTarget.querySelector('button, a, input, textarea');
            if (firstActionable) {
              (firstActionable as HTMLElement).focus();
            }
          }
        }}
      >
        {/* Animated gradient overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"
               style={{ backgroundSize: '200% 100%' }} />
        </div>

        {/* Floating particles for assistant messages */}
        {isAssistant && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-violet-400/20 rounded-full animate-float-enhanced"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                  animationDelay: `${i * 0.7}s`,
                  animationDuration: `${4 + i}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10">
          {/* Premium Message header for assistant with animated icon */}
          {isAssistant && (
            <div className="flex items-center gap-2.5 mb-3 text-sm text-white/70 animate-fade-in font-medium">
              <div className="relative">
                <SparklesIcon className="w-4 h-4 animate-pulse text-violet-400" />
                <div className="absolute inset-0 bg-violet-400/30 rounded-full blur-sm animate-pulse" />
              </div>
              <span className="font-semibold text-violet-300">{t("chat.botName")}</span>
            </div>
          )}

          {/* Premium Message header for user with animated icon */}
          {isUser && userName && (
            <div className="flex items-center gap-2.5 mb-3 text-sm text-violet-200 animate-fade-in font-medium">
              <div className="relative">
                <UserCircleIcon className="w-4 h-4 text-violet-300" />
                <div className="absolute inset-0 bg-violet-300/20 rounded-full blur-sm animate-pulse" />
              </div>
              <span className="font-semibold">{userName}</span>
            </div>
          )}

          {/* Reply indicator */}
          {message.reply_to && (
            <div className="flex items-center gap-2 mb-2 text-xs text-white/60 font-medium">
              <ArrowDownIcon className="h-3 w-3 text-violet-400" />
              <span>{t("chat.replyingTo")}</span>
            </div>
          )}

          {/* Message content with enhanced styling */}
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : undefined;
                  const value = String(children).replace(/\n$/, '');
                  const inline = !className;

                  return !inline ? (
                    <CodeBlock language={language} value={value} />
                  ) : (
                    <CodeBlock inline value={value} />
                  );
                },
                p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="mb-3 pl-5 list-disc space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="mb-3 pl-5 list-decimal space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-violet-300" {...props} />,
                em: ({ node, ...props }) => <em className="italic text-white/80" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-violet-500 pl-4 py-1 my-3 text-white/70" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Reactions */}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {Object.entries(message.reactions).map(([emoji, users]) => (
                <div
                  key={emoji}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/20 hover:border-violet-500/50"
                >
                  <span>{emoji}</span>
                  <span className="text-white/70">{users.length}</span>
                </div>
              ))}
            </div>
          )}

          {/* Premium Message action buttons - appear on hover */}
          <div className="absolute -top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1.5">
            {/* Reaction buttons */}
            <div className="flex gap-1">
              <button
                onClick={() => handleReaction('👍')}
                className="p-1.5 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                title={t("chat.like")}
                aria-label={t("chat.like")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleReaction('👍');
                  }
                }}
              >
                <HandThumbUpIcon className="h-3.5 w-3.5 text-white/80" aria-hidden="true" />
              </button>
              <button
                onClick={() => handleReaction('😊')}
                className="p-1.5 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                title={t("chat.smile")}
                aria-label={t("chat.smile")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleReaction('😊');
                  }
                }}
              >
                <FaceSmileIcon className="h-3.5 w-3.5 text-white/80" aria-hidden="true" />
              </button>
              <button
                onClick={handleReply}
                className="p-1.5 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                title={t("chat.reply")}
                aria-label={t("chat.reply")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleReply();
                  }
                }}
              >
                <ArrowDownIcon className="h-3.5 w-3.5 text-white/80" aria-hidden="true" />
              </button>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
              title={t("chat.copyMessage")}
              aria-label={t("chat.copyMessage")}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCopy();
                }
              }}
            >
              {copied ? (
                <CheckCircleIcon className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <ClipboardDocumentIcon className="h-4 w-4 text-white/80" aria-hidden="true" />
              )}
            </button>

            {/* Delete button for user messages */}
            {isUser && onDelete && message.id && (
              <button
                onClick={() => onDelete(message.id!)}
                className="p-2 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                title={t("common.delete")}
                aria-label={t("common.delete")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onDelete(message.id!);
                  }
                }}
              >
                <TrashIcon className="h-4 w-4 text-white/80 hover:text-red-400" aria-hidden="true" />
              </button>
            )}

            {/* Regenerate button for assistant messages */}
            {isAssistant && isLatest && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-2 rounded-lg bg-white/10 backdrop-blur border border-white/20 hover:bg-violet-500/20 hover:border-violet-500/50 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                title={t("chat.regenerate")}
                aria-label={t("chat.regenerate")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRegenerate();
                  }
                }}
              >
                <ArrowPathIcon className="h-4 w-4 text-white/80 hover:text-violet-400" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Premium Tool calls indicator with enhanced animations */}
          {message.tool_calls && message.tool_calls.length > 0 && (
            <div className="mt-5 pt-4 border-t border-white/15 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2.5 text-xs font-bold mb-3 text-violet-300">
                <SparklesIcon className="h-4 w-4 animate-spin-slow text-violet-400" />
                <span className="animate-gradient-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent font-semibold"
                      style={{ backgroundSize: '200% auto' }}>
                  {t("chat.toolCalls")}
                </span>
              </div>
              {message.tool_calls.map((toolCall, idx) => (
                <div
                  key={idx}
                  className="group/tool relative text-xs bg-white/5 backdrop-blur-sm rounded-xl p-3.5 mb-2.5 font-mono border border-white/15 hover:bg-white/10 hover:border-violet-500/40 transition-all duration-300 animate-scale-in overflow-hidden shadow-sm"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Premium shimmer effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover/tool:translate-x-full transition-transform duration-1500 bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />

                  <div className="relative flex items-center gap-2.5">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <div className="font-bold text-violet-300">
                      {typeof toolCall === "string"
                        ? toolCall
                        : toolCall?.tool || JSON.stringify(toolCall)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Premium Timestamp and Status with subtle animation */}
          <div
            className={`mt-3 text-xs flex items-center gap-1.5 animate-fade-in font-medium ${
              isUser
                ? "text-violet-200/80"
                : "text-white/50"
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-pulse" />
            {new Date(message.created_at || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}

            {/* Status indicator for user messages */}
            {isUser && message.status && (
              <div className="ml-1 flex items-center">
                {message.status === 'sending' && (
                  <span className="text-xs text-amber-400">{t("chat.status.sending")}</span>
                )}
                {message.status === 'sent' && (
                  <span className="text-xs text-blue-400">✓ {t("chat.status.sent")}</span>
                )}
                {message.status === 'delivered' && (
                  <span className="text-xs text-blue-400">✓✓ {t("chat.status.delivered")}</span>
                )}
                {message.status === 'read' && (
                  <span className="text-xs text-green-400">✓✓ {t("chat.status.read")}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Glow effect on hover */}
        {isUser && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 blur-xl pointer-events-none" />
        )}

        {/* Premium corner accents */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" />
        <div className="absolute bottom-2 right-2 w-1 h-1 bg-fuchsia-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  );
}

