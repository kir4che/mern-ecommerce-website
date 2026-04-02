import XmarkIcon from "@/assets/icons/xmark.inline.svg?react";
import Button from "@/components/atoms/Button";

interface BatchActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteClick: () => void;
  deleteLoading?: boolean;
}

const BatchActionBar = ({
  selectedCount,
  onClearSelection,
  onDeleteClick,
  deleteLoading = false,
}: BatchActionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-30 sm:relative sm:bottom-0 sm:left-0 sm:right-0 sm:z-10">
      <div className="mx-auto max-w-7xl max-sm:rounded max-sm:border border-gray-200 max-sm:bg-white max-sm:p-3 max-sm:shadow-lg">
        <div className="flex max-sm:flex-col gap-3 sm:items-center sm:justify-between">
          <div className="text-sm font-medium">已選擇 {selectedCount} 筆</div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
            <Button
              variant="outline"
              onClick={onClearSelection}
              disabled={deleteLoading}
              className="max-sm:w-full text-sm"
            >
              取消選擇
            </Button>
            <Button
              variant="outline"
              className="max-sm:w-full border-red-300 text-sm text-red-600 hover:bg-red-50"
              icon={XmarkIcon}
              onClick={onDeleteClick}
              disabled={deleteLoading}
            >
              {deleteLoading ? "刪除中" : "批量刪除"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchActionBar;
