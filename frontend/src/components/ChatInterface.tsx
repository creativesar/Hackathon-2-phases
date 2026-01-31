"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { ChatMessage, ChatResponse, Task } from "@/lib/types";
import { getAuthUser, signOut } from "@/lib/auth";
import { useRouter, Link } from "@/i18n/routing";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/components/Toast";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import {
  PaperAirplaneIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  MicrophoneIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

/**
 * ChatInterface Component
 * Phase III: AI Chatbot - Conversational interface for task management
 *
 * Features:
 * - Message display (T-320)
 * - Input handling (T-321)
 * - Tool call indicators (T-322)
 * - Conversation persistence
 */
export default function ChatInterface() {
  const router = useRouter();
  const { showToast } = useToast();
  const t = useTranslations("HomePage");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // User state
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);

  // Task list state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMounted(true);

    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true; // Keep listening until user manually stops
      recognitionInstance.interimResults = true; // Show real-time transcription
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

      let finalTranscript = '';

      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';

        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Show combined transcript (final + interim) in input field
        setInput((finalTranscript + interimTranscript).trim());
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        finalTranscript = '';
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        finalTranscript = '';
      };

      setRecognition(recognitionInstance);
    }

    // Get authenticated user
    const authUser = getAuthUser();
    if (!authUser) {
      router.push("/signin");
      return;
    }
    setUser(authUser);

    // Fetch tasks
    fetchTasks(authUser.id);
  }, [router]);

  const fetchTasks = async (userId: string) => {
    try {
      setTasksLoading(true);
      const fetchedTasks = await api.getTasks(userId);
      setTasks(fetchedTasks.sort((a, b) => b.id - a.id)); // Sort by ID descending
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogout = () => {
    signOut();
    showToast(t("nav.logout") + " " + t("common.success"), "info");
    router.push("/");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting.morning");
    if (hour < 17) return t("greeting.afternoon");
    return t("greeting.evening");
  };

  // T-321: Handle message submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading || !user) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setIsLoading(true);

    // Add user message to UI immediately
    const newUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Send message to backend
      const response: ChatResponse = await api.sendChatMessage(user.id, {
        conversation_id: conversationId,
        message: userMessage,
      });

      // Update conversation ID if this is the first message
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      // Add assistant response to UI
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.response,
        tool_calls: response.tool_calls,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Always refresh tasks after chatbot responds to keep sidebar in sync
      // This ensures any task changes are immediately visible
      await fetchTasks(user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      // Remove the optimistically added user message on error
      setMessages((prev) => prev.slice(0, -1));
      setInput(userMessage); // Restore input
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (!voiceSupported || !recognition) {
      showToast("Voice recognition not supported in your browser", "error");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsListening(false);
      showToast("Microphone access denied. Please check permissions.", "error");
    }
  };

  // T-320: Message display component
  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const isUser = message.role === "user";

    return (
      <div
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-fade-in-up`}
      >
        <div
          className={`max-w-[80%] rounded-2xl px-5 py-4 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] ${
            isUser
              ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white border-violet-500/20 shadow-lg shadow-violet-500/25"
              : "bg-white/[0.03] text-white border-white/10 hover:bg-white/[0.05] hover:border-white/20"
          }`}
        >
          {/* Message content */}
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          {/* T-322: Tool call indicators */}
          {message.tool_calls && message.tool_calls.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold mb-3 text-violet-300">
                <SparklesIcon className="h-4 w-4" />
                {t("chat.toolCalls")}
              </div>
              {message.tool_calls.map((toolCall, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-white/5 backdrop-blur rounded-xl p-3 mb-2 font-mono border border-white/10 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="font-bold mb-2 text-violet-300">{toolCall.tool}</div>
                  {toolCall.args && (
                    <div className="text-white/60 mb-2">
                      <span className="text-white/80 font-semibold">{t("chat.args")}</span>
                      <pre className="mt-1 text-[10px] overflow-x-auto">{JSON.stringify(toolCall.args, null, 2)}</pre>
                    </div>
                  )}
                  {toolCall.result && (
                    <div className="text-white/60">
                      <span className="text-white/80 font-semibold">{t("chat.result")}</span>
                      <pre className="mt-1 text-[10px] overflow-x-auto">{JSON.stringify(toolCall.result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-xs mt-3 ${
              isUser ? "text-violet-200" : "text-white/40"
            }`}
          >
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
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
      {/* Animated background with aurora effect */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
        {/* Pulsating orbs with morphing */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-morph-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-morph-slow" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] animate-breathe" />
        {/* Moving gradient beam */}
        <div className="absolute inset-0 bg-gradient-conic from-violet-500/10 via-transparent to-fuchsia-500/10 animate-spin-very-slow" style={{ animationDuration: '20s' }} />
      </div>

      {/* Enhanced floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float-enhanced ${i % 3 === 0 ? 'bg-violet-400/40 w-1.5 h-1.5' : i % 3 === 1 ? 'bg-fuchsia-400/30 w-1 h-1' : 'bg-pink-400/20 w-2 h-2'}`}
            style={{
              left: `${5 + (i * 7) % 90}%`,
              top: `${10 + (i * 13) % 80}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 4)}s`
            }}
          />
        ))}
        {/* Sparkle particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-0.5 h-0.5 bg-white/60 rounded-full animate-twinkle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Animated grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] animate-grid-pulse"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Header */}
      <header className={`sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & User */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-xl bg-violet-500/30 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{user.name || user.email}</span>!
                </h1>
                <p className="text-sm text-white/40 hidden sm:block">
                  {t("chat.chatWithAssistant")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <LanguageSwitcher />

              <Link
                href="/tasks"
                className="p-2.5 rounded-xl text-white/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-300 hover:scale-105"
                aria-label="Tasks"
                title="Tasks"
              >
                <ClipboardDocumentListIcon className="h-5 w-5" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:scale-105"
                aria-label={t("nav.logout")}
                title={t("nav.logout")}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Chat with Sidebar */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6 h-[calc(100vh-10rem)]">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Messages area */}
          <div className="flex-1 overflow-y-auto mb-4 px-2">
            {messages.length === 0 ? (
              <div
                className={`relative bg-white/[0.03] backdrop-blur border-2 border-dashed border-white/10 rounded-3xl p-10 sm:p-16 text-center transition-all duration-700 overflow-hidden ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                {/* Animated background circles */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl animate-float-slow" />
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-2xl animate-float-slow" style={{ animationDelay: '-2s' }} />
                </div>

                <div className="relative z-10">
                  {/* Animated icon container */}
                  <div className="relative inline-block mb-8">
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] flex items-center justify-center animate-levitate border border-white/10">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 text-white/30 animate-pulse" />
                    </div>
                    {/* Orbiting sparkles */}
                    <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '8s' }}>
                      <div className="absolute -top-2 left-1/2 w-2 h-2 bg-violet-400 rounded-full shadow-lg shadow-violet-500/50" />
                    </div>
                    <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                      <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-fuchsia-400 rounded-full shadow-lg shadow-fuchsia-500/50" />
                    </div>
                    {/* Corner badge */}
                    <div className="absolute -bottom-3 -right-3 h-10 w-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-xl shadow-violet-500/40 animate-bounce-gentle">
                      <SparklesIcon className="h-5 w-5 text-white animate-spin-slow" style={{ animationDuration: '3s' }} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {t("chat.welcome")}
                  </h3>
                  <p className="text-white/40 mb-6 max-w-sm mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    {t("chat.welcomeDesc")}
                  </p>
                  <ul className="text-sm text-white/60 space-y-2 max-w-md mx-auto text-left animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                      <SparklesIcon className="h-4 w-4 text-violet-400 flex-shrink-0" />
                      "{t("chat.example1")}"
                    </li>
                    <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                      <SparklesIcon className="h-4 w-4 text-fuchsia-400 flex-shrink-0" />
                      "{t("chat.example2")}"
                    </li>
                    <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                      <SparklesIcon className="h-4 w-4 text-pink-400 flex-shrink-0" />
                      "{t("chat.example3")}"
                    </li>
                    <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                      <SparklesIcon className="h-4 w-4 text-violet-400 flex-shrink-0" />
                      "{t("chat.example4")}"
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <MessageBubble key={idx} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-4 animate-fade-in-up">
                    <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl px-5 py-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 p-4 rounded-xl backdrop-blur animate-shake">
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* T-321: Input area */}
          <div className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1 flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "🎤 Listening... click stop when done" : t("chat.typePlaceholder")}
                  disabled={isLoading}
                  readOnly={isListening}
                  className={`
                    flex-1 px-4 py-3 rounded-xl
                    bg-white/[0.03] backdrop-blur
                    text-white placeholder:text-white/30
                    border border-white/5
                    focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
                    focus:bg-white/[0.05]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300
                    ${isListening ? 'border-red-500/30 bg-red-500/5 animate-pulse' : ''}
                  `}
                />
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={startListening}
                    disabled={isLoading}
                    className={`
                      p-3 rounded-xl flex items-center justify-center
                      transition-all duration-300
                      ${isListening
                        ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                        : 'bg-white/[0.05] border border-white/10 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300 hover:border-violet-500/30'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? (
                      <StopIcon className="h-5 w-5 animate-pulse" />
                    ) : (
                      <MicrophoneIcon className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading || isListening}
                className="
                  group relative inline-flex items-center justify-center gap-2
                  px-6 py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white
                  shadow-lg shadow-violet-500/25
                  hover:shadow-xl hover:shadow-violet-500/40
                  hover:-translate-y-0.5 active:translate-y-0
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  transition-all duration-300
                  overflow-hidden
                "
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin relative z-10" />
                    <span className="relative z-10">{t("chat.sending")}</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10">{t("chat.send")}</span>
                  </>
                )}
              </button>
            </form>
            <p className="text-xs text-white/40 mt-3 flex items-center gap-2">
              <SparklesIcon className="h-3 w-3" />
              {t("chat.pressEnter")} • {t("chat.poweredBy")}
              {isListening && (
                <span className="ml-2 flex items-center gap-1 text-red-400 animate-pulse">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
                  Listening...
                </span>
              )}
            </p>
          </div>
          </div>

          {/* Task List Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 h-full overflow-hidden flex flex-col">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-violet-400" />
                  <h2 className="font-bold text-white">Your Tasks</h2>
                  {tasksLoading && (
                    <span className="text-xs text-violet-400 animate-pulse">Syncing...</span>
                  )}
                </div>
                <button
                  onClick={() => user && fetchTasks(user.id)}
                  disabled={tasksLoading}
                  className="p-1.5 rounded-lg text-white/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-300"
                  aria-label="Refresh tasks"
                >
                  <ArrowPathIcon className={`h-4 w-4 ${tasksLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Task List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {tasksLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <ArrowPathIcon className="h-6 w-6 text-violet-400 animate-spin" />
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8 text-white/40 text-sm">
                    <ClipboardDocumentListIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No tasks yet</p>
                    <p className="text-xs mt-1">Ask the chatbot to add one!</p>
                  </div>
                ) : (
                  tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`
                        group p-3 rounded-xl border transition-all duration-300 animate-fade-in-up
                        ${task.completed
                          ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                          : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-violet-500/30"
                        }
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Task ID and Status */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-violet-400">
                          #{task.id}
                        </span>
                        {task.completed && (
                          <CheckCircleSolid className="h-4 w-4 text-emerald-400" />
                        )}
                      </div>

                      {/* Task Title */}
                      <h3
                        className={`
                          font-semibold text-sm mb-1 line-clamp-2
                          ${task.completed
                            ? "text-white/40 line-through"
                            : "text-white"
                          }
                        `}
                      >
                        {task.title}
                      </h3>

                      {/* Task Description */}
                      {task.description && (
                        <p
                          className={`
                            text-xs line-clamp-2
                            ${task.completed
                              ? "text-white/30"
                              : "text-white/50"
                            }
                          `}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>Total: {tasks.length}</span>
                  <span>Completed: {tasks.filter(t => t.completed).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
