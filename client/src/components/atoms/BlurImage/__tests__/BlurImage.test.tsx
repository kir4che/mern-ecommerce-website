import { render, screen, fireEvent } from "@testing-library/react";
import BlurImage from "@/components/atoms/BlurImage";

const testSrc = "test-image.jpg";
const testAlt = "Test Image";

test("render blur image", () => {
  render(<BlurImage src={testSrc} alt={testAlt} />);

  const image = screen.getByRole("img", { name: testAlt });
  expect(image).toHaveClass("blur-md");
  expect(image).toHaveClass("scale-110");
});

test("remove blur and scale back to normal after image loaded", () => {
  render(<BlurImage src={testSrc} alt={testAlt} />);

  const image = screen.getByRole("img", { name: testAlt });
  fireEvent.load(image); // 模擬圖片載入完成
  expect(image).not.toHaveClass("blur-md"); // 確認模糊效果被移除
  expect(image).toHaveClass("scale-100"); // 確認縮放回正常大小
});
