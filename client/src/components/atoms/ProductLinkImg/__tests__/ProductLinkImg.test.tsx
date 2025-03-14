import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProductLinkImg from "@/components/atoms/ProductLinkImg";

describe("ProductLinkImg Component", () => {
  const mockProduct = {
    _id: "123",
    imageUrl: "https://example.com/product.jpg",
    title: "Test Product",
  };
  const mockData = { products: true };
  const mockIsError = false;

  test("renders a link image with the correct 'to' attribute", () => {
    render(
      <MemoryRouter>
        <ProductLinkImg
          product={mockProduct}
          data={mockData}
          isError={mockIsError}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/products/${mockProduct._id}`,
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      mockProduct.imageUrl,
    );
  });

  test("sets a default image on error", () => {
    const mockIsErrorTrue = true;
    render(
      <MemoryRouter>
        <ProductLinkImg
          product={mockProduct}
          data={mockData}
          isError={mockIsErrorTrue}
        />
      </MemoryRouter>,
    );

    const imgElement = screen.getByRole("img") as HTMLImageElement;
    fireEvent.error(imgElement);
    expect(imgElement).toHaveAttribute(
      "src",
      "https://placehold.co/300x300?text=No Image",
    );
  });

  test("applies correct classes based on error state", () => {
    render(
      <MemoryRouter>
        <ProductLinkImg
          product={mockProduct}
          data={mockData}
          isError={mockIsError}
        />
      </MemoryRouter>,
    );

    const imgElements = screen.getAllByRole("img");
    expect(imgElements[0]).toHaveClass("opacity-0");

    render(
      <MemoryRouter>
        <ProductLinkImg product={mockProduct} data={mockData} isError={true} />
      </MemoryRouter>,
    );
    const imgElementsWithError = screen.getAllByRole("img");
    expect(imgElementsWithError[1]).toHaveClass("opacity-50");
  });
});
