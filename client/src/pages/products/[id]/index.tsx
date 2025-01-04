import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAxios } from "@/hooks/useAxios";
import { linkToCategory } from "@/utils/linkToCategory";

import Layout from "@/layouts/AppLayout";
import NotFound from "@/pages/notFound";
import ProductSlider from "@/components/molecules/ProductSlider";
import Accordion from "@/components/molecules/Accordion";
import Loading from "@/components/atoms/Loading";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import BlurImage from "@/components/atoms/BlurImage";

import { ReactComponent as CartPlusIcon } from "@/assets/icons/cart-plus.inline.svg";

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { data, isLoading, error } = useAxios(`/products/${id}`);
  const product = data?.product as Product;

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (isNaN(newValue)) return;
    if (newValue < 1) setQuantity(1);
    else if (product && newValue > product.countInStock) setQuantity(product.countInStock);
    else setQuantity(newValue);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const validQuantity = Math.min(Math.max(1, quantity), product.countInStock);
    addToCart({
      product: product._id.toString(),
      quantity: validQuantity,
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  const renderProductInfo = (label: string, value: string | string[]) => (
    <p className="text-sm">
      <span className="inline-block py-1 mr-4 text-center bg-gray-200 rounded min-w-24">
        {label}
      </span>
      {Array.isArray(value) ? value.join('、') : value}
    </p>
  );

  if (error) return <NotFound message={[error]} />;

  return (
    <Layout className='px-5 md:px-8'>
      {isLoading || !product ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-between pt-8 pb-16 mx-auto max-w-screen-2xl gap-x-12 gap-y-4 md:flex-row">
          <div className="flex-1">
            <BlurImage
              src={product.imageUrl}
              alt={product.title}
              className='w-full h-full rounded-md'
            />
          </div>
          <div className="flex-1">
            <p className="mb-1 text-sm">{product.tagline}</p>
            <h1 className="mb-2 text-3xl font-medium">{product.title}</h1>
            <ul className="flex items-center gap-1.5">
              {product.categories.map((category, index) => (
                <li
                  key={index}
                  className="px-2 py-1 text-sm border rounded-full w-fit bg-secondary border-primary"
                >
                  <Link to={`/collections/${linkToCategory[category]}`}># {category}</Link>
                </li>
              ))}
            </ul>
            <p className="py-6 mt-4 border-t-[1.25px] border-gray-400 border-dashed">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-3xl">NT${product.price}</p>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  label="數量"
                  min={1}
                  max={product.countInStock}
                  value={quantity}
                  defaultValue={1}
                  onChange={handleQuantityChange}
                  disabled={product.countInStock === 0}
                  className='items-center gap-2'
                />
                <Button
                  icon={product.countInStock !== 0 && CartPlusIcon}
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className='h-10'
                >
                  {product.countInStock === 0 ? '已售完' : '加入購物車'}
                </Button>
              </div>
            </div>
            <Accordion title="製作材料">{product.ingredients}</Accordion>
            <Accordion title="營養成分表示">{product.nutrition}</Accordion>
            <div className="py-8 space-y-2 border-b border-gray-400">
              {renderProductInfo("內容", product.content)}
              {renderProductInfo("過敏原標示", product.allergens)}
              {renderProductInfo("配送方法", product.delivery)}
              {renderProductInfo("保存期限", product.expiryDate)}
              {renderProductInfo("保存方法", product.storage)}
            </div>
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
