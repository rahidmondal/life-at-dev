'use client';

interface RestartConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function RestartConfirmModal({ onConfirm, onCancel }: RestartConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6 rounded-lg border-2 border-red-500 bg-gray-900 p-6 shadow-2xl sm:p-8">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 text-center">
          <h2 className="font-mono text-xl font-bold text-red-400 sm:text-2xl">Restart Game?</h2>
          <p className="font-mono text-sm text-gray-300 sm:text-base">
            This will <span className="font-bold text-red-400">permanently delete</span> your saved game.
          </p>
          <p className="font-mono text-sm text-gray-400">You cannot undo this action.</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-gray-500 bg-gray-500/10 px-6 py-3 font-mono text-base font-bold text-gray-300 transition-all hover:bg-gray-500/20 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg border-2 border-red-500 bg-red-500 px-6 py-3 font-mono text-base font-bold text-white transition-all hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/50"
          >
            Yes, Restart
          </button>
        </div>
      </div>
    </div>
  );
}
