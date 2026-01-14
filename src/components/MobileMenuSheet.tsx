'use client';

interface MobileMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onGoHome: () => void;
  isSaving: boolean;
  isStorageReady: boolean;
}

export function MobileMenuSheet({
  isOpen,
  onClose,
  onSave,
  onGoHome,
  isSaving,
  isStorageReady,
}: MobileMenuSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-emerald-500/30 bg-gray-950/95 pb-safe backdrop-blur-lg">
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="h-1 w-10 rounded-full bg-gray-600" />
        </div>

        {/* Menu Items */}
        <div className="space-y-2 px-4 pb-4">
          <h3 className="pb-2 font-mono text-xs font-bold text-gray-500">GAME MENU</h3>

          {/* Save Game */}
          {isStorageReady && (
            <button
              onClick={() => {
                onSave();
                onClose();
              }}
              disabled={isSaving}
              className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 font-mono text-sm font-bold transition-all ${
                isSaving
                  ? 'animate-pulse border-emerald-400 bg-emerald-500 text-black'
                  : 'border-emerald-500/50 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-500 hover:text-black'
              }`}
            >
              <span className="text-xl">💾</span>
              <span>{isSaving ? 'Saving...' : 'Save Game'}</span>
            </button>
          )}

          {/* Exit to Main Menu */}
          <button
            onClick={() => {
              onGoHome();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-xl border-2 border-red-500/50 bg-red-950/30 px-4 py-3 font-mono text-sm font-bold text-red-400 transition-all hover:bg-red-500 hover:text-black"
          >
            <span className="text-xl">🚪</span>
            <span>Exit to Menu</span>
          </button>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-700 bg-gray-900/50 px-4 py-3 font-mono text-sm font-bold text-gray-400 transition-all hover:bg-gray-800 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
