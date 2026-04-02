import Button from "@/components/atoms/Button";
import { useConfirmDialogContext } from "@/context/ConfirmDialogContext";

const ConfirmDialog = () => {
  const { options, isLoading, handleConfirm, handleCancel, close } =
    useConfirmDialogContext();

  if (!options) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg">{options.title}</h3>
        <p className="py-4 text-gray-600">{options.message}</p>
        {options.action && (
          <div className="mb-4 p-3 rounded-md bg-blue-50">
            <button
              onClick={() => {
                options.action?.onClick();
                close();
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {options.action.label} →
            </button>
          </div>
        )}
        <div className="modal-action">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {options.cancelText || "取消"}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "處理中..." : options.confirmText || "確認"}
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" disabled={isLoading} onClick={close}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default ConfirmDialog;
