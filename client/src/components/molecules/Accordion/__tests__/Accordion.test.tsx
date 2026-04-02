import Accordion from "@/components/molecules/Accordion";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Accordion 元件", () => {
  const title = "Test Accordion";
  const children = "Accordion Content";

  test("預設時為關閉狀態", () => {
    render(<Accordion title={title}>{children}</Accordion>);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("defaultOpen 為真時為打開狀態", () => {
    render(
      <Accordion title={title} defaultOpen>
        {children}
      </Accordion>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("點擊時切換狀態", () => {
    render(<Accordion title={title}>{children}</Accordion>);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test("提供 name 時渲染為單選按鈕", () => {
    const radioName = "faq-group";
    render(
      <Accordion title={title} name={radioName}>
        {children}
      </Accordion>
    );

    const radio = screen.getByRole("radio");
    expect(radio).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

    expect(radio).toHaveAttribute("name", radioName);
    expect(radio).toHaveAttribute("value", title);
  });
});
