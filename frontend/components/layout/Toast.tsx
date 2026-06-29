'use client';

import { create } from 'zustand';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = 'bg-white border-green-500';
        let iconColor = 'text-green-500';
        let IconComponent = CheckCircle;

        if (toast.type === 'error') {
          bgColor = 'bg-white border-red-500';
          iconColor = 'text-red-500';
          IconComponent = AlertCircle;
        } else if (toast.type === 'warning') {
          bgColor = 'bg-white border-amber-500';
          iconColor = 'text-amber-500';
          IconComponent = AlertCircle;
        } else if (toast.type === 'info') {
          bgColor = 'bg-white border-blue-500';
          iconColor = 'text-blue-500';
          IconComponent = Info;
        }

        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 p-4 rounded-xl border bg-white shadow-lg pointer-events-auto transition-all duration-300 font-sans border-l-4"
            style={{
              borderLeftColor: toast.type === 'error' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : toast.type === 'info' ? '#3b82f6' : '#10b981'
            }}
          >
            <IconComponent className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
            <div className="flex-1 text-xs md:text-sm font-semibold text-[#222222]">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Shortcut object
export const toast = {
  success: (msg: string) => useToastStore.getState().addToast(msg, 'success'),
  error: (msg: string) => useToastStore.getState().addToast(msg, 'error'),
  warning: (msg: string) => useToastStore.getState().addToast(msg, 'warning'),
  info: (msg: string) => useToastStore.getState().addToast(msg, 'info'),
};
