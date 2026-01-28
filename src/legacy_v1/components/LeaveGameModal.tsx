'use client';

interface LeaveGameModalProps {
  onGoHome: () => void;
  onCancel: () => void;
}

export function LeaveGameModal({ onGoHome, onCancel }: LeaveGameModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md space-y-6 overflow-y-auto rounded-lg border-2 border-yellow-500 bg-gray-900 p-6 shadow-2xl sm:p-8">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 text-center">
          <h2 className="font-mono text-xl font-bold text-yellow-400 sm:text-2xl">Leave to home screen?</h2>
          <p className="font-mono text-sm text-gray-300 sm:text-base">
            Progress since your <span className="font-bold text-yellow-400">last auto-save</span> will be lost.
          </p>
          <p className="font-mono text-xs text-gray-400">
            Auto-save happens at year-end and game-over. Use the <span className="text-emerald-400">Save</span> button
            to save manually.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onGoHome}
            className="w-full rounded-lg border-2 border-yellow-500 bg-yellow-500/10 px-6 py-3 font-mono text-base font-bold text-yellow-400 transition-all hover:bg-yellow-500 hover:text-black sm:py-4"
          >
            🏠 Go to Home Screen
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-lg border-2 border-gray-500 bg-gray-500/10 px-6 py-3 font-mono text-base font-bold text-gray-300 transition-all hover:bg-gray-500/20 hover:text-white sm:py-4"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
