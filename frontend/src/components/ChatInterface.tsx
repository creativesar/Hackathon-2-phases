/**
 * T-319: Create ChatKit frontend component
 *
 * This component implements the OpenAI ChatKit UI for the AI chatbot feature.
 * It handles JWT token management, conversation persistence, and message display.
 */

'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAuthUser, isAuthenticated } from '@/lib/auth';
import { api } from '@/lib/api';

interface ToolCall {
  tool: string;
  args: any;
  result: any;
}

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string; // ISO string timestamp
  toolCalls?: ToolCall[];
}

const ChatInterface = () => {
  // Get auth user from localStorage
  const authUser = getAuthUser();
  const userId = authUser?.id || 'ziakhan'; // Default to ziakhan for demo purposes

  // State for messages and input
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);

  // Handle form submission with custom logic to include JWT token and conversation_id
  const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check authentication first
    if (!isAuthenticated()) {
      console.error('User not authenticated');
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'You need to be logged in to use the chatbot. Please sign in.',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    if (!input.trim()) {
      console.warn('Message is empty');
      return;
    }

    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const currentInput = input;
    setInput(''); // Clear input immediately

    try {
      // Use the API client to send the message
      const response = await api.chat(userId, {
        conversation_id: conversationId,
        message: currentInput
      });

      // Update conversation ID if new conversation was created
      if (response.conversation_id && conversationId === undefined) {
        setConversationId(response.conversation_id);
      }

      // Add assistant response to messages
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        createdAt: new Date().toISOString(),
        toolCalls: response.tool_calls || undefined,
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to the chat
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle Enter key press for message submission
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        handleCustomSubmit(e as any as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white/[0.03] backdrop-blur border border-white/5 rounded-2xl shadow-lg overflow-hidden">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-white/40">
            <p>Start a conversation with the AI assistant to manage your tasks!</p>
            <p className="mt-2 text-sm">Try: "Add a task to buy groceries" or "Show my pending tasks"</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-none shadow-lg shadow-violet-500/25'
                    : 'bg-white/[0.03] text-white rounded-bl-none border border-white/5'
                }`}
              >
                {/* Role indicator */}
                <div className="text-xs font-semibold mb-1 opacity-80">
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="whitespace-pre-wrap break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: (props) => <p className="mb-2 text-white/90" {...props} />,
                      ul: (props) => <ul className="list-disc list-inside mb-2 text-white/90" {...props} />,
                      ol: (props) => <ol className="list-decimal list-inside mb-2 text-white/90" {...props} />,
                      li: (props) => <li className="mb-1 ml-4 text-white/90" {...props} />,
                      strong: (props) => <strong className="font-semibold text-white" {...props} />,
                      em: (props) => <em className="italic text-white/90" {...props} />,
                      code: (props) => <code className="bg-white/10 px-1 py-0.5 rounded text-sm" {...props} />,
                      pre: (props) => <pre className="bg-white/5 p-2 rounded my-2 overflow-x-auto" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Display tool calls if present */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="text-xs font-semibold text-violet-400 mb-2 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-violet-500 mr-2"></span>
                      Tool Calls
                    </div>
                    {msg.toolCalls.map((toolCall, idx) => (
                      <div key={idx} className="mb-2 last:mb-0">
                        <div className="text-xs font-medium bg-white/10 px-2 py-1 rounded-t">
                          {toolCall.tool}
                        </div>
                        <div className="text-xs bg-white/5 p-2 rounded-b font-mono overflow-x-auto">
                          <div className="mb-1">
                            <span className="font-semibold text-violet-300">Parameters:</span> {JSON.stringify(toolCall.args)}
                          </div>
                          <div>
                            <span className="font-semibold text-violet-300">Result:</span> {JSON.stringify(toolCall.result)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Timestamp - using actual time when available, fallback to "Just now" */}
                <div className="text-xs mt-1 opacity-50 text-right">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.03] text-white rounded-2xl rounded-bl-none px-4 py-3 border border-white/5">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-white/5 p-4">
        <form onSubmit={handleCustomSubmit} className="flex items-end space-x-2">
          <input
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={isAuthenticated() ? "Type your message here..." : "Please sign in to use the chatbot"}
            className="flex-1 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white/[0.03] text-white placeholder:text-white/30"
            disabled={isLoading || !isAuthenticated()}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !isAuthenticated()}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40"
          >
            Send
          </button>
        </form>
        <p className="mt-2 text-xs text-white/40">
          {isAuthenticated()
            ? "Send a message to interact with the AI assistant"
            : "Please sign in to start chatting"}
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;