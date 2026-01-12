"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { ChatMessage, ChatResponse, Task, UserPresence } from "@/lib/types";
import { getAuthUser, signOut } from "@/lib/auth";
import { useRouter, Link } from "@/i18n/routing";
import { useToast } from "@/components/Toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import {
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

// Custom hooks
import { useChatMessages } from "@/hooks/useChatMessages";
import { useConversation } from "@/hooks/useConversation";
import { useChatInput } from "@/hooks/useChatInput";

// ChatKit-style components
import AnimatedBackground from "@/components/chat/AnimatedBackground";
import MessageBubble from "@/components/chat/MessageBubble";
import EmptyState from "@/components/chat/EmptyState";
import ChatInput from "@/components/chat/ChatInput";
import TaskSidebar from "@/components/chat/TaskSidebar";
import ConversationSidebar from "@/components/chat/ConversationSidebar";
import ConversationAnalytics from "@/components/chat/ConversationAnalytics";
import ChatSettings from "@/components/chat/ChatSettings";

interface Conversation {
  id: number;
  title: string;
  last_message: string;
  updated_at: string;
  message_count: number;
}

/**
 * ChatInterface Component
 * Phase III: AI Chatbot - Dark theme ChatKit-style interface
 *
 * Features:
 * - Modular component architecture
 * - Custom hooks for state management
 * - Real-time task synchronization
 * - Beautiful dark animated UI matching tasks/landing pages
 * - OpenAI ChatKit-inspired design
 */
