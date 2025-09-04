import { render, screen, fireEvent } from "@testing-library/react";
import BlurImage from "@/components/atoms/BlurImage";

const testSrc = "test-image.jpg";
const testAlt = "Test Image";

test("renders blur background and hidden image initially", () => {
  render(<BlurImage src={testSrc} alt={testAlt} />);

  const background = screen.getByTestId("blur-background");
  expect(background).toBeInTheDocument();
  expect(background).toHaveClass("blur-md", "scale-110");
  expect(background).toHaveStyle(`backgroundImage: url(${testSrc})`);

  const image = screen.getByRole("img", { name: testAlt });
  expect(image).toHaveClass("opacity-0");
});

test("shows image and removes background after image loaded", () => {
  render(<BlurImage src={testSrc} alt={testAlt} />);

  const image = screen.getByRole("img", { name: testAlt });
  fireEvent.load(image); // 模擬圖片載入完成

  expect(screen.queryByTestId("blur-background")).not.toBeInTheDocument();
  expect(image).toHaveClass("opacity-100");
  expect(image).not.toHaveClass("opacity-0");
});
