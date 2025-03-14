import { render, screen, fireEvent } from "@testing-library/react";
import Input from "@/components/atoms/Input";

describe("Input Component", () => {
  test("renders input with label", () => {
    render(
      <Input id="test-input" label="Test Input" placeholder="Enter text" />,
    );

    expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
  });

  test("renders input with icon", () => {
    const MockIcon = () => <svg data-testid="input-icon" />;
    render(<Input id="test-input" label="Test Input" icon={MockIcon} />);

    expect(screen.getByTestId("input-icon")).toBeInTheDocument();
  });

  test("accepts input value", () => {
    render(
      <Input id="test-input" label="Test Input" placeholder="Enter text" />,
    );

    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "Test" } });
    expect(input).toHaveValue("Test");
  });

  test("shows error message when required field is empty", () => {
    render(
      <Input
        id="test-input"
        label="Test Required Input"
        required
        errorMessage="This field is required"
      />,
    );

    // 觸發失去焦點事件後，確認有顯示 error message。
    fireEvent.blur(screen.getByTestId("test-input"));
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  test("removes error message when user enters valid input", () => {
    render(
      <Input
        id="test-input"
        label="Test Input"
        required
        errorMessage="This field is required"
      />,
    );

    const input = screen.getByTestId("test-input");

    fireEvent.blur(input);
    expect(screen.getByText("This field is required")).toBeInTheDocument();

    // 模擬使用者輸入有效值後，確認 error message 已消失。
    fireEvent.change(input, { target: { value: "Valid Input" } });
    expect(screen.queryByText("This field is required")).toBeNull();
  });

  test("validates input based on pattern", () => {
    render(
      <Input
        id="test-input"
        label="Test Input"
        pattern={{ value: /^[0-9]+$/, message: "Only numbers allowed" }}
      />,
    );

    const input = screen.getByTestId("test-input");

    // 模擬使用者輸入無效值後，確認有顯示 error message。
    fireEvent.change(input, { target: { value: "abc" } });
    expect(screen.getByText("Only numbers allowed")).toBeInTheDocument();

    // 重新輸入有效值後，確認 error message 已消失。
    fireEvent.change(input, { target: { value: "123" } });
    expect(screen.queryByText("Only numbers allowed")).toBeNull();
  });

  test("calls onChange when input changes", () => {
    const handleChange = jest.fn();
    render(
      <Input id="test-input" label="Test Input" onChange={handleChange} />,
    );

    fireEvent.change(screen.getByTestId("test-input"), {
      target: { value: "Hello" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
