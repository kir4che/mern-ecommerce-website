import { useState } from "react";
import { Link } from "react-router";

import BlurImage from "@/components/atoms/BlurImage";
import type { Product } from "@/types";
import { cn } from "@/utils/cn";

interface ProductLinkImgProps {
  product: Partial<Product>;
  className?: string;
  onLoad?: () => void;
}

const ProductLinkImg = ({
  product,
  className,
  onLoad,
}: ProductLinkImgProps) => {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setImgSrc("https://placehold.co/300x300?text=No+Image");
    setHasError(true);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      data-testid="product-link"
      className="group relative block w-full h-full overflow-hidden rounded-full aspect-square bg-gray-200"
    >
      <BlurImage
        src={imgSrc}
        alt={product.title || "商品圖片"}
        className={cn(
          "w-full h-full object-cover object-center transition-transform duration-700 ease-out",
          !hasError && "group-hover:scale-110",
          hasError && "opacity-50 grayscale",
          className
        )}
        onError={handleError}
        onLoad={onLoad}
      />
      {!hasError && (
        <div className="absolute inset-0 bg-primary/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex-center z-10">
          <span className="text-white font-medium underline underline-offset-4 tracking-widest translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
            查看更多
          </span>
        </div>
      )}
    </Link>
  );
};

export default ProductLinkImg;
