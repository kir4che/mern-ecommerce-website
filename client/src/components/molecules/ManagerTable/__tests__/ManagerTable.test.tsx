import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import ManagerTable from "@/components/molecules/ManagerTable";

const columns: Array<
  | {
      key: "name";
      label: string;
      sortable: boolean;
      render?: undefined;
    }
  | {
      key: "price";
      label: string;
      render: (value: number) => string;
      sortable?: undefined;
    }
> = [
  {
    key: "name",
    label: "名稱",
    sortable: true,
  },
  {
    key: "price",
    label: "價格",
    render: (value: number) => `NT$ ${value}`,
  },
];

const rows = [
  { _id: "1", name: "商品 A", price: 100 },
  { _id: "2", name: "商品 B", price: 200 },
];

describe("ManagerTable 元件", () => {
  test("渲染列並處理排序", () => {
    const onSort = vi.fn();

    render(
      <ManagerTable
        columns={columns}
        data={rows}
        onSort={onSort}
        sortKey="name"
        sortOrder="asc"
      />
    );

    expect(screen.getByText("商品 A")).toBeInTheDocument();
    expect(screen.getByText("NT$ 100")).toBeInTheDocument();

    fireEvent.click(screen.getByText("名稱"));

    expect(onSort).toHaveBeenCalledWith("name", "desc");
  });

  test("處理列選擇和展開內容", () => {
    const onSelectRow = vi.fn();
    const onSelectAll = vi.fn();
    const onExpandRow = vi.fn();

    render(
      <ManagerTable
        columns={columns}
        data={rows}
        selectedRows={["1"]}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
        expandedRowId="1"
        onExpandRow={onExpandRow}
        expandedContent={(row: (typeof rows)[0]) => <div>展開 {row.name}</div>}
        renderRowActions={(row: (typeof rows)[0]) => (
          <button>{`操作-${row._id}`}</button>
        )}
      />
    );

    // 確認選中狀態和展開內容
    expect(screen.getByText("展開 商品 A")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "操作-1" })).toBeInTheDocument();

    // 點擊行來觸發展開
    fireEvent.click(screen.getByText("商品 A"));
    expect(onExpandRow).toHaveBeenCalledWith("1");
  });
});
