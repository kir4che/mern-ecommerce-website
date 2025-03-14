import { render, screen } from "@testing-library/react";
import Loading from "@/components/atoms/Loading";

test("renders loading message and animation", () => {
  render(<Loading />);

  const loadingText = screen.getByText("請稍候，我們正在加載中");
  expect(loadingText).toBeInTheDocument();
  expect(loadingText.querySelector("span")).toBeInTheDocument();
});
