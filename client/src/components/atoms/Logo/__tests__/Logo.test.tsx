import { render, screen } from "@testing-library/react";
import Logo from "@/components/atoms/Logo";

test("renders default logo", () => {
  render(<Logo />);

  const logoImage = screen.getByRole("img", { name: /logo/i });
  expect(logoImage).toBeInTheDocument();
  expect(logoImage).toHaveAttribute("src", expect.stringContaining("logo.png")); // 確認圖片路徑包含 logo.png
});

test("renders white logo", () => {
  render(<Logo isWhite={true} />);

  const whiteLogoImage = screen.getByRole("img", { name: /logo/i });
  expect(whiteLogoImage).toBeInTheDocument();
  expect(whiteLogoImage).toHaveAttribute(
    "src",
    expect.stringContaining("logo-white.png"),
  ); // 確認圖片路徑包含 logo-white.png
});
