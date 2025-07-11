import { Link } from "react-router";
import { useState } from "react";

import type { Product } from "@/types/product";

import BlurImage from "@/components/atoms/BlurImage";

interface ProductLinkImgProps {
  product: Partial<Product>;
  data: any;
  isError: boolean;
  className?: string;
}

const ProductLinkImg: React.FC<ProductLinkImgProps> = ({
  product,
  data,
  isError,
  className = "",
}) => {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [hasError, setHasError] = useState(isError);

  const handleError = () => {
    setImgSrc("https://placehold.co/300x300?text=No Image");
    setHasError(true);
  };

  return (
    <Link
      to={data?.products ? `/products/${product._id}` : "#"}
      data-testid="product-link"
      className={`relative inline-block overflow-hidden rounded-full aspect-square ${!hasError ? "img-with-overlay" : "bg-gray-200"} ${className}`}
    >
      <BlurImage
        src={imgSrc}
        alt={product.title || "Product Image"}
        className={`relative w-full h-full object-cover object-center aspect-square duration-700 ease-out scale-[1.2] ${hasError ? "opacity-50" : ""}`}
        onError={handleError}
      />
      {data?.products && !hasError && (
        <div className="hidden overlay">
          <p className="absolute z-10 underline -translate-x-1/2 -translate-y-1/2 text-secondary top-1/2 left-1/2">
            查看更多
          </p>
          <div className="absolute inset-0 rounded-full bg-primary/50" />
        </div>
      )}
    </Link>
  );
};

export default ProductLinkImg;
