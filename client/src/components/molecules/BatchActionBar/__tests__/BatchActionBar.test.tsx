import { fireEvent, render, screen } from "@testing-library/react";

import BatchActionBar from "@/components/molecules/BatchActionBar";

describe("BatchActionBar 元件", () => {
  test("選定數為 0 時回傳空", () => {
    const { container } = render(
      <BatchActionBar
        selectedCount={0}
        onClearSelection={vi.fn()}
        onDeleteClick={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test("渲染計數並觸發操作", () => {
    const onClearSelection = vi.fn();
    const onDeleteClick = vi.fn();

    render(
      <BatchActionBar
        selectedCount={3}
        onClearSelection={onClearSelection}
        onDeleteClick={onDeleteClick}
      />
    );

    expect(screen.getByText("已選擇 3 筆")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "取消選擇" }));
    fireEvent.click(screen.getByRole("button", { name: "批量刪除" }));

    expect(onClearSelection).toHaveBeenCalledTimes(1);
    expect(onDeleteClick).toHaveBeenCalledTimes(1);
  });

  test("刪除時 disabled 操作按鈕", () => {
    render(
      <BatchActionBar
        selectedCount={2}
        onClearSelection={vi.fn()}
        onDeleteClick={vi.fn()}
        deleteLoading
      />
    );

    expect(screen.getByRole("button", { name: "取消選擇" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "刪除中" })).toBeDisabled();
  });
});
