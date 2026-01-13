"use client";

import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  DeleteTaskResponse,
  ChatRequest,
  ChatResponse,
  Conversation,
  ChatMessage,
} from "./types";
import { getAuthToken } from "./auth";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

/**
 * API Client for making authenticated requests to the backend API.
 * Automatically includes JWT token in Authorization header.
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make an authenticated request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Merge with any provided headers
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const url = `${this.baseUrl}${endpoint}`;
    console.log('API Request:', { url, method: options.method || 'GET' });
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: `Request failed with status ${response.status}`,
      }));
      throw new Error(error.detail || "API request failed");
    }

    return response.json();
  }

  /**
   * Get all tasks for a user
   * GET /api/{user_id}/tasks
   */
  async getTasks(userId: string): Promise<Task[]> {
    return this.request<Task[]>(`/api/${userId}/tasks`);
  }

  /**
   * Create a new task
   * POST /api/{user_id}/tasks
   */
  async createTask(userId: string, data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get a single task by ID
   * GET /api/{user_id}/tasks/{task_id}
   */
  async getTask(userId: string, taskId: number): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}`);
  }

  /**
   * Update an existing task
   * PUT /api/{user_id}/tasks/{task_id}
   */
  async updateTask(
    userId: string,
    taskId: number,
    data: UpdateTaskRequest
  ): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a task
   * DELETE /api/{user_id}/tasks/{task_id}
   */
  async deleteTask(userId: string, taskId: number): Promise<DeleteTaskResponse> {
    return this.request<DeleteTaskResponse>(`/api/${userId}/tasks/${taskId}`, {
      method: "DELETE",
    });
  }

  /**
   * Toggle task completion status
   * PATCH /api/{user_id}/tasks/{task_id}/complete
   */
  async toggleCompletion(userId: string, taskId: number): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
      method: "PATCH",
    });
  }

  /**
   * Send a chat message to the AI assistant
   * POST /api/{user_id}/chat
   * Phase III: AI Chatbot
   */
  async sendChatMessage(
    userId: string,
    data: ChatRequest
  ): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/api/${userId}/chat`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get all conversations for a user
   * GET /api/{user_id}/conversations
   * Phase III: Conversation History
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    return this.request<Conversation[]>(`/api/${userId}/conversations`);
  }

  /**
   * Get all messages from a specific conversation
   * GET /api/{user_id}/conversations/{conversation_id}/messages
   * Phase III: Conversation History
   */
  async getConversationMessages(
    userId: string,
    conversationId: number
  ): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>(
      `/api/${userId}/conversations/${conversationId}/messages`
    );
  }

  /**
   * Delete a conversation
   * DELETE /api/{user_id}/conversations/{conversation_id}
   */
  async deleteConversation(
    userId: string,
    conversationId: number
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/api/${userId}/conversations/${conversationId}`,
      {
        method: "DELETE",
      }
    );
  }

  /**
   * Rename a conversation
   * PUT /api/{user_id}/conversations/{conversation_id}
   */
  async renameConversation(
    userId: string,
    conversationId: number,
    title: string
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/api/${userId}/conversations/${conversationId}`,
      {
        method: "PUT",
        body: JSON.stringify({ title }),
      }
    );
  }

  /**
   * Send chat message with streaming support
   * POST /api/{user_id}/chat/stream
   */
  async sendChatMessageStream(
    userId: string,
    data: ChatRequest,
    onChunk: (chunk: string) => void,
    onComplete: (response: ChatResponse) => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/${userId}/chat/stream`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          detail: `Request failed with status ${response.status}`,
        }));
        throw new Error(error.detail || "API request failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";
      let fullResponse = "";
      let completed = false;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              // Some backends send both a final JSON `{ done: true, ... }` and a `[DONE]` sentinel.
              // Avoid firing onComplete twice.
              if (!completed) {
                completed = true;
                onComplete({
                  response: fullResponse,
                  conversation_id: 0,
                  tool_calls: [],
                });
              }
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullResponse += parsed.content;
                onChunk(parsed.content);
              }
              if (parsed.done) {
                if (!completed) {
                  completed = true;
                  onComplete({
                    response: fullResponse,
                    conversation_id: parsed.conversation_id || 0,
                    tool_calls: parsed.tool_calls || [],
                  });
                }
                return;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        onError(error);
      } else {
        onError(new Error("Unknown error occurred"));
      }
    }
  }
}

// Export singleton instance
export const api = new ApiClient(API_URL);
