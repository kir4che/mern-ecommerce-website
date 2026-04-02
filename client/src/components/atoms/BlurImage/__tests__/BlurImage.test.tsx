import { fireEvent, render, screen } from "@testing-library/react";

import BlurImage from "@/components/atoms/BlurImage";

const testSrc = "test-image.jpg";
const testAlt = "Test Image";

describe("BlurImage 元件", () => {
  test("初始時渲染模糊背景和隱藏的圖片", () => {
    render(<BlurImage src={testSrc} alt={testAlt} />);

    const skeleton = screen.getByTestId("image-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("skeleton");

    const image = screen.getByRole("img", { name: testAlt });
    expect(image).toHaveClass("opacity-0");
  });

  test("圖片載入後顯示圖片並移除背景", () => {
    render(<BlurImage src={testSrc} alt={testAlt} />);

    const image = screen.getByRole("img", { name: testAlt });
    fireEvent.load(image); // 模擬圖片載入完成

    expect(screen.queryByTestId("image-skeleton")).not.toBeInTheDocument();
    expect(image).toHaveClass("opacity-100");
    expect(image).not.toHaveClass("opacity-0");
  });
});
