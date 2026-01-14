"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tasks");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
    </div>
  );
}
