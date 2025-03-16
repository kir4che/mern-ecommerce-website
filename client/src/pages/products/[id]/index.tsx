import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAxios } from "@/hooks/useAxios";
import { linkToCategory } from "@/utils/linkToCategory";
import {
  preventInvalidInput,
  handleQuantityChange,
  handleAddToCart,
} from "@/utils/cartUtils";
import { addComma } from "@/utils/addComma";

import Layout from "@/layouts/AppLayout";
import NotFound from "@/pages/notFound";
import ProductSlider from "@/components/organisms/ProductSlider";
import Accordion from "@/components/molecules/Accordion";
import Loading from "@/components/atoms/Loading";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import BlurImage from "@/components/atoms/BlurImage";

import { ReactComponent as CartPlusIcon } from "@/assets/icons/cart-plus.inline.svg";

const ProductInfo = ({
  label,
  value,
}: {
  label: string;
  value: string | string[];
}) =>
  value &&
  value !== "" &&
  value.length !== 0 && (
    <li className="text-sm list-none">
      <span className="inline-block py-1 mr-3 text-xs text-center bg-gray-200 rounded min-w-20">
        {label}
      </span>
      {Array.isArray(value) ? value.join("、") : value}
    </li>
  );

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { data, error, isLoading, isError, refresh } = useAxios(
    `/products/${id}`,
  );
  const product = data?.product as Product;
  const isOutOfStock = product?.countInStock <= 0;

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (id) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!isLoading && (isError || !product))
    return <NotFound message={error?.message} />;

  return (
    <Layout className="px-5 md:px-8">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-between pt-8 pb-16 mx-auto max-w-screen-2xl gap-x-12 gap-y-4 lg:flex-row">
          <div className="flex-1">
            <BlurImage
              src={product.imageUrl}
              alt={product.title}
              className="object-cover w-full h-full rounded-md max-h-96"
            />
          </div>
          <div className="flex-1">
            <p className="mb-1">{product.tagline}</p>
            <h1 className="mb-2 text-3xl font-medium">{product.title}</h1>
            <ul className="flex items-center gap-1.5">
              {product.categories.map((category, index) => (
                <li
                  key={index}
                  className="px-2 py-1 text-sm border rounded-full w-fit bg-secondary border-primary"
                >
                  <Link to={`/collections/${linkToCategory[category]}`}>
                    # {category}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="py-6 mt-4 border-t-[1.25px] border-gray-400 border-dashed">
              {product.description}
            </p>
            <div className="flex items-center justify-between mb-8">
              <p className="text-3xl font-semibold">
                NT$ {addComma(product.price)}
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  label="數量"
                  min={1}
                  max={product.countInStock}
                  value={quantity}
                  defaultValue={1}
                  onChange={(e) =>
                    handleQuantityChange(
                      Number(e.target.value),
                      product,
                      setQuantity,
                    )
                  }
                  onKeyDown={preventInvalidInput}
                  disabled={isOutOfStock}
                  wrapperStyle="items-center gap-2"
                  inputStyle="rounded-none"
                />
                <Button
                  icon={product.countInStock !== 0 && CartPlusIcon}
                  onClick={() =>
                    handleAddToCart(product, quantity, addToCart, setQuantity)
                  }
                  disabled={isOutOfStock}
                  className="h-10"
                >
                  {isOutOfStock ? "補貨中" : "加入購物車"}
                </Button>
              </div>
            </div>
            {product.ingredients && (
              <Accordion title="製作材料">{product.ingredients}</Accordion>
            )}
            {product.nutrition && (
              <Accordion title="營養成分表示">{product.nutrition}</Accordion>
            )}
            <ul className="py-8 space-y-2 border-b border-gray-400">
              <ProductInfo label="內容" value={product.content} />
              <ProductInfo label="過敏原" value={product.allergens} />
              <ProductInfo label="配送方法" value={product.delivery} />
              <ProductInfo label="保存期限" value={product.expiryDate} />
              <ProductInfo label="保存方法" value={product.storage} />
            </ul>
          </div>
        </div>
      )}
      <div>
        <h2 className="flex flex-col max-w-6xl mx-auto items-center border-y-[3.2px] py-6 border-primary">
          <span className="text-1.5xl font-medium">您可能也會喜歡</span>
          <span>Recommend</span>
        </h2>
        <div className="py-16 px-[5vw] sm:px-0">
          <ProductSlider />
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
