import { useEffect, useImperativeHandle, useRef } from "react";

import Alert from "@/components/atoms/Alert";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

import CloseIcon from "@/assets/icons/xmark.inline.svg?react";

export interface ModalRef {
  showModal: () => void;
  close: () => void;
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
  showAlert?: boolean;
}

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
  showAlert = false,
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
        {!loading && (
          <div
            className={cn(
              "modal-action px-6 py-4 m-0 rounded-b-box",
              children && "border-t border-gray-100"
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
      {showAlert && <Alert />}
    </dialog>
  );
};

export default Modal;
