import Tooltip from "@/components/atoms/Tooltip";
import { render, screen } from "@testing-library/react";

describe("Tooltip", () => {
  test("當 isActivated 為 true 時渲染 Tooltip", () => {
    render(
      <Tooltip isActivated={true} text={"Tooltip text"}>
        Hover me
      </Tooltip>
    );

    const tooltipElement = screen.getByRole("tooltip");
    expect(tooltipElement).toHaveTextContent("Hover me");
    expect(tooltipElement).toHaveAttribute("data-tip", "Tooltip text");
  });

  test("當 isActivated 為 false 時不渲染 data-tip", () => {
    render(
      <Tooltip isActivated={false} text="Tooltip text">
        Hover me
      </Tooltip>
    );

    const tooltipElement = screen.getByRole("tooltip");
    expect(tooltipElement).toHaveTextContent("Hover me");
    expect(tooltipElement).not.toHaveAttribute("data-tip");
  });
});
