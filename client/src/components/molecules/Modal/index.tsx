import { useState, useEffect, useRef } from "react";

import Button from "@/components/atoms/Button";

import { ReactComponent as CloseIcon } from "@/assets/icons/xmark.inline.svg";

interface ModalProps {
  id: string;
  onOpen?: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  width?: string;
  className?: string;
  isShowCloseIcon?: boolean;
  isShowCloseBtn?: boolean;
  loading?: boolean;
  autoCloseDelay?: number; // 預設 3 秒後自動關閉
  disabled?: boolean;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  id,
  onConfirm,
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
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const closeModal = () => modalRef.current?.close();

  // 若 loading 為 true 且 isOpen 為 true，則開始倒數自動關閉 Modal。
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => closeModal(), autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [loading, autoCloseDelay]);

  return (
    <dialog id={id} ref={modalRef} className="modal">
      <div className={`modal-box ${width} ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">{title}</h3>
          {isShowCloseIcon && (
            <Button
              variant="icon"
              icon={CloseIcon}
              onClick={closeModal}
              className="border-none"
            />
          )}
        </div>
        {children}
        {loading ? (
          <span className="loading loading-spinner loading-lg" />
        ) : (
          <div className="modal-action">
            <Button
              onClick={() => {
                onConfirm();
                closeModal();
              }}
              className="h-9"
              disabled={disabled}
            >
              {confirmText}
            </Button>
            {isShowCloseBtn && (
              <Button variant="secondary" onClick={closeModal} className="h-9">
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
    </dialog>
  );
};

export default Modal;
