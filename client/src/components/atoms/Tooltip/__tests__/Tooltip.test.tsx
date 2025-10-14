import { render, screen } from "@testing-library/react";
import Tooltip from "@/components/atoms/Tooltip";

test("renders tooltip when isActivated is true", () => {
  render(
    <Tooltip isActivated={true} text={"Tooltip text"}>
      Hover me
    </Tooltip>
  );

  const tooltipElement = screen.getByRole("tooltip");
  expect(tooltipElement).toHaveTextContent("Hover me");
  expect(tooltipElement).toHaveAttribute("data-tip", "Tooltip text");
});

test("not render data-tip when isActivated is false", () => {
  render(
    <Tooltip isActivated={false} text="Tooltip text">
      Hover me
    </Tooltip>
  );

  const tooltipElement = screen.getByRole("tooltip");
  expect(tooltipElement).toHaveTextContent("Hover me");
  expect(tooltipElement).not.toHaveAttribute("data-tip");
});
