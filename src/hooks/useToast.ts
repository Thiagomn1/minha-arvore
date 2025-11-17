/**
 * Hook para exibir toasts/notificações
 */
import { useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export function useToast() {
  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const toastContainer = document.getElementById("toast-container");
      if (!toastContainer) {
        console.warn("Toast container not found");
        return;
      }

      const alertClass = {
        success: "alert-success",
        error: "alert-error",
        info: "alert-info",
        warning: "alert-warning",
      }[type];

      const toast = document.createElement("div");
      toast.className = `alert ${alertClass} shadow-lg`;
      toast.innerHTML = `<span>${message}</span>`;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 3000);
    },
    []
  );

  return { showToast };
}
