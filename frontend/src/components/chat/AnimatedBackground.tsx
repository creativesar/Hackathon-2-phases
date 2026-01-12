"use client";

/**
 * AnimatedBackground Component
 * Exact same background as tasks page with aurora effect
 */
export default function AnimatedBackground() {
  return (
    <>
      {/* Animated background with aurora effect */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-[#0a0a0f] to-fuchsia-950/30" />
        {/* Pulsating orbs with morphing */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-morph-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-morph-slow" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] animate-breathe" />
        {/* Moving gradient beam */}
        <div className="absolute inset-0 bg-gradient-conic from-violet-500/10 via-transparent to-fuchsia-500/10 animate-spin-very-slow" style={{ animationDuration: '20s' }} />
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
    </>
  );
}

