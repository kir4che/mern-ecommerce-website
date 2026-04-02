import { useEffect, useImperativeHandle, useRef } from "react";

import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

import CloseIcon from "@/assets/icons/xmark.inline.svg?react";
import ErrorIcon from "@/assets/icons/error.inline.svg?react";
import InfoIcon from "@/assets/icons/info.inline.svg?react";
import SuccessIcon from "@/assets/icons/success.inline.svg?react";
import WarningIcon from "@/assets/icons/warning.inline.svg?react";

export interface ModalRef {
  showModal: () => void;
  close: () => void;
}

interface ModalAlert {
  variant: "info" | "success" | "error" | "warning";
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ModalProps {
  ref?: React.Ref<ModalRef>;
  id?: string;
  onConfirm: () => void | boolean | Promise<void | boolean>;
  onClose?: () => void;
  title?: string;
  confirmText?: string;
  width?: string;
  className?: string;
  isShowCloseIcon?: boolean;
  isShowCloseBtn?: boolean;
  loading?: boolean;
  isLoading?: boolean;
  autoCloseDelay?: number; // 預設 3 秒後自動關閉
  disabled?: boolean;
  children?: React.ReactNode;
  modalAlert?: ModalAlert;
  onAlertActionClick?: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  info: InfoIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  error: ErrorIcon,
};

const alertStyleMap: Record<string, string> = {
  info: "bg-sky-50 text-sky-600",
  warning: "bg-yellow-50 text-yellow-600",
  success: "bg-green-50 text-green-600",
  error: "bg-red-50 text-red-500",
};

const alertButtonStyleMap: Record<string, string> = {
  info: "bg-sky-100 text-sky-700 hover:bg-sky-200",
  warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  success: "bg-green-100 text-green-700 hover:bg-green-200",
  error: "bg-red-100 text-red-700 hover:bg-red-200",
};

const ModalAlertUI = ({
  alert,
  onActionClick,
}: {
  alert: ModalAlert;
  onActionClick?: () => void;
}) => {
  const Icon = iconMap[alert.variant];
  const styleClass = alertStyleMap[alert.variant] || alertStyleMap.info;
  const buttonStyle =
    alertButtonStyleMap[alert.variant] || alertButtonStyleMap.info;

  return (
    <div
      role="alert"
      className={cn(
        "alert flex items-center rounded-md gap-3 border-none py-3 px-4 font-medium",
        styleClass
      )}
    >
      {Icon && <Icon className="size-5 shrink-0 stroke-current" />}
      <p className="flex-1">{alert.message}</p>
      {alert.action && (
        <Button
          onClick={() => {
            alert.action?.onClick();
            onActionClick?.();
          }}
          className={cn(
            "shrink-0 text-sm font-semibold transition-colors",
            buttonStyle
          )}
        >
          {alert.action.label}
        </Button>
      )}
    </div>
  );
};

const Modal = ({
  ref,
  id,
  onConfirm,
  onClose,
  title,
  confirmText = "確認",
  width = "max-w-md",
  className = "",
  isShowCloseIcon = false,
  isShowCloseBtn = true,
  loading = false,
  isLoading = false,
  autoCloseDelay = 3000,
  disabled = false,
  children,
  modalAlert,
  onAlertActionClick,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const handleClose = () => {
    if (isLoading) return;
    dialogRef.current?.close();
  };

  const handleNativeClose = () => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    onClose?.();
  };

  const handleConfirm = async () => {
    if (isLoading) return;
    try {
      const isSuccess = (await onConfirm()) ?? true;
      if (isSuccess) handleClose();
    } catch (err: unknown) {
      console.error("Modal confirm error:", err);
    }
  };

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      dialogRef.current?.close();
    }, autoCloseDelay);
    return () => clearTimeout(timer);
  }, [loading, autoCloseDelay]);

  return (
    <dialog
      id={id}
      ref={dialogRef}
      className="modal"
      onClose={handleNativeClose}
      onCancel={(e) => {
        if (isLoading) e.preventDefault();
      }}
    >
      <div className={cn("modal-box p-0", width, className)}>
        {(title || isShowCloseIcon) && (
          <div
            className={cn(
              "flex-between px-6 py-4",
              children ? "border-b border-gray-100" : ""
            )}
          >
            {title && <h3 className="text-lg font-bold">{title}</h3>}
            {isShowCloseIcon && (
              <Button
                variant="icon"
                icon={CloseIcon}
                onClick={handleClose}
                disabled={isLoading}
                className={cn("btn-sm btn-ghost", !title && "ml-auto")}
              />
            )}
          </div>
        )}
        {children && (
          <div
            ref={contentRef}
            className="px-6 py-4 overflow-y-auto max-h-[60vh]"
          >
            {children}
          </div>
        )}
        {modalAlert && (
          <div className="px-6 py-3">
            <ModalAlertUI
              alert={modalAlert}
              onActionClick={onAlertActionClick}
            />
          </div>
        )}
        {!loading && (
          <div
            className={cn(
              "modal-action px-6 py-4 m-0 rounded-b-box",
              (children || modalAlert) && "border-t border-gray-100"
            )}
          >
            {isShowCloseBtn && (
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={disabled || isLoading}
              >
                取消
              </Button>
            )}
            <Button onClick={handleConfirm} disabled={disabled || isLoading}>
              {confirmText}
            </Button>
          </div>
        )}
      </div>
      {!isShowCloseIcon && (
        <form method="dialog" className="modal-backdrop">
          <button aria-label="close" disabled={isLoading}>
            關閉
          </button>
        </form>
      )}
    </dialog>
  );
};

export default Modal;
