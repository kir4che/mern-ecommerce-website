import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "@/pages/notFound";
import ProductSlider from "@/components/molecules/ProductSlider";
import Layout from "@/layouts/AppLayout";
import Loading from "@/components/atoms/Loading";
import { useCart } from "@/context/CartContext";
import { useGetData } from "@/hooks/useGetData";

import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Accordion from "@/components/molecules/Accordion";

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { data, loading, error } = useGetData(`/products/${id}`);
  const product = data?.product;

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      product,
      quantity: quantity || 1,
    });
    setTimeout(() => setQuantity(1), 500);
  };

  if (loading) return;
  if (error) return <NotFound message={[error]} />;

  return (
    <Layout>
      <section className="flex flex-col justify-between gap-5 xl:gap-0 md:flex-row pb-14">
        <div className="md:max-w-[50%]">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="object-cover object-center h-full md:min-h-screenwithh"
            loading="lazy"
          />
        </div>
        <div className="px-[5vw] md:px-0 mx-auto md:pt-20 md:max-w-lg">
          <p className="text-sm">{product.tagline}</p>
          <h1 className="mb-6 text-2xl font-medium">{product.title}</h1>
          <div className="flex gap-1.5">
            {product.categories.map((category, index) => (
              <p
                className="px-3 py-0.75 text-sm font-medium bg-secondary border rounded-full w-fit border-primary"
                key={index}
              >
                #{category}
              </p>
            ))}
          </div>
          <p className="pt-6 pb-4 my-5 text-sm border-t-[1.25px] border-gray-300 border-dashed">
            {product.description}
          </p>
          <div className="flex justify-between pb-6 border-b-2 border-gray-400 border-dashed sm:items-center">
            <p className="text-3xl sm:text-2xl">NT${product.price}</p>
            <div className="flex items-center gap-2.5">
              <Input
                label="數量"
                min={1}
                max={product.countInStock}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <Button onClick={() => handleAddToCart(product)}>
                加入購物車
              </Button>
            </div>
          </div>
          <div className="space-y-2.5 border-b border-gray-400 pt-7 pb-10 text-xxs">
            <p className="space-x-5 md:space-x-3">
              <span className="inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-20 bg-gray-200">
                內容
              </span>
              <span>{product.content}</span>
            </p>
            <p className="space-x-5 md:space-x-3">
              <span className="inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-20 bg-gray-200">
                保存期限
              </span>
              <span>{product.expiryDate}</span>
            </p>
            <p className="space-x-5 md:space-x-3">
              <span className="inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-20 bg-gray-200">
                過敏原標示
              </span>
              <span>
                {product.allergens.map((allergen) => (
                  <span className="product__info__first-content">
                    {allergen}、
                  </span>
                ))}
              </span>
            </p>
            <p className="space-x-5 md:space-x-3">
              <span className="inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-20 bg-gray-200">
                配送方法
              </span>
              <span>{product.delivery}</span>
            </p>
            <p className="space-x-5 md:space-x-3">
              <span className="inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-20 bg-gray-200">
                保存方法
              </span>
              <span>{product.storage}</span>
            </p>
          </div>
          <div>
            <Accordion title="原材料">{product.ingredients}</Accordion>
            <Accordion title="營養成分表示">{product.nutrition}</Accordion>
          </div>
        </div>
      </section>
      <section>
        <h2 className="flex flex-col max-w-6xl mx-auto items-center border-y-[3.2px] py-6 border-primary">
          <span className="text-1.5xl font-medium">您可能也會喜歡</span>
          <span>Recommend</span>
        </h2>
        <div className="py-16 px-[5vw] sm:px-0">
          <ProductSlider />
        </div>
      </section>
    </Layout>
  );
};

export default Product;
