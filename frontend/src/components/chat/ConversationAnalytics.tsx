import { ChatMessage } from "@/lib/types";
import { useTranslations } from "next-intl";
import {
  ChartBarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

interface ConversationAnalyticsProps {
  messages: ChatMessage[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ConversationAnalytics({
  messages,
  isOpen,
  onClose
}: ConversationAnalyticsProps) {
  const t = useTranslations("HomePage");

  // Calculate analytics
  const totalMessages = messages.length;
  const userMessages = messages.filter(m => m.role === 'user').length;
  const assistantMessages = messages.filter(m => m.role === 'assistant').length;
  const totalWords = messages.reduce((acc, msg) => acc + msg.content.split(/\s+/).length, 0);
  const avgMessageLength = totalMessages > 0 ? Math.round(totalWords / totalMessages) : 0;

  // Calculate response times if timestamps are available
  let avgResponseTime = 0;
  if (messages.length > 1) {
    let totalTime = 0;
    let responsePairs = 0;

    for (let i = 1; i < messages.length; i++) {
      if (messages[i]!.role === 'assistant' && messages[i-1]!.role === 'user' &&
          messages[i]!.created_at && messages[i-1]!.created_at) {
        const userTime = new Date(messages[i-1]!.created_at!).getTime();
        const assistantTime = new Date(messages[i]!.created_at!).getTime();
        totalTime += (assistantTime - userTime) / 1000; // Convert to seconds
        responsePairs++;
      }
    }

    avgResponseTime = responsePairs > 0 ? Math.round(totalTime / responsePairs) : 0;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
        </div>

        <div
          className="inline-block align-bottom bg-white/[0.03] backdrop-blur-xl rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-violet-400" />
                {t("chat.analytics")}
              </h3>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-violet-400" />
                    <span className="text-sm text-white/60">{t("chat.totalMessages")}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{totalMessages}</div>
                </div>

                <div className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <UserGroupIcon className="h-5 w-5 text-fuchsia-400" />
                    <span className="text-sm text-white/60">{t("chat.participants")}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">2</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <DocumentTextIcon className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-white/60">{t("chat.words")}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{totalWords}</div>
                </div>

                <div className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-white/60">{t("chat.avgResponseTime")}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{avgResponseTime}s</div>
                </div>
              </div>

              {/* Message Distribution */}
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
                <h4 className="font-semibold text-white mb-3">{t("chat.messageDistribution")}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{t("chat.you")}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full"
                          style={{ width: `${(userMessages / totalMessages) * 100 || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-white/60 w-8">{userMessages}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{t("chat.assistant")}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${(assistantMessages / totalMessages) * 100 || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-white/60 w-8">{assistantMessages}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Average Message Length */}
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
                <h4 className="font-semibold text-white mb-2">{t("chat.avgMessageLength")}</h4>
                <div className="text-lg text-white">{avgMessageLength} {t("chat.wordsPerMsg")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}