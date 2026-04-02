import Textarea from "@/components/atoms/Textarea";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, test, vi } from "vitest";

describe("Textarea 元件", () => {
  const TestComponent = ({
    onChange = vi.fn(),
    ...props
  }: {
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  } & Record<string, unknown>) => {
    const [value, setValue] = useState("");
    return (
      <Textarea
        id="test-textarea"
        label="Test Textarea"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e);
        }}
        {...props}
      />
    );
  };

  test("接受 input 值", () => {
    render(<TestComponent />);

    const textarea = screen.getByLabelText("Test Textarea");
    fireEvent.change(textarea, { target: { value: "Test Content" } });
    expect(textarea).toHaveValue("Test Content");
  });

  test("值變化時呼叫 onChange", () => {
    const handleChange = vi.fn();
    render(<TestComponent onChange={handleChange} />);

    const textarea = screen.getByLabelText("Test Textarea");
    fireEvent.change(textarea, { target: { value: "New Value" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("disabled 為 true 時 disabled textarea", () => {
    render(<TestComponent disabled />);

    const textarea = screen.getByLabelText("Test Textarea");
    expect(textarea).toBeDisabled();
  });

  test("提供 error 時顯示錯誤訊息", () => {
    render(<TestComponent error="This field is required" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
