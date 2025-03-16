// components/toast-provider.tsx
"use client";

import { Toaster as SonnerToaster } from "sonner";

export function ToastProvider() {
  return (
    <SonnerToaster 
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        className: "my-toast-class"
      }}
    />
  );
}

// lib/toast.ts
// A utility module for more advanced toast options
import { toast } from "sonner";

export interface ToastOptions {
  duration?: number;
  important?: boolean;
  dismissible?: boolean;
  className?: string;
}

export function showToast(message: string, options?: ToastOptions) {
  toast(message, options);
}

export function showSuccessToast(message: string, options?: ToastOptions) {
  toast.success(message, options);
}

export function showErrorToast(message: string, options?: ToastOptions) {
  toast.error(message, options);
}

export function showInfoToast(message: string, options?: ToastOptions) {
  toast.info(message, options);
}

export function showWarningToast(message: string, options?: ToastOptions) {
  toast.warning(message, options);
}

export function showLoadingToast(message: string, options?: ToastOptions) {
  toast.loading(message, options);
}

export function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  },
  options?: ToastOptions
) {
  // Sonner's toast.promise expects a single options object with both messages and toast options
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    ...options // Spread any additional options
  });
}

// Usage example:
/*
import { showSuccessToast, showErrorToast } from "@/lib/toast";

// Success toast
showSuccessToast("Quiz created successfully!");

// Error toast
showErrorToast("Failed to load quiz data");

// Promise toast
showPromiseToast(
  fetchData(), 
  {
    loading: "Loading...",
    success: "Data loaded successfully",
    error: "Failed to load data"
  }
);
*/