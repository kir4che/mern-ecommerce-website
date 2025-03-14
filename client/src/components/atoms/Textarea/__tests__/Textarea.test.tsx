import { render, screen, fireEvent } from "@testing-library/react";
import Textarea from "@/components/atoms/Textarea";
import { useState } from "react";

test("renders textarea with label", () => {
  const TestComponent = () => {
    const [value, setValue] = useState("");
    return (
      <Textarea
        id="test-textarea"
        label="Test Textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  };

  render(<TestComponent />);

  const textarea = screen.getByTestId("test-textarea");
  expect(textarea).toBeInTheDocument();
});

test("accepts input value", () => {
  const TestComponent = () => {
    const [value, setValue] = useState("");
    return (
      <Textarea
        id="test-textarea"
        label="Test Textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  };

  render(<TestComponent />);

  const textarea = screen.getByTestId("test-textarea");
  fireEvent.change(textarea, { target: { value: "Test" } });
  expect(textarea).toHaveValue("Test");
});
