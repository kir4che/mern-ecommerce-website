import { Fragment, useEffect, useRef } from "react";

import Loading from "@/components/atoms/Loading";
import { cn } from "@/utils/cn";

import ArrowDownIcon from "@/assets/icons/nav-arrow-down.inline.svg?react";
import ArrowUpIcon from "@/assets/icons/nav-arrow-up.inline.svg?react";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

interface ManagerTableProps<T extends { _id: string }> {
  columns: TableColumn<T>[];
  data: T[];
  selectedRows?: string[];
  onSelectRow?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onSort?: (key: string, order: "asc" | "desc") => void;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  expandedRowId?: string;
  onExpandRow?: (id: string) => void;
  expandedContent?: (row: T) => React.ReactNode;
  renderRowActions?: (row: T) => React.ReactNode;
  rowClassName?: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
}

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TableCheckbox = (props: CheckboxProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current)
      checkboxRef.current.indeterminate = props.indeterminate === true;
  }, [props.indeterminate]);

  return (
    <input
      type="checkbox"
      id={props.id}
      ref={checkboxRef}
      className="checkbox checkbox-sm"
      checked={props.checked}
      onChange={props.onChange}
    />
  );
};

const ManagerTable = <T extends { _id: string }>({
  columns,
  data,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  onSort,
  sortKey,
  sortOrder,
  expandedRowId,
  onExpandRow,
  expandedContent,
  renderRowActions,
  rowClassName,
  loading = false,
  emptyMessage = "暫無資料",
}: ManagerTableProps<T>) => {
  if (loading) return <Loading fullPage />;
  if (data.length === 0)
    return (
      <div className="flex-center py-20 text-gray-500">{emptyMessage}</div>
    );

  const isAllSelected = selectedRows.length === data.length; // 全部選取
  const isIndeterminate = selectedRows.length > 0 && !isAllSelected; // 部分選取
  const totalColSpan =
    columns.length + (onSelectRow ? 1 : 0) + (renderRowActions ? 1 : 0); // 計算總欄位數

  const handleSort = (key: string) => {
    if (!onSort) return;
    onSort(key, sortKey === key && sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="overflow-x-auto border border-gray-200">
      <table className="table table-sm">
        <thead>
          <tr className="bg-gray-100">
            {onSelectRow && (
              <th className="w-10 text-center">
                <TableCheckbox
                  id="select-all"
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                />
              </th>
            )}
            {columns.map(({ key, label, sortable, className }) => {
              const isSorted = sortable && sortKey === String(key);
              const SortIcon =
                sortOrder === "asc" ? ArrowUpIcon : ArrowDownIcon;

              return (
                <th
                  key={String(key)}
                  className={cn(sortable && "cursor-pointer", className)}
                  onClick={() => sortable && handleSort(String(key))}
                >
                  <div className="flex items-center gap-2">
                    <span>{label}</span>
                    {isSorted && <SortIcon className="size-4" />}
                  </div>
                </th>
              );
            })}
            {renderRowActions && <th />}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isExpanded = expandedRowId === row._id && expandedContent;

            return (
              <Fragment key={row._id}>
                <tr
                  className={cn(
                    rowClassName?.(row),
                    expandedContent && "cursor-pointer hover:bg-gray-50"
                  )}
                >
                  {onSelectRow && (
                    <td className="w-10 text-center">
                      <TableCheckbox
                        id={`select-${row._id}`}
                        checked={selectedRows.includes(row._id)}
                        onChange={(e) => onSelectRow(row._id, e.target.checked)}
                      />
                    </td>
                  )}
                  {columns.map(({ key, render, className }) => (
                    <td
                      key={String(key)}
                      className={cn("max-w-xs", className)}
                      onClick={() => expandedContent && onExpandRow?.(row._id)}
                    >
                      {render ? render(row[key], row) : String(row[key] ?? "-")}
                    </td>
                  ))}
                  {renderRowActions && <td>{renderRowActions(row)}</td>}
                </tr>
                {/* 展開內容 */}
                {isExpanded && (
                  <tr className="bg-gray-100">
                    <td colSpan={totalColSpan} className="p-4">
                      {expandedContent(row)}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerTable;
