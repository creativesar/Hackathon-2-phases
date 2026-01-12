"use client";

import { Task } from "@/lib/types";
import { CheckCircleIcon, TrashIcon, ArrowPathIcon, ClipboardDocumentListIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useTranslateTask } from "@/hooks/useTranslateTask";

interface TaskSidebarProps {
  tasks: Task[];
  isLoading?: boolean;
  onToggleComplete?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  onRefresh?: () => void;
}

/**
 * TaskSidebar Component
 * Enhanced dark theme sidebar with advanced animations
 */
export default function TaskSidebar({
  tasks,
  isLoading = false,
  onToggleComplete,
  onDelete,
  onRefresh,
}: TaskSidebarProps) {
  const t = useTranslations("HomePage");
  // Task type only guarantees `completed`; older UI code referenced `status`.
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Header with animated gradient */}
      <div className="relative p-4 border-b border-white/10 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-pink-500/5 animate-gradient-shift" style={{ backgroundSize: '200% 100%' }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 group cursor-default">
              <div className="relative">
                <ClipboardDocumentListIcon className="h-5 w-5 text-violet-400 animate-pulse group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-violet-400/30 rounded-full blur-sm animate-pulse" />
              </div>
              <h2 className="font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all duration-300">{t("chat.yourTasks")}</h2>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="group relative p-1.5 rounded-lg text-white/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-300 hover:scale-125 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh tasks"
              >
                <ArrowPathIcon className={`h-4 w-4 transition-transform duration-300 ${isLoading ? "animate-spin" : "group-hover:rotate-180"}`} />
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-violet-500/20 rounded-lg blur-md" />
              </button>
            )}
          </div>

          {/* Stats with animated counters */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5 animate-fade-in group cursor-default hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse group-hover:scale-125 transition-transform duration-300" />
              <span className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                <span className="font-bold text-violet-400 group-hover:scale-110 inline-block transition-transform duration-300">{pendingTasks.length}</span> {t("list.pending")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 animate-fade-in group cursor-default hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse group-hover:scale-125 transition-transform duration-300" />
              <span className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                <span className="font-bold text-emerald-400 group-hover:scale-110 inline-block transition-transform duration-300">{completedTasks.length}</span> {t("common.completed")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Task list with enhanced animations and custom scrollbar */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {isLoading && tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
            <div className="relative">
              <ArrowPathIcon className="h-8 w-8 text-violet-400 animate-spin" />
              <div className="absolute inset-0 bg-violet-400/30 rounded-full blur-md animate-pulse" />
            </div>
            <p className="text-white/40 text-sm mt-3">{t("chat.loadingTasks")}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 animate-scale-in">
            <div className="relative inline-block mb-3">
              <ClipboardDocumentListIcon className="h-16 w-16 mx-auto text-white/20 animate-levitate" />
              <div className="absolute inset-0 bg-violet-400/10 rounded-full blur-xl animate-pulse" />
            </div>
            <p className="text-white/40 text-sm font-medium">{t("chat.noTasksYet")}</p>
            <p className="text-xs text-white/30 mt-1 flex items-center justify-center gap-1">
              <SparklesIcon className="h-3 w-3 animate-pulse" />
              {t("chat.askChatbot")}
            </p>
          </div>
        ) : (
          <>
            {/* Pending tasks */}
            {pendingTasks.length > 0 && (
              <div className="animate-fade-in-up">
                <h4 className="text-xs font-semibold text-white/40 uppercase mb-2 px-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  {t("list.pending")}
                </h4>
                <div className="space-y-2">
                  {pendingTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed tasks */}
            {completedTasks.length > 0 && (
              <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h4 className="text-xs font-semibold text-white/40 uppercase mb-2 px-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t("common.completed")}
                </h4>
                <div className="space-y-2">
                  {completedTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer with animated progress bar */}
      <div className="relative p-4 border-t border-white/10 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-pink-500/5 animate-gradient-shift" style={{ backgroundSize: '200% 100%' }} />

        <div className="relative z-10">
          {/* Progress bar */}
          {tasks.length > 0 && (
            <div className="mb-3 group cursor-default">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden group-hover:h-2 transition-all duration-300">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500 animate-shimmer group-hover:from-violet-400 group-hover:to-fuchsia-400"
                  style={{
                    width: `${(completedTasks.length / tasks.length) * 100}%`,
                    backgroundSize: '200% 100%'
                  }}
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-white/40">
            <span className="flex items-center gap-1.5 group cursor-default hover:text-white/60 transition-colors duration-300">
              <SparklesIcon className="h-3 w-3 animate-pulse group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              {t("chat.total")}: <span className="font-bold text-white/60 group-hover:text-white/80 transition-colors duration-300">{tasks.length}</span>
            </span>
            <span className="group cursor-default hover:text-white/60 transition-colors duration-300">
              {t("common.completed")}: <span className="font-bold text-emerald-400 group-hover:scale-110 inline-block transition-transform duration-300">{completedTasks.length}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TaskItem Component
 * Enhanced individual task item with advanced animations
 */
function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  index,
}: {
  task: Task;
  onToggleComplete?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  index: number;
}) {
  const { title, description, isTranslating } = useTranslateTask(task);
  const isCompleted = task.completed;

  return (
    <div
      className={`
        group relative p-3 rounded-xl border transition-all duration-300 animate-fade-in-up overflow-hidden cursor-pointer
        ${isCompleted
          ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/20"
          : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-0.5"
        }
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Glow effect on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl ${
        isCompleted ? "bg-emerald-500/10" : "bg-violet-500/10"
      }`} />

      <div className="relative flex items-start gap-3">
        {/* Checkbox with animation */}
        {onToggleComplete && (
          <button
            onClick={() => onToggleComplete(task.id)}
            className="flex-shrink-0 mt-0.5 group/check transition-all duration-300 hover:scale-125 active:scale-95"
          >
            {isCompleted ? (
              <div className="relative">
                <CheckCircleSolid className="w-5 h-5 text-emerald-400 animate-scale-in" />
                <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-sm animate-pulse" />
              </div>
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-white/40 hover:text-violet-400 transition-all group-hover/check:rotate-12 group-hover/check:scale-110" />
            )}
          </button>
        )}

        {/* Task content */}
        <div className="flex-1 min-w-0">
          {/* Task ID with gradient */}
          <span className="font-mono text-xs font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            #{task.id}
          </span>

          {/* Task Title */}
          <p
            className={`text-sm font-medium mt-1 transition-all duration-300 ${
              isCompleted
                ? "text-white/40 line-through"
                : "text-white group-hover:text-violet-100"
            } ${isTranslating ? "opacity-50" : ""}`}
          >
            {title}
          </p>

          {/* Task Description */}
          {description && (
            <p className={`text-xs text-white/40 mt-1 line-clamp-2 ${isTranslating ? "opacity-50" : ""}`}>
              {description}
            </p>
          )}
        </div>

        {/* Delete button with animation */}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="flex-shrink-0 text-white/30 hover:text-red-400 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-125 active:scale-90 hover:rotate-12"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

