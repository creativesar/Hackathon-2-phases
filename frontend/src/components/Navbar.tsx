"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { isAuthenticated, signOut, getAuthUser } from "@/lib/auth";
import { useRouter } from "@/i18n/routing";
import { useToast } from "@/components/Toast";
import {
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("HomePage");
  const { showToast } = useToast();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const auth = isAuthenticated();
      setIsAuthenticatedUser(auth);
      if (auth) {
        const userData = getAuthUser();
        setUser(userData);
      }
    };

    checkAuth();

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    signOut();
    showToast(t("nav.logout") + " " + t("common.success"), "info");
    router.push("/");
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  // Close menu when navigating
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={handleNavClick}
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-xl group-hover:shadow-violet-500/30 transition-all duration-300 group-hover:scale-105">
                <CheckCircleSolid className="h-6 w-6 text-white" />
              </div>
              {/* Pulse ring on logo */}
              <div className="absolute inset-0 rounded-xl bg-violet-500/20 animate-ping" style={{ animationDuration: '2s' }} />
            </div>
            <span className="text-xl font-display font-bold text-white tracking-tight">TaskFlow</span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticatedUser ? (
              <>
                <Link
                  href="/tasks"
                  className={`group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive("/tasks")
                      ? "text-white bg-white/[0.08]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                  onClick={handleNavClick}
                >
                  <ClipboardDocumentListIcon className="h-4 w-4" />
                  <span>Tasks</span>
                </Link>
                <Link
                  href="/chat"
                  className={`group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive("/chat")
                      ? "text-white bg-white/[0.08]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                  onClick={handleNavClick}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>Chat</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive("/")
                      ? "text-white bg-white/[0.08]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                  onClick={handleNavClick}
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            {isAuthenticatedUser ? (
              <div className="flex items-center gap-2">
                <div className="text-sm text-white/60 hidden sm:block">
                  {user?.name || user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                  aria-label={t("nav.logout")}
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                  onClick={handleNavClick}
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={handleNavClick}
                >
                  {t("getStarted")}
                  <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl rounded-b-xl">
            <div className="flex flex-col gap-2">
              {isAuthenticatedUser ? (
                <>
                  <Link
                    href="/tasks"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive("/tasks")
                        ? "text-white bg-white/[0.08]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                    onClick={handleNavClick}
                  >
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                    <span>Tasks</span>
                  </Link>
                  <Link
                    href="/chat"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive("/chat")
                        ? "text-white bg-white/[0.08]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                    onClick={handleNavClick}
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    <span>Chat</span>
                  </Link>
                  <div className="px-4 py-3">
                    <div className="text-sm text-white/60 mb-2">
                      {user?.name || user?.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      aria-label={t("nav.logout")}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive("/")
                        ? "text-white bg-white/[0.08]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                    onClick={handleNavClick}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/signin"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive("/signin")
                        ? "text-white bg-white/[0.08]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                    onClick={handleNavClick}
                  >
                    <UserIcon className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive("/signup")
                        ? "text-white bg-white/[0.08]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`}
                    onClick={handleNavClick}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}