export default function ChatInterface() {
  const router = useRouter();
  const { showToast } = useToast();
  const t = useTranslations("HomePage");

  // Custom hooks for chat state
  const {
    messages,
    isLoading,
    error,
    setIsLoading,
    setError,
    addMessage,
    setMessages,
    clearMessages,
  } = useChatMessages();

  const { conversationId, updateConversationId, clearConversation, isLoading: conversationLoading } = useConversation();
  const {
    input,
    setInput,
    clearInput,
    canSubmit,
    handleCompositionStart,
    handleCompositionEnd,
  } = useChatInput();

  // User state
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Task list state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  // Conversation history loading state
  const [historyLoading, setHistoryLoading] = useState(false);

  // Scroll state
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Conversation sidebar state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Presence state
  const [usersOnline, setUsersOnline] = useState<UserPresence[]>([
    {
      id: user?.id || '',
      name: user?.name || user?.email || 'You',
      status: 'online',
      last_seen: new Date().toISOString(),
      is_typing: false
    }
  ]);

  // Analytics state
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [themeSettings, setThemeSettings] = useState({
    theme: 'dark' as 'light' | 'dark' | 'system',
    compactMode: false,
    fontSize: 'normal' as 'small' | 'normal' | 'large',
    showAvatars: true,
  });

  // Network status state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle scroll detection
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isBottom = scrollHeight - scrollTop - clientHeight < 100;

    setIsAtBottom(isBottom);
    setShowScrollButton(!isBottom && messages.length > 0);
  };

  // Auto-scroll when new messages arrive (only if already at bottom)
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: New chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
      // Ctrl/Cmd + L: Clear messages
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        handleClearMessages();
      }
      // Escape: Clear input
      if (e.key === 'Escape' && input) {
        e.preventDefault();
        clearInput();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  // Draft auto-save
  useEffect(() => {
    if (input) {
      localStorage.setItem('chat_draft', input);
    } else {
      localStorage.removeItem('chat_draft');
    }
  }, [input]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('chat_draft');
    if (savedDraft) {
      setInput(savedDraft);
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // Get authenticated user
    const authUser = getAuthUser();
    if (!authUser) {
      router.push("/signin");
      return;
    }
    setUser(authUser);

    // Fetch tasks and conversations
    fetchTasks(authUser.id);
    fetchConversations(authUser.id);

    // Monitor network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  // Effect to monitor authentication changes via storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'auth_user') {
        const authUser = getAuthUser();
        if (!authUser && user) {
          // Auth was cleared, redirect to sign in
          router.push("/signin");
        } else if (authUser && !user) {
          // User was authenticated externally
          setUser(authUser);
        } else if (authUser && user && authUser.id !== user.id) {
          // Different user logged in
          setUser(authUser);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, router]);

  // Retry failed operations when network comes back online
  useEffect(() => {
    if (isOnline && retryAttempts > 0) {
      setIsRetrying(true);
      setTimeout(() => {
        // Attempt to re-send any failed messages or re-fetch data
        if (user) {
          fetchTasks(user.id);
          fetchConversations(user.id);
        }
        setIsRetrying(false);
        setRetryAttempts(0);
      }, 1000); // Wait 1 second before retrying
    }
  }, [isOnline, retryAttempts, user]);

  // Fetch conversations
  const fetchConversations = async (userId: string) => {
    try {
      const convs = await api.getConversations(userId);
      setConversations(convs);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = async (convId: number) => {
    if (!user) return;

    // Let the `conversationId` effect load the history to avoid duplicate fetch.
    updateConversationId(convId);
    setHistoryLoading(true);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Handle conversation deletion
  const handleDeleteConversation = async (convId: number) => {
    if (!user) return;

    try {
      await api.deleteConversation(user.id, convId);
      await fetchConversations(user.id);

      // If deleted current conversation, clear it
      if (conversationId === convId) {
        clearConversation();
        clearMessages();
      }

      showToast("Conversation deleted", "success");
    } catch (err) {
      showToast("Failed to delete conversation", "error");
    }
  };

  // Handle conversation rename
  const handleRenameConversation = async (convId: number, newTitle: string) => {
    if (!user) return;

    try {
      await api.renameConversation(user.id, convId, newTitle);
      await fetchConversations(user.id);
      showToast("Conversation renamed", "success");
    } catch (err) {
      showToast("Failed to rename conversation", "error");
    }
  };

  // Handle stop generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      // Abort will be handled in the stream onError callback as AbortError.
      abortControllerRef.current.abort();
    }
  };

  // Load conversation history when conversation ID is available
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!user || !conversationId || conversationLoading) return;

      try {
        const history = await api.getConversationMessages(user.id, conversationId);
        setMessages(history);
      } catch (err) {
        console.error("Failed to load conversation history:", err);
        // If conversation not found, clear it and show message
        if (err instanceof Error && (err.message.includes("not found") || err.message.includes("404"))) {
          clearConversation();
          clearMessages();
          showToast("Conversation no longer exists", "info");
        } else {
          showToast("Failed to load conversation", "error");
        }
      } finally {
        setHistoryLoading(false);
      }
    };

    loadConversationHistory();
  }, [conversationId, user, conversationLoading]);

  // NOTE: We already auto-scroll conditionally based on `isAtBottom`.
  // Avoid forcing scroll-to-bottom on every message update.
  // (See earlier effect watching `messages` + `isLoading`.)
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  const fetchTasks = async (userId: string) => {
    try {
      setTasksLoading(true);
      const fetchedTasks = await api.getTasks(userId);
      setTasks(fetchedTasks.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
    setUser(null); // Clear the user state
    clearConversation(); // Clear conversation on logout
    showToast(t("nav.logout") + " " + t("common.success"), "info");
    router.push("/");
  };

  const handleNewChat = () => {
    clearConversation();
    clearMessages();
    showToast("New conversation started", "success");
  };

  const handleClearMessages = () => {
    if (messages.length === 0) {
      showToast("No messages to clear", "info");
      return;
    }

    // Show confirmation
    if (confirm("Are you sure you want to clear all messages from this conversation? This action cannot be undone.")) {
      clearMessages();
      showToast("Messages cleared", "success");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting.morning");
    if (hour < 17) return t("greeting.afternoon");
    return t("greeting.evening");
  };

  // Handle message submission with streaming support
  const handleSendMessage = async () => {
    if (!canSubmit() || !user) return;

    const userMessage = input.trim();
    clearInput();
    setError(null);
    setIsLoading(true);

    // Add user message to UI immediately with sending status
    const newUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
      status: 'sending',
    };
    addMessage(newUserMessage);

    // Check for network connectivity
    if (!navigator.onLine) {
      setMessages(prev => prev.map(msg =>
        msg === newUserMessage ? { ...msg, status: 'error' as const } : msg
      ));
      setError("No internet connection. Please check your network and try again.");
      setIsLoading(false);
      showToast("No internet connection", "error");
      return;
    }

    // Use streaming if available, otherwise fallback to regular
    const useStreaming = true; // Can be toggled based on user preference

    if (useStreaming) {
      // Streaming mode
      setIsStreaming(true);
      setStreamingContent("");
      abortControllerRef.current = new AbortController();

      try {
        await api.sendChatMessageStream(
          user.id,
          {
            conversation_id: conversationId,
            message: userMessage,
          },
          // onChunk
          (chunk: string) => {
            setStreamingContent((prev) => prev + chunk);
          },
          // onComplete
          async (response: ChatResponse) => {
            // Update conversation ID if this is the first message
            if (!conversationId) {
              updateConversationId(response.conversation_id);
            }

            // Update the user message status to 'sent'
            setMessages(prev => prev.map(msg =>
              msg === newUserMessage ? { ...msg, status: 'sent' } : msg
            ));

            // Add complete assistant message
            const assistantMessage: ChatMessage = {
              role: "assistant",
              content: response.response,
              tool_calls: response.tool_calls,
              created_at: new Date().toISOString(),
            };
            addMessage(assistantMessage);

            // Clear streaming state
            setIsStreaming(false);
            setStreamingContent("");
            abortControllerRef.current = null;

            // Refresh tasks and conversations
            await fetchTasks(user.id);
            await fetchConversations(user.id);
          },
          // onError
          (error: Error) => {
            // If the user clicked "Stop Generating", fetch() is aborted and will throw.
            // In that case, keep the user message and keep any partial assistant output.
            if (error.name === "AbortError") {
              // Update message status to 'delivered' if we have partial content
              setMessages(prev => prev.map(msg =>
                msg === newUserMessage ? { ...msg, status: 'delivered' } : msg
              ));

              setIsStreaming(false);
              abortControllerRef.current = null;
              setIsLoading(false);
              showToast("Generation stopped", "info");
              return;
            }

            // Check if it's a network error
            if (error.message.includes('fetch') || error.message.includes('network')) {
              setRetryAttempts(prev => prev + 1);
              setMessages(prev => prev.map(msg =>
                msg === newUserMessage ? { ...msg, status: 'error' as const } : msg
              ));

              setError("Network error occurred. Will retry when connection is restored.");
              setIsStreaming(false);
              setStreamingContent("");
              abortControllerRef.current = null;
              setInput(userMessage); // Restore input
              return;
            }

            setError(error.message);
            setIsStreaming(false);
            setStreamingContent("");
            abortControllerRef.current = null;

            // Update message status to 'error' instead of removing
            setMessages(prev => prev.map(msg =>
              msg === newUserMessage ? { ...msg, status: 'error' as const } : msg
            ));

            setInput(userMessage); // Restore input
          },
          abortControllerRef.current.signal
        );
      } catch (err) {
        // Error already handled in onError callback
      } finally {
        setIsLoading(false);
      }
    } else {
      // Regular mode (fallback)
      try {
        // Update message status to 'sent'
        setMessages(prev => prev.map(msg =>
          msg === newUserMessage ? { ...msg, status: 'sent' } : msg
        ));

        const response: ChatResponse = await api.sendChatMessage(user.id, {
          conversation_id: conversationId,
          message: userMessage,
        });

        if (!conversationId) {
          updateConversationId(response.conversation_id);
        }

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.response,
          tool_calls: response.tool_calls,
          created_at: new Date().toISOString(),
        };
        addMessage(assistantMessage);

        await fetchTasks(user.id);
        await fetchConversations(user.id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to send message";

        // Check if it's a network error
        if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
          setRetryAttempts(prev => prev + 1);
          setMessages(prev => prev.map(msg =>
            msg === newUserMessage ? { ...msg, status: 'error' as const } : msg
          ));

          setError("Network error occurred. Will retry when connection is restored.");
          setInput(userMessage);
          setIsLoading(false);
          return;
        }

        setError(errorMessage);

        // Update message status to 'error' instead of removing
        setMessages(prev => prev.map(msg =>
          msg === newUserMessage ? { ...msg, status: 'error' as const } : msg
        ));

        setInput(userMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Trigger send after setting input
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleToggleTaskComplete = async (taskId: number) => {
    if (!user) return;
    try {
      await api.toggleCompletion(user.id, taskId);
      await fetchTasks(user.id);
      showToast("Task updated", "success");
    } catch (err) {
      showToast("Failed to update task", "error");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return;
    try {
      await api.deleteTask(user.id, taskId);
      await fetchTasks(user.id);
      showToast("Task deleted", "success");
    } catch (err) {
      showToast("Failed to delete task", "error");
    }
  };

  // Handle message deletion
  const handleDeleteMessage = (messageId: number) => {
    if (confirm("Delete this message?")) {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      showToast("Message deleted", "success");
    }
  };

  // Handle regenerate response
  const handleRegenerateResponse = async () => {
    if (!user || messages.length < 2) return;

    // Get the last user message
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user");
    if (!lastUserMessage) return;

    // Remove the last assistant message
    setMessages((prev) => prev.slice(0, -1));

    // Resend the last user message
    setError(null);
    setIsLoading(true);

    try {
      const response: ChatResponse = await api.sendChatMessage(user.id, {
        conversation_id: conversationId,
        message: lastUserMessage.content,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
        tool_calls: response.tool_calls,
        created_at: new Date().toISOString(),
      };
      addMessage(assistantMessage);

      await fetchTasks(user.id);
      showToast("Response regenerated", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to regenerate response");
      showToast("Failed to regenerate response", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reacting to a message
  const handleReactToMessage = (messageId: number, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || {};
        const userReactions = reactions[emoji] || [];

        // Toggle user's reaction (add if not present, remove if present)
        const updatedReactions = {
          ...reactions,
          [emoji]: userReactions.includes(user?.id || '')
            ? userReactions.filter(id => id !== user?.id)
            : [...userReactions, user?.id || '']
        };

        // Remove empty emoji arrays
        const emojiReactions = updatedReactions[emoji];
        if (emojiReactions && emojiReactions.length === 0) {
          delete updatedReactions[emoji];
        }

        return { ...msg, reactions: updatedReactions };
      }
      return msg;
    }));

    showToast(`${t("chat.reactionAdded")} ${emoji}`, "success");
  };

  // Handle replying to a message
  const handleReplyToMessage = (messageId: number) => {
    // Find the message being replied to
    const replyToMessage = messages.find(msg => msg.id === messageId);
    if (replyToMessage) {
      // Set the input field to indicate we're replying to a message
      setInput(`@${replyToMessage.role === 'user' ? (user?.name || user?.email) : t('chat.assistant')}: `);

      // Scroll to the input field
      setTimeout(() => {
        const inputElement = document.querySelector('textarea');
        inputElement?.focus();
      }, 100);
    }
  };

  // Export conversation
  const handleExportConversation = () => {
    if (messages.length === 0) {
      showToast("No messages to export", "info");
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `taskflow-chat-${timestamp}.md`;

    // Format messages as markdown
    let markdown = `# TaskFlow Chat Export\n\n`;
    markdown += `**Date:** ${new Date().toLocaleString()}\n`;
    markdown += `**User:** ${user?.name || user?.email}\n\n`;
    markdown += `---\n\n`;

    messages.forEach((msg, idx) => {
      const role = msg.role === 'user' ? `👤 ${t('chat.you')}` : `🤖 ${t('chat.botName')}`;
      const time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : '';

      markdown += `### ${role} ${time ? `(${time})` : ''}\n\n`;
      markdown += `${msg.content}\n\n`;

      if (msg.tool_calls && msg.tool_calls.length > 0) {
        markdown += `**Tool Calls:**\n`;
        msg.tool_calls.forEach((tool) => {
          const label =
            typeof tool === "string" ? tool : tool?.tool || JSON.stringify(tool);
          markdown += `- ${label}\n`;
        });
        markdown += `\n`;
      }

      markdown += `---\n\n`;
    });

    // Create blob and download
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Conversation exported", "success");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-8 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />


      {/* Analytics Modal */}
      <ConversationAnalytics
        messages={messages}
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      {/* Settings Modal */}
      <ChatSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={themeSettings}
        onSave={(newSettings) => setThemeSettings(newSettings)}
      />

      {/* Main Content - Chat with Conversation and Task Sidebars */}
      <main className="relative z-10 max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-5" role="main" aria-label={t("chat.chatInterface")}>
        <div className="flex gap-3 sm:gap-4 h-[calc(100vh-8rem)]">
          {/* Conversation Sidebar - Hidden on mobile, shown on larger screens */}
          <div className="hidden lg:block w-64 flex-shrink-0 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
            <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/15 rounded-2xl h-full overflow-hidden group hover:border-violet-500/30 transition-all duration-500 shadow-lg hover:shadow-xl">
              {/* Premium animated gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/25 via-fuchsia-500/25 to-pink-500/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />

              {/* Premium shimmer effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-2000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Floating particles on hover */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-violet-400/40 rounded-full animate-float-enhanced"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                      animationDelay: `${i * 0.7}s`,
                      animationDuration: `${4 + i}s`
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative h-full">
                <ConversationSidebar
                  isOpen={true}
                  onClose={() => setSidebarOpen(false)}
                  conversations={conversations}
                  currentConversationId={conversationId || null}
                  onSelectConversation={handleSelectConversation}
                  onDeleteConversation={handleDeleteConversation}
                  onRenameConversation={handleRenameConversation}
                  onNewConversation={handleNewChat}
                />
              </div>

              {/* Premium corner sparkles */}
              <div className="absolute top-3 left-3 w-2 h-2 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" />
              <div className="absolute bottom-3 right-3 w-2 h-2 bg-fuchsia-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>

          {/* Chat Area with premium styling */}
          <div className="flex-1 flex flex-col min-w-0" role="region" aria-label={t("chat.chatArea")}>
            {/* Premium controls bar with analytics and settings */}
            <div className="flex justify-end gap-2 mb-3 px-2">
              <button
                onClick={() => setShowAnalytics(true)}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white transition-all duration-300 hover:scale-105 border border-white/10 hover:border-violet-500/30 shadow-sm hover:shadow-lg"
                title={t("chat.analytics")}
                aria-label={t("chat.analytics")}
              >
                <ChartBarIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white transition-all duration-300 hover:scale-105 border border-white/10 hover:border-violet-500/30 shadow-sm hover:shadow-lg"
                title={t("chat.settings")}
                aria-label={t("chat.settings")}
              >
                <Cog6ToothIcon className="h-4 w-4" />
              </button>
              <button
                onClick={handleExportConversation}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white transition-all duration-300 hover:scale-105 border border-white/10 hover:border-violet-500/30 shadow-sm hover:shadow-lg"
                title={t("chat.export")}
                aria-label={t("chat.export")}
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
              </button>
              <button
                onClick={handleClearMessages}
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white transition-all duration-300 hover:scale-105 border border-white/10 hover:border-red-500/30 shadow-sm hover:shadow-lg hover:bg-red-500/10"
                title={t("chat.delete")}
                aria-label={t("chat.delete")}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area with premium styling and custom scrollbar */}
            <section
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto mb-4 px-2 relative custom-scrollbar rounded-xl"
              role="feed"
              aria-label={t("chat.messagesArea")}
              tabIndex={0}
            >
              {historyLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="relative animate-scale-in">
                    <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                    <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="absolute inset-0 bg-fuchsia-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <EmptyState
                  userName={user.name || user.email}
                  greeting={getGreeting()}
                  onSuggestionClick={handleSuggestionClick}
                />
              ) : (
                <>
                  {messages.map((message, idx) => (
                    <MessageBubble
                      key={idx}
                      message={message}
                      isLatest={idx === messages.length - 1}
                      userName={user.name || user.email}
                      onDelete={handleDeleteMessage}
                      onRegenerate={handleRegenerateResponse}
                      onReact={handleReactToMessage}
                      onReply={handleReplyToMessage}
                    />
                  ))}

                  {/* Streaming message bubble */}
                  {isStreaming && streamingContent && (
                    <div className="flex justify-start mb-4 animate-slide-in-left">
                      <div className="group relative max-w-[80%] rounded-2xl px-5 py-4 backdrop-blur-xl border transition-all duration-300 overflow-hidden bg-white/[0.03] text-white border-white/10 hover:bg-white/[0.05] hover:border-violet-500/30">
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        </div>

                        <div className="relative z-10">
                          {/* Message header */}
                          <div className="flex items-center gap-2 mb-2 text-sm text-white/60 animate-fade-in">
                            <div className="relative">
                              <SparklesIcon className="w-4 h-4 animate-pulse" />
                              <div className="absolute inset-0 bg-violet-400/30 rounded-full blur-sm animate-pulse" />
                            </div>
                            <span className="font-medium">TaskFlowBot</span>
                            <span className="text-xs text-violet-400 animate-pulse">• streaming...</span>
                          </div>

                          {/* Streaming content */}
                          <div className="prose prose-sm prose-invert max-w-none">
                            {streamingContent}
                            <span className="inline-block w-2 h-4 bg-violet-400 animate-pulse ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {isLoading && !isStreaming && (
                    <div className="flex justify-start mb-4 animate-fade-in-up">
                      <div className="relative bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl px-5 py-4 overflow-hidden group hover:bg-white/[0.04] hover:border-violet-500/20 transition-all duration-300 hover:scale-[1.01]">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-pink-500/5 animate-gradient-shift" style={{ backgroundSize: '200% 100%' }} />

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />

                        <div className="relative flex items-center gap-3">
                          {/* Animated icon */}
                          <div className="relative">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center animate-pulse">
                              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                            </div>
                            <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-md animate-pulse" />
                          </div>

                          {/* Bouncing dots with better animation */}
                          <div className="flex space-x-2">
                            <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce shadow-lg shadow-violet-500/50"></div>
                            <div className="w-2.5 h-2.5 bg-fuchsia-400 rounded-full animate-bounce shadow-lg shadow-fuchsia-500/50" style={{ animationDelay: "0.15s" }}></div>
                            <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce shadow-lg shadow-pink-500/50" style={{ animationDelay: "0.3s" }}></div>
                          </div>

                          {/* Text with gradient animation */}
                          <span className="text-sm text-white/60 font-medium animate-pulse">thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </section>

            {/* Premium Scroll to Bottom Button */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="group/scroll absolute bottom-24 right-8 p-4 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-2xl shadow-violet-500/50 hover:shadow-3xl hover:shadow-violet-500/70 transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-in z-10 overflow-hidden border border-white/20"
                title={t("chat.scrollToBottom")}
                aria-label={t("chat.scrollToBottom")}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToBottom();
                  }
                }}
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-pink-600 opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-500" />

                {/* Premium shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/scroll:translate-x-full transition-transform duration-1500 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Pulsing glow */}
                <div className="absolute inset-0 bg-violet-500/30 blur-xl animate-pulse" />

                {/* Icon with premium animation */}
                <svg className="w-6 h-6 relative z-10 group-hover/scroll:translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>

                {/* Premium unread indicator badge */}
                {messages.length > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/50 animate-pulse border border-white/30">
                    <span className="text-[10px] font-bold text-white">!</span>
                  </div>
                )}

                {/* Corner sparkle */}
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover/scroll:opacity-100 animate-ping transition-opacity duration-300" />
              </button>
            )}

            {/* Premium Error Display with enhanced animations */}
            {error && (
              <div className="mb-4 relative bg-red-500/10 border border-red-500/25 p-5 rounded-2xl backdrop-blur-xl animate-shake overflow-hidden group hover:bg-red-500/[0.15] hover:border-red-500/40 transition-all duration-300 hover:scale-[1.01] shadow-lg">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/15 via-red-600/15 to-red-500/15 animate-gradient-shift" style={{ backgroundSize: '200% 100%' }} />

                {/* Premium pulsing glow */}
                <div className="absolute inset-0 bg-red-500/10 blur-xl animate-pulse" />

                {/* Warning icon with premium animation */}
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 relative">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse border border-red-500/30">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-red-500/30 rounded-full blur-md animate-pulse" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-red-400 font-semibold">{error}</p>
                    <p className="text-xs text-red-400/70 mt-2 font-medium">Please try again or refresh the page</p>
                  </div>

                  {/* Premium Close button with better animation */}
                  <button
                    onClick={() => setError(null)}
                    className="flex-shrink-0 text-red-400/70 hover:text-red-400 transition-all duration-300 hover:scale-125 active:scale-90 hover:rotate-90 p-1 rounded-lg hover:bg-red-500/20"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Premium Input Area with enhanced depth and styling */}
            <div className={`relative transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              {/* Stop Generation Button */}
              {isStreaming && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
                  <button
                    onClick={handleStopGeneration}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/20 backdrop-blur-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Stop Generating
                  </button>
                </div>
              )}

              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSendMessage}
                onClear={clearInput}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                isLoading={isLoading || isStreaming}
                placeholder={t("chat.typePlaceholder") || "Type your message..."}
              />
            </div>
          </div>

          {/* Premium Task Sidebar with enhanced animations */}
          <div className="hidden lg:block w-64 flex-shrink-0 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
            <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/15 rounded-2xl h-full overflow-hidden group hover:border-violet-500/30 transition-all duration-500 shadow-lg hover:shadow-xl">
              {/* Premium animated gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/25 via-fuchsia-500/25 to-pink-500/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />

              {/* Premium shimmer effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-2000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Floating particles on hover */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-violet-400/40 rounded-full animate-float-enhanced"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`,
                      animationDelay: `${i * 0.7}s`,
                      animationDuration: `${4 + i}s`
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative h-full">
                <TaskSidebar
                  tasks={tasks}
                  isLoading={tasksLoading}
                  onToggleComplete={handleToggleTaskComplete}
                  onDelete={handleDeleteTask}
                  onRefresh={() => user && fetchTasks(user.id)}
                />
              </div>

              {/* Premium corner sparkles */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 w-2 h-2 bg-fuchsia-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}