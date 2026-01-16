"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { isAuthenticated, getAuthUser } from "@/lib/auth";
import ChatInterface from "@/components/ChatInterface";

/**
 * Protected Chat Page
 * Requires authentication to access
 * Redirects to signin if user is not authenticated
 */
export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check authentication on mount
    if (!isAuthenticated()) {
      router.push("/signin");
      return;
    }

    const authUser = getAuthUser();
    if (!authUser) {
      router.push("/signin");
      return;
    }

    setIsAuth(true);
    setLoading(false);
  }, [router]);

  if (loading || !isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return <ChatInterface />;
}
