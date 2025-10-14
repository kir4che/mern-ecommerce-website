import { useEffect, useRef } from "react";

import Button from "@/components/atoms/Button";
import Alert from "@/components/atoms/Alert";

import CloseIcon from "@/assets/icons/xmark.inline.svg?react";

interface ModalProps {
  id: string;
  onConfirm: () => void | boolean | Promise<void | boolean>;
  onClose?: () => void;
  title?: string;
  confirmText?: string;
  width?: string;
  className?: string;
  isShowCloseIcon?: boolean;
  isShowCloseBtn?: boolean;
  loading?: boolean;
  autoCloseDelay?: number; // 預設 3 秒後自動關閉
  disabled?: boolean;
  children?: React.ReactNode;
  showAlert?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  id,
  onConfirm,
  onClose,
  title,
  confirmText = "確認",
  width = "w-96",
  className = "",
  isShowCloseIcon = false,
  isShowCloseBtn = true,
  loading = false,
  autoCloseDelay = 3000,
  disabled = false,
  children,
  showAlert = false,
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    onClose?.();
    modalRef.current?.close();
  };

  // 當 Modal 關閉時，重置 scrollTop。
  useEffect(() => {
    if (!modalRef.current) return;
    const modal = modalRef.current;

    const resetScroll = () => {
      if (contentRef.current) contentRef.current.scrollTop = 0;
    };

    modal.addEventListener("close", resetScroll);
    return () => {
      modal.removeEventListener("close", resetScroll);
    };
  }, [id]);

  // 若 loading 為 true 且 isOpen 為 true，則開始倒數自動關閉 Modal。
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => handleClose(), autoCloseDelay);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, autoCloseDelay]);

  return (
    <dialog id={id} ref={modalRef} className="modal">
      <div
        className={`modal-box p-0 flex flex-col ${!children ? "py-6" : ""} ${width} ${className}`}
      >
        <div
          className={`flex items-center justify-between px-8 ${children ? "border-b py-4" : ""}`}
        >
          {title && <h3 className="text-lg font-bold">{title}</h3>}
          {isShowCloseIcon && (
            <Button
              variant="icon"
              icon={CloseIcon}
              onClick={handleClose}
              className={`border-none h-fit ${!title ? "ml-auto" : ""}`}
            />
          )}
        </div>
        {children && (
          <div
            ref={contentRef}
            className="px-8 overflow-y-auto py-2 max-h-[calc(90vh-120px)]"
          >
            {children}
          </div>
        )}
        {!loading && (
          <div
            className={`flex justify-end px-8 modal-action ${children ? " border-t py-4" : ""}`}
          >
            <Button
              onClick={async () => {
                // 若 onConfirm 回傳 false，則不關閉 Modal，但沒有回傳值時預設為 true。
                const isSuccess = (await onConfirm()) ?? true;
                if (isSuccess) handleClose();
              }}
              className="h-9"
              disabled={disabled}
            >
              {confirmText}
            </Button>
            {isShowCloseBtn && (
              <Button variant="secondary" onClick={handleClose} className="h-9">
                取消
              </Button>
            )}
          </div>
        )}
      </div>
      {!isShowCloseIcon && (
        <form method="dialog" className="modal-backdrop">
          <button />
        </form>
      )}
      {showAlert && <Alert />}
    </dialog>
  );
};

export default Modal;
