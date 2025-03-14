import { render, screen, fireEvent } from "@testing-library/react";
import Select from "@/components/atoms/Select";

describe("Select Component", () => {
  const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const defaultProps = {
    name: "test-select",
    label: "Test Select",
    value: "",
    options: mockOptions,
    onChange: jest.fn(),
  };

  // 每次測試開始前，清除所有 jest 模擬函式的記錄。
  beforeEach(() => jest.clearAllMocks());

  test("renders single select correctly", () => {
    render(<Select {...defaultProps} />);

    expect(screen.getByText("Test Select")).toBeInTheDocument();
    expect(screen.getByTestId("test-select")).toBeInTheDocument();
  });

  test("calls onChange when single select changes", () => {
    render(<Select {...defaultProps} />);

    fireEvent.change(screen.getByTestId("test-select"), {
      target: { value: "option1" },
    });
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      "test-select",
      "option1",
    ); // 確認 onChange 被呼叫後，傳入的值是否正確。
  });

  describe("Multiple Select Mode", () => {
    const multipleProps = { ...defaultProps, multiple: true, value: [] }; // 設定為多選

    test("renders multiple select correctly", () => {
      render(<Select {...multipleProps} />);
      mockOptions.forEach((option) =>
        expect(screen.getByLabelText(option.label)).toBeInTheDocument(),
      );
    });

    test("preselects first option when required", () => {
      render(<Select {...multipleProps} required />);
      expect(screen.getByLabelText("Option 1")).toBeChecked();
    });

    test("calls onChange when multiple select changes", () => {
      render(<Select {...multipleProps} />);

      fireEvent.click(screen.getByLabelText("Option 2"));
      expect(defaultProps.onChange).toHaveBeenCalledWith("test-select", [
        "option2",
      ]);
    });

    test("not deselects last selected option when required", () => {
      render(<Select {...multipleProps} required value={["option1"]} />);

      fireEvent.click(screen.getByLabelText("Option 1"));
      expect(defaultProps.onChange).not.toHaveBeenCalled(); // 不應該觸發 onChange
    });

    test("allows selecting multiple options", () => {
      const onChange = jest.fn();
      const { rerender } = render(
        <Select {...multipleProps} onChange={onChange} />,
      );

      fireEvent.click(screen.getByLabelText("Option 1"));
      expect(onChange).toHaveBeenLastCalledWith("test-select", ["option1"]);

      rerender(
        <Select {...multipleProps} onChange={onChange} value={["option1"]} />,
      );

      fireEvent.click(screen.getByLabelText("Option 2"));
      expect(onChange).toHaveBeenLastCalledWith("test-select", [
        "option1",
        "option2",
      ]);
    });
  });
});
