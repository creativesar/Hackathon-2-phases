"use client";

/**
 * LoadingSkeleton Component
 * Beautiful loading state that mimics the actual chat interface
 */
export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header Skeleton */}
      <header className="sticky top-0 z-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 animate-pulse" />
              <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
            </div>

            {/* Right side skeleton */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block space-y-2">
                <div className="h-5 w-40 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 w-10 rounded-xl bg-white/5 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6 h-[calc(100vh-10rem)]">
          {/* Conversation Sidebar Skeleton */}
          <div className="hidden lg:block w-80 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="h-6 w-32 bg-white/5 rounded-lg animate-pulse mb-4" />
              <div className="h-10 bg-white/5 rounded-lg animate-pulse mb-3" />
              <div className="h-10 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-lg animate-pulse" />
            </div>
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-3 bg-white/[0.03] rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="h-4 w-3/4 bg-white/5 rounded mb-2" />
                  <div className="h-3 w-full bg-white/5 rounded mb-2" />
                  <div className="flex justify-between">
                    <div className="h-3 w-16 bg-white/5 rounded" />
                    <div className="h-3 w-12 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area Skeleton */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages skeleton */}
            <div className="flex-1 overflow-hidden mb-4 px-2 space-y-4">
              {/* User message skeleton */}
              <div className="flex justify-end animate-fade-in">
                <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 backdrop-blur-xl border border-white/10">
                  <div className="h-4 w-48 bg-white/10 rounded mb-2 animate-pulse" />
                  <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
                </div>
              </div>

              {/* Bot message skeleton */}
              <div className="flex justify-start animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-white/[0.03] backdrop-blur-xl border border-white/10">
                  <div className="h-4 w-56 bg-white/5 rounded mb-2 animate-pulse" />
                  <div className="h-4 w-72 bg-white/5 rounded mb-2 animate-pulse" />
                  <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
                </div>
              </div>

              {/* User message skeleton */}
              <div className="flex justify-end animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 backdrop-blur-xl border border-white/10">
                  <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
                </div>
              </div>

              {/* Typing indicator skeleton */}
              <div className="flex justify-start animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 animate-pulse" />
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 bg-violet-400/50 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-fuchsia-400/50 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                      <div className="w-2.5 h-2.5 bg-pink-400/50 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input skeleton */}
            <div className="relative">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 animate-pulse">
                <div className="flex items-end gap-3">
                  <div className="flex-1 h-12 bg-white/5 rounded-xl" />
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Task Sidebar Skeleton */}
          <div className="hidden lg:block w-80 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse mb-4" />
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="h-4 w-12 bg-white/5 rounded mb-1 animate-pulse" />
                  <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="h-4 w-12 bg-white/5 rounded mb-1 animate-pulse" />
                  <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-3 bg-white/[0.03] rounded-xl border border-white/10 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-12 bg-white/5 rounded" />
                      <div className="h-4 w-full bg-white/5 rounded" />
                      <div className="h-3 w-3/4 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Shimmer overlay effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
      </div>
    </div>
  );
}
