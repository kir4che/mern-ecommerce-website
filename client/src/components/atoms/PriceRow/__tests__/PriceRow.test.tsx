import PriceRow from "@/components/atoms/PriceRow";
import { render } from "@testing-library/react";

describe("PriceRow 元件", () => {
  test("值為 0 或負數時不渲染任何內容", () => {
    const { container } = render(<PriceRow label="小計" value={0} />);
    expect(container).toBeEmptyDOMElement(); // 確認 container 為空
  });
});
