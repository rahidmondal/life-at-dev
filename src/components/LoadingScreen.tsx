'use client';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <div className="h-24 w-24 animate-pulse rounded-lg bg-emerald-500/20 sm:h-32 sm:w-32" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-4xl font-bold text-emerald-400 sm:text-5xl">💻</span>
          </div>
        </div>

        {/* Spinner */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
        </div>

        {/* Loading text */}
        <p className="font-mono text-sm text-gray-400 sm:text-base">Loading...</p>
      </div>
    </div>
  );
}
