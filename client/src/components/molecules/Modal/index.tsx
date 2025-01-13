import React from "react";
import ReactDOM from "react-dom";

import Button from "@/components/atoms/Button";

interface ModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title: string;
  content?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
  title,
  content,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div onClick={(e) => e.stopPropagation()} className="p-6 bg-white rounded shadow-lg w-96">
        <h2 className="mb-4 text-lg font-medium">{title}</h2>
        {content && <p className="mb-6 text-gray-600">{content}</p>}
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
      </div>
    </div>,
    document.body
  );
};

export default Modal;
