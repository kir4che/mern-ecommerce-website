import { render, screen } from "@testing-library/react";
import Footer from "@/components/organisms/Footer";

test("renders copyright text in footer", () => {
  render(<Footer />);
  expect(
    screen.getByText(/Copyright © 2024 日出麵包坊 all rights reserved./i)
  ).toBeInTheDocument();
});
