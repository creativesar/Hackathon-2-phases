// TypeScript interfaces for the Todo application

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// Phase III: AI Chatbot types
export interface ChatMessage {
  id?: number;
  role: "user" | "assistant";
  content: string;
  tool_calls?: ToolCall[];
  created_at?: string;
  reactions?: Record<string, string[]>; // emoji -> user_ids
  reply_to?: number; // message id this message is replying to
  thread_id?: number; // thread id if this is part of a thread
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error'; // message status
  read_by?: string[]; // user ids who have read this message
}

export interface UserPresence {
  id: string;
  name: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
  is_typing?: boolean;
}

export interface Conversation {
  id: number;
  title: string;
  last_message: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ToolCall {
  tool: string;
  args: any;
  result: any;
}

export interface ChatRequest {
  conversation_id?: number;
  message: string;
}

export interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls?: ToolCall[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
}

export interface DeleteTaskResponse {
  message: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthTokens {
  token: string;
  user: AuthUser;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}
