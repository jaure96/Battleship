import { Toast, ToastType } from "@/types/toast";
import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  const show = (
    message: string,
    type: ToastType = ToastType.INFO,
    duration: number = 3000
  ) => {
    setToast({ message, type, duration, id: Date.now() });
  };

  const success = (message: string, duration: number) =>
    show(message, ToastType.SUCCESS, duration);

  const error = (message: string, duration: number) =>
    show(message, ToastType.ERROR, duration);

  const info = (message: string, duration: number) =>
    show(message, ToastType.INFO, duration);

  const warning = (message: string, duration: number) =>
    show(message, ToastType.WARNING, duration);

  return { toast, setToast, show, success, error, info, warning };
};
