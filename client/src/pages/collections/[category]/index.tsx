import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link, useParams } from "react-router";

import Button from "@/components/atoms/Button";
import ProductCardSkeleton from "@/components/atoms/ProductCardSkeleton";
import ProductLinkImg from "@/components/atoms/ProductLinkImg";
import PageHeader from "@/components/molecules/PageHeader";
import { PRODUCT_COLLECTIONS } from "@/constants/actionTypes";
import NotFound from "@/pages/notFound";
import { useGetProductsQuery } from "@/store/slices/apiSlice";
import type { Product } from "@/types";
import { addComma } from "@/utils/addComma";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { linkToCategory } from "@/utils/linkToCategory";

const ITEMS_PER_PAGE = 10;

const ProductCard = ({ product }: { product: Product }) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <div className="card size-full group">
      <figure className="relative w-full aspect-square p-2">
        <div className="relative size-full rounded-full overflow-hidden border-4 border-gray-200 group-hover:-translate-y-2 transition-transform duration-500 bg-gray-200">
          <ProductLinkImg
            product={product}
            className={cn(
              "size-full object-cover transition-opacity duration-700 ease-in-out",
              isImgLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsImgLoaded(true)}
          />
          {!isImgLoaded && (
            <div className="absolute inset-0 skeleton rounded-full" />
          )}
        </div>
      </figure>
      <div className="card-body p-2 flex flex-col">
        <h3 className="card-title font-semibold line-clamp-1">
          {product.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {product.categories.map((cat, index) => (
            <Link
              key={index}
              to={`/collections/${linkToCategory[cat]}`}
              className="badge p-0 border-none badge-sm hover:opacity-80 transition-opacity"
            >
              #{cat}
            </Link>
          ))}
        </div>
        <p className="text-2xl md:text-xl font-bold text-nowrap text-primary text-right">
          NT$ {addComma(product.price)}
        </p>
      </div>
    </div>
  );
};

const CollectionsContent = ({ category }: { category: string }) => {
  const [page, setPage] = useState(1);
  const currentTab = PRODUCT_COLLECTIONS.find((c) => c.value === category);

  const { data, isLoading, isFetching, error, refetch } = useGetProductsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    category: currentTab?.type === "category" ? currentTab.label : undefined,
    tag: currentTab?.type === "tag" ? currentTab.label : undefined,
  });

  const products = data?.products ?? [];
  const hasMore = products.length < (data?.total ?? 0);

  // 無限滾動：scroll 到底部（提前 400px）時自動載入下一頁
  const { ref } = useInView({
    rootMargin: "400px",
    onChange: (inView) => {
      if (inView && !isFetching && hasMore) setPage((p) => p + 1);
    },
  });

  if (isLoading) return <ProductCardSkeleton count={ITEMS_PER_PAGE} />;

  if (error || (!isLoading && !products.length))
    return (
      <div className="flex-center min-h-[50vh] flex-col gap-4 text-center">
        <h3 className="text-xl font-medium">
          {error
            ? getErrorMessage(error, "商品載入失敗")
            : "此分類目前沒有商品"}
        </h3>
        <p className="text-gray-600">請嘗試選擇其他分類，或稍後再試。</p>
        {error && (
          <Button onClick={refetch} className="btn btn-outline mt-2">
            重新嘗試
          </Button>
        )}
      </div>
    );

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-6 md:gap-10 xl:gap-8 2xl:gap-12 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 py-6 mx-auto">
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {hasMore && (
        <div ref={ref} className="flex-center py-8">
          {isFetching ? (
            <span className="loading loading-spinner loading-lg text-primary" />
          ) : (
            <span className="text-sm text-gray-600">向下滑動載入更多...</span>
          )}
        </div>
      )}
    </>
  );
};

const Collections = () => {
  const { category = "all" } = useParams();
  const isValidCategory =
    category === "all" || PRODUCT_COLLECTIONS.some((c) => c.value === category);

  if (!isValidCategory) return <NotFound message="找不到此商品分類" />;

  return (
    <div className="flex min-h-full w-full flex-col bg-gray-50">
      <PageHeader
        breadcrumbText="商品"
        titleEn="Collections"
        titleCh="商品一覽"
      />
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col px-4 py-8 md:px-8">
        <div className="flex flex-wrap gap-2.5 mb-6">
          {PRODUCT_COLLECTIONS.map(({ value, label }) => (
            <Link
              key={value}
              to={`/collections/${value}`}
              className={cn(
                "btn btn-md rounded-full transition-all duration-300",
                category === value
                  ? "btn-primary"
                  : "bg-white border-dashed not-hover:opacity-50 border-black"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 flex-col">
          <CollectionsContent key={category} category={category} />
        </div>
      </div>
    </div>
  );
};

export default Collections;
