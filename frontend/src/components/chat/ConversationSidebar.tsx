import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  UserIcon,
  ClockIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

interface Conversation {
  id: number;
  title: string;
  last_message: string;
  updated_at: string;
  message_count: number;
}

interface ConversationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onDeleteConversation: (id: number) => void;
  onRenameConversation: (id: number, newTitle: string) => void;
  onNewConversation: () => void;
}

export default function ConversationSidebar({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onNewConversation,
}: ConversationSidebarProps) {
  const t = useTranslations("HomePage");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStart = (id: number, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleEditSave = (id: number) => {
    onRenameConversation(id, editTitle);
    setEditingId(null);
    setEditTitle("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return t("chat.yesterday");
    } else if (diffInHours < 7 * 24) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Header with premium styling */}
      <div className="relative p-4 border-b border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-violet-400" />
            {t("chat.conversations")}
          </h2>
          <button
            onClick={onNewConversation}
            className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
            title={t("chat.newConversation")}
            aria-label={t("chat.newConversation")}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Search input with premium styling */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-white/50" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("chat.searchConversations") || "Search conversations..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.06] text-white placeholder:text-white/40 border border-white/10 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/25 focus:bg-white/[0.08] hover:bg-white/[0.07] transition-all duration-300 outline-none"
            aria-label={t("chat.searchConversations")}
          />
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-white/40 text-sm">{t("chat.noConversations")}</div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                  currentConversationId === conversation.id
                    ? "bg-violet-500/20 border border-violet-500/30"
                    : "hover:bg-white/[0.06] border border-transparent"
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                {editingId === conversation.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-white/[0.08] text-white border border-white/20 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/25 outline-none text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(conversation.id);
                        if (e.key === 'Escape') handleEditCancel();
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSave(conversation.id);
                      }}
                      className="text-green-400 hover:text-green-300 p-1"
                      aria-label="Save"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCancel();
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                      aria-label="Cancel"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">
                          {conversation.title}
                        </h3>
                        <p className="text-xs text-white/60 mt-1 line-clamp-2">
                          {conversation.last_message}
                        </p>
                      </div>

                      {/* Action buttons appear on hover */}
                      <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStart(conversation.id, conversation.title);
                          }}
                          className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                          title={t("chat.rename")}
                          aria-label={t("chat.rename")}
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          className="p-1.5 rounded-md text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title={t("chat.deleteConversation")}
                          aria-label={t("chat.deleteConversation")}
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                      <div className="flex items-center gap-1">
                        <ChatBubbleLeftEllipsisIcon className="h-3 w-3" />
                        <span>{conversation.message_count} {t("chat.messages")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>{formatDate(conversation.updated_at)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium footer with animated background */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
          <div className="relative flex items-center justify-between text-xs text-white/50">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span>{t("chat.active")}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              <span>{conversations.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}