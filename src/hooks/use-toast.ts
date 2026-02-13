import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

type ToastOpts = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  id?: string | number;
  className?: string;
  important?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function toast(opts: ToastOpts) {
  const {
    title,
    description,
    variant = "default",
    duration,
    id,
    important,
    action,
    className
  } = opts;

  const common = {
    id,
    duration,
    className,
    important,
    description: description as any,
    action: action
        ? {
          label: action.label,
          onClick: action.onClick,
        }
        : undefined,
  };

  const message = title ?? (typeof description === "string" ? description : " ");

  let toastId: string | number;

  switch (variant) {
    case "success":
      toastId = sonnerToast.success(message as any, common);
      break;
    case "error":
      toastId = sonnerToast.error(message as any, common);
      break;
    case "warning":
      toastId = sonnerToast.warning(message as any, common);
      break;
    case "info":
      toastId = sonnerToast.info(message as any, common);
      break;
    default:
      toastId = sonnerToast(message as any, common);
      break;
  }

  return {
    id: toastId,
    dismiss: () => sonnerToast.dismiss(toastId),
    className: className,
    update: (next: ToastOpts) => {
      return toast({ ...opts, ...next, id: toastId });
    },
  };
}

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
    toasts: [],
  };
}
