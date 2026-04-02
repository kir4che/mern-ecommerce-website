import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import ProductLinkImg from "@/components/atoms/ProductLinkImg";

describe("ProductLinkImg 元件", () => {
  const mockProduct = {
    _id: "123",
    imageUrl: "https://example.com/product.jpg",
    title: "Test Product",
  };

  test("渲染正確的連結圖片", () => {
    render(
      <MemoryRouter>
        <ProductLinkImg product={mockProduct} />
      </MemoryRouter>
    );

    // 圖片連結是否正確指向 /products/:id
    expect(screen.getByTestId("product-link")).toHaveAttribute(
      "href",
      `/products/${mockProduct._id}`
    );

    // 圖片是否正確顯示
    const image = screen.getByRole("img", { name: "Test Product" });
    expect(image).toBeInTheDocument();
  });
});
