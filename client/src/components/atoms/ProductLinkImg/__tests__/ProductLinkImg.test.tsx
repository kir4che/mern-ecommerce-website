import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProductLinkImg from "@/components/atoms/ProductLinkImg";

describe("ProductLinkImg Component", () => {
  const mockProduct = {
    _id: "123",
    imageUrl: "https://example.com/product.jpg",
    title: "Test Product",
  };

  test("renders a correct link image", () => {
    render(
      <MemoryRouter>
        <ProductLinkImg product={mockProduct} />
      </MemoryRouter>
    );

    // 圖片連結是否正確指向 /products/123
    expect(screen.getByTestId("product-link")).toHaveAttribute(
      "href",
      `/products/${mockProduct._id}`
    );

    // 圖片的 src 是否為指定圖片網址
    expect(screen.getByTestId("blur-image")).toHaveAttribute(
      "src",
      mockProduct.imageUrl
    );
  });
});
