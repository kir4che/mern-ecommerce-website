import { render, screen, fireEvent } from "@testing-library/react";
import Accordion from "@/components/molecules/Accordion";

describe("Accordion Component", () => {
  const title = "Test Accordion";
  const children = "Accordion Content";

  test("renders title correctly", () => {
    render(<Accordion title={title}>{children}</Accordion>);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  test("displays children when open", () => {
    render(<Accordion title={title}>{children}</Accordion>);

    const detail = screen.getByRole("region");
    // 預設開啟，所以不用點擊就有 open 屬性。
    expect(detail).toHaveAttribute("open");
  });

  test("hides children when closed", () => {
    render(<Accordion title={title}>{children}</Accordion>);
    const detail = screen.getByRole("region");
    const summary = screen.getByText(title);

    fireEvent.click(summary); // 點擊 summary 後， detail 的 open 屬性會被移除。
    expect(detail).not.toHaveAttribute("open"); // 確認 detail 沒有 open 屬性
  });
});
