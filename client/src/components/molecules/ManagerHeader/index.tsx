import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

import PlusIcon from "@/assets/icons/plus.inline.svg?react";
import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";
import SearchIcon from "@/assets/icons/search.inline.svg?react";

interface ManagerHeaderProps {
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  onRefreshClick?: () => void;
  children?: React.ReactNode;
}

const ManagerHeader = ({
  title,
  searchValue,
  onSearchChange,
  onAddClick,
  onRefreshClick,
  children,
}: ManagerHeaderProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2.5">
      <h3 className="font-bold">{title}</h3>
      <Button
        variant="secondary"
        icon={PlusIcon}
        onClick={onAddClick}
        className="rounded-full p-0 size-6"
        aria-label="新增"
      />
      {onRefreshClick && (
        <Button
          variant="secondary"
          icon={RefreshIcon}
          onClick={onRefreshClick}
          className="rounded-full p-0 size-6 [&>svg]:size-4"
          aria-label="重新整理"
        />
      )}
    </div>
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:items-center">
      <Input
        type="text"
        placeholder="搜尋名稱或標籤"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        icon={SearchIcon}
      />
      {children && (
        <div className="flex flex-wrap w-full min-w-0 gap-2 md:min-w-[18rem]">
          {children}
        </div>
      )}
    </div>
  </div>
);

export default ManagerHeader;
