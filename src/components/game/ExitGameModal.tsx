'use client';

import { AlertTriangleIcon, HomeIcon, XIcon } from '../ui/icons';

interface ExitGameModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ExitGameModal: Confirmation modal when user wants to exit the game.
 * Warns about unsaved progress and offers options to go home or cancel.
 */
export function ExitGameModal({ onConfirm, onCancel }: ExitGameModalProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-md mx-4 bg-[#161B22] border-2 border-[#F0883E] rounded-lg shadow-[0_0_40px_rgba(240,136,62,0.3)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#F0883E]/10 border-b border-[#F0883E]/30 px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F0883E]/20 flex items-center justify-center">
            <AlertTriangleIcon size={24} className="text-[#F0883E]" />
          </div>
          <div>
            <h2 className="text-[#F0883E] font-bold text-lg">Exit Game?</h2>
            <p className="text-[#8B949E] text-xs">Are you sure you want to leave?</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-[#C9D1D9] text-sm">
            Progress since your <span className="text-[#F0883E] font-bold">last save</span> will be lost.
          </p>
          <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3">
            <p className="text-[#8B949E] text-xs">
              💡 <span className="text-[#39D353]">Tip:</span> Auto-save happens at year-end and game-over. Use the{' '}
              <span className="text-[#39D353] font-bold">Save</span> button to save manually anytime.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-[#0D1117] border-t border-[#30363D] flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#F0883E]/20 border border-[#F0883E] rounded-lg text-[#F0883E] font-bold text-sm hover:bg-[#F0883E]/30 transition-colors"
          >
            <HomeIcon size={18} />
            Exit to Home Screen
          </button>
          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#30363D]/50 border border-[#30363D] rounded-lg text-[#8B949E] font-medium text-sm hover:text-[#C9D1D9] hover:border-[#484F58] transition-colors"
          >
            <XIcon size={18} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
