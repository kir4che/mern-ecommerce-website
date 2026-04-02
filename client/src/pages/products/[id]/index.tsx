import { Link, useParams } from "react-router";

import { useGetProductByIdQuery } from "@/store/slices/apiSlice";
import { addComma } from "@/utils/addComma";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { linkToCategory } from "@/utils/linkToCategory";

import BlurImage from "@/components/atoms/BlurImage";
import ProductDetailSkeleton from "@/components/atoms/ProductDetailSkeleton";
import Accordion from "@/components/molecules/Accordion";
import ProductActionForm from "@/components/molecules/ProductActionForm";
import ProductSlider from "@/components/organisms/ProductSlider";
import NotFound from "@/pages/notFound";

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
    <li className="text-sm/7 list-none">
      <span className="inline-block py-1 mr-3 text-xs text-center bg-slate-200 rounded min-w-20">
        {label}
      </span>
      {Array.isArray(value) ? value.join("、") : value}
    </li>
  );

const ProductPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(id!, {
    skip: !id,
  });
  const product = data?.product;

  if (isLoading) return <ProductDetailSkeleton />;

  if (error || (!isLoading && !product))
    return <NotFound message={getErrorMessage(error, "無法載入商品資訊")} />;

  return (
    <div className="max-md:p-5 p-8 space-y-12 md:space-y-16">
      <div className="flex mx-auto max-w-screen-2xl max-lg:flex-col justify-between gap-x-12 gap-y-4 lg:gap-y-8">
        <div className="flex-1">
          <BlurImage
            src={product.imageUrl}
            alt={product.title}
            className="rounded max-lg:max-h-100"
          />
        </div>
        <div className="flex-1">
          <p className="mb-2">{product.tagline}</p>
          <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
            <h1 className="text-3xl font-medium">{product.title}</h1>
            <ul className="flex items-center gap-1.5">
              {product.categories.map((category, index) => (
                <li
                  key={index}
                  className="badge h-7 badge-outline hover:bg-primary hover:text-white transition-colors"
                >
                  <Link to={`/collections/${linkToCategory[category]}`}>
                    # {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-base whitespace-pre-line">{product.description}</p>
          <div className="flex-between flex-wrap mt-8 mb-5">
            <p className="text-3xl font-semibold text-nowrap">
              NT$ {addComma(product.price)}
            </p>
          </div>
          <ProductActionForm product={product} variant="detail" />
          {product.ingredients && (
            <Accordion title="製作材料">{product.ingredients}</Accordion>
          )}
          {product.nutrition && (
            <Accordion title="營養成分表示">{product.nutrition}</Accordion>
          )}
          <ul className="py-8 space-y-2 border-b border-slate-400">
            <ProductInfo label="內容" value={product.content} />
            <ProductInfo label="過敏原" value={product.allergens} />
            <ProductInfo label="配送方法" value={product.delivery} />
            <ProductInfo label="保存期限" value={product.expiryDate} />
            <ProductInfo label="保存方法" value={product.storage} />
          </ul>
        </div>
      </div>
      <div className="space-y-10">
        <h2 className="flex flex-col text-center border-y-3 py-6 border-primary">
          您可能也會喜歡<span>Recommend</span>
        </h2>
        <ProductSlider />
      </div>
    </div>
  );
};

export default ProductPage;
