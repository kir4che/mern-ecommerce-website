import { useEffect, useRef } from "react";

import Button from "@/components/atoms/Button";

interface ModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  title?: string;
  confirmText?: string;
  width?: string;
  className?: string;
  title: string;
  content?: string;
  loading?: boolean;
  autoCloseDelay?: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
  className = "",
  title,
  content,
  loading = false,
  autoCloseDelay = 3000, // 預設 3 秒後自動關閉
}) => {
  useEffect(() => {
    if (loading && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [loading, autoCloseDelay]);

  return (
    <dialog id={id} ref={modalRef} className="modal">
      <div className={`modal-box ${width} ${className}`}>
        <div className="flex items-center justify-between mb-2">
          {title && <h3 className="text-lg font-bold">{title}</h3>}
          {isShowCloseIcon && (
            <Button
              variant="icon"
              icon={CloseIcon}
              onClick={closeModal}
              className={`border-none h-fit ${!title && "ml-auto"}`}
            />
          )}
        </div>
        {children}
        {loading ? (
          <span className="loading loading-spinner loading-lg" />
        ) : (
          <div className="flex justify-end gap-x-3">
            <Button
              onClick={() => {
                onClose();
                onConfirm();
              }}
              className="h-10"
            >
              確定
            </Button>
            <Button variant="secondary" onClick={onClose} className="h-10">
              取消
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
