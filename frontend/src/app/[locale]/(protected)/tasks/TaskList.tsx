"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Task } from "@/lib/types";
import { signOut } from "@/lib/auth";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { useToast } from "@/components/Toast";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Confetti } from "@/components/Confetti";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import {
  CheckCircleIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
  FireIcon,
  TrophyIcon,
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid, ClockIcon } from "@heroicons/react/24/solid";

interface TaskListProps {
  userId: string;
  userName: string;
}

type FilterType = "all" | "pending" | "completed";
type ViewType = "list" | "grid";

export default function TaskList({ userId, userName }: TaskListProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const t = useTranslations("HomePage");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<ViewType>("list");
  const [showConfetti, setShowConfetti] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    taskId: number | null;
    taskTitle: string;
  }>({ isOpen: false, taskId: null, taskTitle: "" });

  useEffect(() => {
    setMounted(true);
    fetchTasks();

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        setEditingTask(undefined);
        setShowForm(true);
      }
      if (e.key === "Escape" && showForm) {
        setShowForm(false);
        setEditingTask(undefined);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showForm]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await api.getTasks(userId);
      setTasks(fetchedTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      showToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
    showToast(t("list.tasksRefreshed"), "info");
  };

  const handleSaveTask = (savedTask: Task) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === savedTask.id ? savedTask : t)));
      showToast(t("list.taskUpdated"), "success");
    } else {
      setTasks([savedTask, ...tasks]);
      showToast(t("list.taskCreated"), "success");
    }
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      const updated = await api.toggleCompletion(userId, taskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));

      if (updated.completed && !task?.completed) {
        setShowConfetti(true);
        showToast(t("list.taskCompleted"), "success");
      } else {
        showToast(t("list.taskMarkedPending"), "info");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("list.failedUpdate"));
      showToast(t("list.failedUpdate"), "error");
    }
  };

  const openDeleteModal = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    setDeleteModal({
      isOpen: true,
      taskId,
      taskTitle: task?.title || "",
    });
  };

  const handleDeleteTask = async () => {
    if (!deleteModal.taskId) return;

    try {
      await api.deleteTask(userId, deleteModal.taskId);
      setTasks(tasks.filter((t) => t.id !== deleteModal.taskId));
      showToast(t("tasks.deleteSuccess"), "info");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("list.failedDelete"));
      showToast(t("list.failedDelete"), "error");
    } finally {
      setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
    }
  };

  const handleLogout = () => {
    signOut();
    showToast(t("nav.logout") + " " + t("common.success"), "info");
    router.push("/");
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !task.completed) ||
      (filter === "completed" && task.completed);
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting.morning");
    if (hour < 17) return t("greeting.afternoon");
    return t("greeting.evening");
  };

  // Loading state with animated skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <header className="sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-56 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: '100ms' }} />
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 mb-3 animate-pulse" />
                <div className="h-7 w-12 bg-white/5 rounded-lg mb-1 animate-pulse" />
                <div className="h-4 w-16 bg-white/5 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          <div className="h-16 bg-white/[0.03] border border-white/5 rounded-2xl mb-6 animate-pulse" />

          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-white/5 rounded-lg" />
                    <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]/30 pb-24 sm:pb-8 relative overflow-hidden">
      {/* Confetti celebration */}
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={t("tasks.deleteTitle")}
        message={t("tasks.deleteMessage", { title: deleteModal.taskTitle })}
        confirmText={t("common.delete")}
        cancelText={t("tasks.keepIt")}
        variant="danger"
        onConfirm={handleDeleteTask}
        onCancel={() => setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" })}
      />

      {/* Animated background with aurora effect */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-transparent to-fuchsia-950/20" />
        {/* Pulsating orbs with morphing */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] animate-morph-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/8 rounded-full blur-[100px] animate-morph-slow" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/3 rounded-full blur-[150px] animate-breathe" />
        {/* Moving gradient beam */}
        <div className="absolute inset-0 bg-gradient-conic from-violet-500/5 via-transparent to-fuchsia-500/5 animate-spin-very-slow" style={{ animationDuration: '20s' }} />
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

      {/* Diagonal light streak */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[200%] h-32 bg-gradient-to-r from-transparent via-violet-500/5 to-transparent rotate-12 animate-streak" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-5">
        {/* Stats Cards with staggered animation */}
        {tasks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {/* Total Tasks */}
            <div
              className={`group bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/[0.04] hover:border-violet-500/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-violet-500/5 transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500/15 to-indigo-600/15 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <ClipboardDocumentListIcon className="h-4 w-4 text-indigo-400" />
                  <div className="absolute inset-0 rounded-lg bg-indigo-500/15 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '1.5s' }} />
                </div>
                <div>
                  <p className="text-lg font-bold text-white group-hover:scale-105 transition-transform duration-300">{tasks.length}</p>
                  <p className="text-[10px] text-white/40">{t("list.total")}</p>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div
              className={`group bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/[0.04] hover:border-amber-500/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-500/5 transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/15 to-orange-500/15 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <ClockIcon className="h-4 w-4 text-amber-400" />
                  {pendingCount > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-white group-hover:scale-105 transition-transform duration-300">{pendingCount}</p>
                  <p className="text-[10px] text-white/40">{t("list.pending")}</p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div
              className={`group bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/[0.04] hover:border-emerald-500/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <CheckCircleSolid className="h-4 w-4 text-emerald-400" />
                  {completedCount > 0 && (
                    <div className="absolute inset-0 rounded-lg bg-emerald-500/15 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '1.5s' }} />
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-white group-hover:scale-105 transition-transform duration-300">{completedCount}</p>
                  <p className="text-[10px] text-white/40">{t("list.done")}</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div
              className={`group bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/[0.04] hover:border-fuchsia-500/30 hover:-translate-y-0.5 hover:shadow-md hover:shadow-fuchsia-500/5 transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="flex items-center gap-2.5">
                <div className={`relative h-8 w-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 ${completionRate === 100 ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 animate-pulse' : 'bg-gradient-to-br from-fuchsia-500/15 to-pink-500/15'}`}>
                  {completionRate === 100 ? (
                    <TrophyIcon className="h-4 w-4 text-white animate-bounce" />
                  ) : (
                    <FireIcon className="h-4 w-4 text-fuchsia-400" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:scale-105 transition-transform duration-300">{completionRate}%</p>
                  <p className="text-[10px] text-white/40">{t("list.progress")}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Animated Progress Bar */}
        {tasks.length > 0 && (
          <div
            className={`mb-5 bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:border-white/15 transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white/60 flex items-center gap-1.5">
                {completionRate === 100 ? (
                  <>
                    <SparklesIcon className="h-3 w-3 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                    {t("list.allDone")}
                  </>
                ) : completionRate >= 50 ? (
                  <>
                    <FireIcon className="h-3 w-3 text-orange-400 animate-pulse" />
                    {t("list.keepItUp")}
                  </>
                ) : (
                  <>
                    <RocketLaunchIcon className="h-3 w-3 text-violet-400 animate-bounce" />
                    {t("list.makeProgress")}
                  </>
                )}
              </span>
              <span className="text-xs font-medium text-violet-400">{t("list.completedOf", { completed: String(completedCount), total: String(tasks.length) })}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${completionRate}%` }}
              >
                {/* Shimmer effect on progress bar */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div
          className={`flex flex-col sm:flex-row gap-2.5 mb-5 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '600ms' }}
        >
          {/* Add Task Button */}
          {!showForm && (
            <button
              onClick={() => {
                setEditingTask(undefined);
                setShowForm(true);
              }}
              className="
                group relative inline-flex items-center justify-center gap-2
                px-4 py-2.5 rounded-lg font-medium
                bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white
                shadow-md shadow-violet-500/25
                hover:shadow-lg hover:shadow-violet-500/40
                hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-300
                overflow-hidden
              "
              title="Add new task (Ctrl+N)"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <PlusIcon className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
              <span className="relative z-10 text-sm">{t("tasks.addTask")}</span>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-lg bg-violet-400/30 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '1s' }} />
            </button>
          )}

          {/* Search & Filter */}
          {tasks.length > 0 && !showForm && (
            <div className="flex gap-1.5 flex-1">
              {/* Search */}
              <div className="relative flex-1 group">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors duration-300" />
                <input
                  id="search-input"
                  type="text"
                  placeholder={t("tasks.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-8 pr-8 py-2.5 rounded-lg
                    bg-white/[0.02] backdrop-blur-sm
                    text-white placeholder:text-white/30
                    border border-white/10
                    focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
                    focus:bg-white/[0.03]
                    transition-all duration-300 text-xs
                  "
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 hover:scale-110 transition-all duration-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex bg-white/[0.02] rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={() => setViewType("list")}
                  className={`p-2.5 transition-all duration-300 hover:scale-105 ${viewType === "list" ? "bg-violet-500/20 text-violet-400" : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"}`}
                  aria-label="List view"
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-2.5 transition-all duration-300 hover:scale-105 ${viewType === "grid" ? "bg-violet-500/20 text-violet-400" : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"}`}
                  aria-label="Grid view"
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Dropdown */}
              <div className="relative group">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="
                    appearance-none px-3 py-2.5 pr-7 rounded-lg text-xs
                    bg-white/[0.02] backdrop-blur-sm text-white
                    border border-white/10
                    focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
                    cursor-pointer transition-all duration-300
                    hover:bg-white/[0.03]
                  "
                >
                  <option value="all" className="bg-[#0a0a0f]">{t("common.all")}</option>
                  <option value="pending" className="bg-[#0a0a0f]">{t("common.pending")}</option>
                  <option value="completed" className="bg-[#0a0a0f]">{t("common.completed")}</option>
                </select>
                <FunnelIcon className="h-3.5 w-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none group-hover:text-violet-400 transition-colors duration-300" />
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 p-3 rounded-lg animate-shake">
            <p className="text-xs text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Task Form with animation */}
        {showForm && (
          <div className="mb-5 animate-scale-in">
            <TaskForm
              task={editingTask}
              userId={userId}
              onSave={handleSaveTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(undefined);
              }}
            />
          </div>
        )}

        {/* Task List */}
        {filteredTasks.length === 0 && !showForm ? (
          <div
            className={`relative bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 text-center transition-all duration-700 overflow-hidden ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{ transitionDelay: '700ms' }}
          >
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-violet-500/5 rounded-full blur-xl animate-float-slow" />
              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '-2s' }} />
            </div>

            <div className="relative z-10">
              {/* Animated icon container */}
              <div className="relative inline-block mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center animate-levitate border border-white/10">
                  <ClipboardDocumentListIcon className="h-8 w-8 text-white/30 animate-pulse" />
                </div>
                {/* Orbiting sparkles */}
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '8s' }}>
                  <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-violet-400 rounded-full shadow-lg shadow-violet-500/50" />
                </div>
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                  <div className="absolute top-1/2 -right-1 w-1 h-1 bg-fuchsia-400 rounded-full shadow-lg shadow-fuchsia-500/50" />
                </div>
                {/* Corner badge */}
                <div className="absolute -bottom-2 -right-2 h-7 w-7 bg-gradient-to-br from-violet-500/30 to-fuchsia-600/30 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30 animate-bounce-gentle">
                  <SparklesIcon className="h-3 w-3 text-white animate-spin-slow" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {searchQuery || filter !== "all" ? t("tasks.emptySearch") : t("tasks.empty")}
              </h3>
              <p className="text-white/40 mb-6 max-w-sm mx-auto animate-fade-in-up text-sm" style={{ animationDelay: '0.3s' }}>
                {searchQuery || filter !== "all"
                  ? t("tasks.emptySearchDesc")
                  : t("tasks.emptyDesc")}
              </p>
              {!searchQuery && filter === "all" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="
                    group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                    bg-gradient-to-r from-violet-600 to-fuchsia-600
                    text-white font-medium
                    hover:shadow-xl hover:shadow-violet-500/40
                    hover:-translate-y-0.5 hover:scale-105
                    transition-all duration-300
                    animate-fade-in-up overflow-hidden
                    text-sm
                  "
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <SparklesIcon className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="relative z-10">{t("tasks.createFirst")}</span>
                  <RocketLaunchIcon className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={viewType === "grid" ? "grid sm:grid-cols-2 gap-3 sm:gap-4" : "space-y-3"}>
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className={`
                  transition-all duration-700 ease-out
                  ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
                  animate-task-enter
                `}
                style={{
                  transitionDelay: `${Math.min(800 + index * 80, 1500)}ms`,
                  animationDelay: `${Math.min(index * 80, 500)}ms`
                }}
              >
                <TaskCard
                  task={task}
                  index={index}
                  onToggle={handleToggleComplete}
                  onEdit={(id) => {
                    setEditingTask(tasks.find((t) => t.id === id));
                    setShowForm(true);
                  }}
                  onDelete={openDeleteModal}
                />
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Compact Mobile Stats Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/[0.04] backdrop-blur-xl border-t border-white/15 p-2.5 z-30">
        <div className="flex justify-around items-center">
          <div className="text-center group">
            <div className="text-lg font-bold text-amber-400 group-hover:scale-110 transition-transform duration-300">{pendingCount}</div>
            <div className="text-[9px] text-white/40 tracking-wide">{t("list.pending")}</div>
          </div>
          <div className="w-0.5 h-6 bg-white/15" />
          <div className="text-center group">
            <div className="text-lg font-bold text-emerald-400 group-hover:scale-110 transition-transform duration-300">{completedCount}</div>
            <div className="text-[9px] text-white/40 tracking-wide">{t("list.done")}</div>
          </div>
          <div className="w-0.5 h-6 bg-white/15" />
          <div className="text-center group">
            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 group-hover:scale-110 transition-transform duration-300">{completionRate}%</div>
            <div className="text-[9px] text-white/40 tracking-wide">{t("list.progress")}</div>
          </div>
        </div>
      </div>

    </div>
  );
}
