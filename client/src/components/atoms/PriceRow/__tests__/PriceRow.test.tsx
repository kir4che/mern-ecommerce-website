import { render, screen } from "@testing-library/react";
import PriceRow from "@/components/atoms/PriceRow";

describe("PriceRow Component", () => {
  test("renders PriceRow with label and value", () => {
    render(<PriceRow label="小計" value={100} />);

    expect(screen.getByText("小計")).toBeInTheDocument();
    expect(screen.getByText("NT$ 100")).toBeInTheDocument();
  });

  test("does not render when value is 0 or less", () => {
    const { container } = render(<PriceRow label="小計" value={0} />);
    expect(container).toBeEmptyDOMElement(); // 確認 container 為空
  });
});
