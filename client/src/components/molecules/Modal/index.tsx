import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import Button from "@/components/atoms/Button";

interface ModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
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
  }, [loading, isOpen, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div onClick={(e) => e.stopPropagation()} className={`p-6 bg-white rounded shadow-lg w-96 ${className}`}>
        <h2 className="mb-4 text-lg font-medium">{title}</h2>
        {content && <p className="mb-6 text-gray-600">{content}</p>}
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
