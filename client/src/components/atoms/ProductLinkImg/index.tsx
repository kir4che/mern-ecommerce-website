import { Link } from "react-router";
import { Product } from "@/types/product";

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
  return (
    <Link
      to={data?.products ? `/products/${product._id}` : "#"}
      className={`relative inline-block overflow-hidden rounded-full aspect-square ${!isError ? "img-with-overlay" : "bg-gray-200"} ${className}`}
    >
      <img
        src={product.imageUrl}
        alt={product.title}
        className={`relative w-full h-full object-cover object-center aspect-square duration-700 ease-out scale-[1.2] opacity-0 ${isError ? "opacity-50" : ""}`}
        onLoad={(e) => (e.currentTarget.style.opacity = "1")}
        onError={(e) =>
          (e.currentTarget.src = "https://placehold.co/300x300?text=No Image")
        }
      />
      {data?.products && (
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
