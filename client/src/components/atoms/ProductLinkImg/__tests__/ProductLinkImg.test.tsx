import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProductLinkImg from "@/components/atoms/ProductLinkImg";

describe("ProductLinkImg Component", () => {
  const mockProduct = {
    _id: "123",
    imageUrl: "https://example.com/product.jpg",
    title: "Test Product",
  };

  const mockData = {
    products: true,
  };

  const mockIsError = false;

  const renderWithRouter = (component: React.ReactNode) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it("should render a link with the correct 'to' attribute", () => {
    renderWithRouter(
      <ProductLinkImg
        product={mockProduct}
        data={mockData}
        isError={mockIsError}
      />,
    );

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", `/products/${mockProduct._id}`);
  });

  it("should render an image with the correct src", () => {
    renderWithRouter(
      <ProductLinkImg
        product={mockProduct}
        data={mockData}
        isError={mockIsError}
      />,
    );

    const imgElement = screen.getByRole("img") as HTMLImageElement;
    expect(imgElement).toHaveAttribute("src", mockProduct.imageUrl);
  });

  it("should set a default image on error", () => {
    const mockIsErrorTrue = true;
    renderWithRouter(
      <ProductLinkImg
        product={mockProduct}
        data={mockData}
        isError={mockIsErrorTrue}
      />,
    );

    const imgElement = screen.getByRole("img") as HTMLImageElement;
    fireEvent.error(imgElement);
    expect(imgElement).toHaveAttribute(
      "src",
      "https://placehold.co/300x300?text=No Image",
    );
  });

  it("should apply correct classes based on error state", () => {
    renderWithRouter(
      <ProductLinkImg
        product={mockProduct}
        data={mockData}
        isError={mockIsError}
      />,
    );

    const imgElements = screen.getAllByRole("img");
    expect(imgElements[0]).toHaveClass("opacity-0");

    // Test with error state
    renderWithRouter(
      <ProductLinkImg product={mockProduct} data={mockData} isError={true} />,
    );
    const imgElementsWithError = screen.getAllByRole("img");
    expect(imgElementsWithError[1]).toHaveClass("opacity-50");
  });
});
