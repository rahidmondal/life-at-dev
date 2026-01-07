'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 2000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: 'bg-emerald-500/90 text-black border-emerald-400',
    error: 'bg-red-500/90 text-white border-red-400',
    info: 'bg-cyan-500/90 text-black border-cyan-400',
  };

  const icons = {
    success: '💾',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border-2 px-4 py-3 font-mono text-sm font-bold shadow-lg backdrop-blur-sm transition-all duration-300 sm:bottom-6 sm:right-6 sm:px-6 sm:py-4 sm:text-base ${
        styles[type]
      } ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      <span className="text-lg sm:text-xl">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}

interface ToastContainerProps {
  toasts: { id: string; message: string; type?: 'success' | 'error' | 'info' }[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => {
            onRemove(toast.id);
          }}
        />
      ))}
    </>
  );
}
