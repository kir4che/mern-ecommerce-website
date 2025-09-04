import { Link } from "react-router";

import type { Product } from "@/types/product";

import BlurImage from "@/components/atoms/BlurImage";

interface ProductLinkImgProps {
  product: Partial<Product>;
  className?: string;
}

const ProductLinkImg: React.FC<ProductLinkImgProps> = ({
  product,
  className = "",
}) => {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setImgSrc("https://placehold.co/300x300?text=No Image");
    setHasError(true);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      data-testid="product-link"
      className={`relative inline-block overflow-hidden rounded-full aspect-square ${!hasError ? "img-with-overlay" : "bg-gray-200"} ${className}`}
    >
      <BlurImage
        src={product.imageUrl}
        alt={product.title}
        className="relative w-full h-full object-cover object-center aspect-square duration-700 ease-out scale-[1.2]"
      />
      {!hasError && (
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
