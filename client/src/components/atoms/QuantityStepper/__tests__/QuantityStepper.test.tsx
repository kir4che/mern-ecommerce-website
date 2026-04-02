import { fireEvent, render, screen } from "@testing-library/react";

import QuantityStepper from "@/components/atoms/QuantityStepper";

describe("QuantityStepper 元件", () => {
  test("渲染 native 無自定義的增減按鈕", () => {
    render(
      <QuantityStepper
        variant="native"
        value={2}
        min={1}
        max={5}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "減少數量" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "增加數量" })
    ).not.toBeInTheDocument();
  });

  test("點擊增減按鈕時呼叫 onChange 並傳入正確的值", () => {
    const onChange = vi.fn();

    render(<QuantityStepper value={2} min={1} max={5} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "增加數量" }));
    fireEvent.click(screen.getByRole("button", { name: "減少數量" }));

    expect(onChange).toHaveBeenNthCalledWith(1, 3);
    expect(onChange).toHaveBeenNthCalledWith(2, 1);
  });

  test("將輸入的值限制至最大值", () => {
    const onChange = vi.fn();

    render(<QuantityStepper value={2} min={1} max={5} onChange={onChange} />);

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "10" },
    });

    expect(onChange).toHaveBeenCalledWith(5);
  });

  test("忽略非數字輸入", () => {
    const onChange = vi.fn();

    render(<QuantityStepper value={2} min={1} max={5} onChange={onChange} />);

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "" },
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  test("disabled 為真時 disabled 控制項", () => {
    render(
      <QuantityStepper value={2} min={1} max={5} onChange={vi.fn()} disabled />
    );

    expect(screen.getByRole("button", { name: "減少數量" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "增加數量" })).toBeDisabled();
    expect(screen.getByRole("spinbutton")).toBeDisabled();
  });
});
