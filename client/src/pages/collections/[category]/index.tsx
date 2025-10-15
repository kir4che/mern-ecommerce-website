import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useInView } from "react-intersection-observer";

import type { Product } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/constants/actionTypes";
import { useAxios } from "@/hooks/useAxios";
import { filterProductsByCategory } from "@/utils/productFilters";
import { linkToCategory } from "@/utils/linkToCategory";
import { addComma } from "@/utils/addComma";

import NotFound from "@/pages/notFound";
import PageHeader from "@/components/molecules/PageHeader";
import AddToCartInput from "@/components/molecules/AddToCartInputBtn/AddToCartInput";
import AddToCartBtn from "@/components/molecules/AddToCartInputBtn/AddToCartBtn";
import Loading from "@/components/atoms/Loading";
import ProductLinkImg from "@/components/atoms/ProductLinkImg";
import Button from "@/components/atoms/Button";

const ITEMS_PER_PAGE = 10; // 每頁顯示的商品數量

const Collections = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
    rootMargin: "100px",
  });

  const { error, isLoading, isError, refresh } = useAxios(
    (params) => `/products?page=${params.page}&limit=${ITEMS_PER_PAGE}`,
    {},
    {
      immediate: false,
      onSuccess: (data) => {
        setProducts((prev) =>
          data.page === 1 ? data.products : [...prev, ...data.products],
        );
        setPage(data.page);
        setPages(data.pages);
        setIsLoadingMore(false);
      },
    },
  );

  const fetchProducts = async (pageNum: number) => {
    if (isLoadingMore || (pageNum > pages && pages !== 1)) return;

    if (pageNum > 1) setIsLoadingMore(true);
    refresh({ page: pageNum });
  };

  useEffect(() => {
    setSelectedCategory(category || "all");
    setPage(1);
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    if (inView && !isLoading && page < pages) fetchProducts(page + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, isLoading, page, pages]);

  const handleCategorySelect = (link: string) => {
    if (link === selectedCategory) return;
    navigate(`/collections/${link}`);
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return filterProductsByCategory(products, category || "all");
  }, [products, category]);

  if (isLoading && !products.length) return <Loading />;
  if (isError) return <NotFound message={error?.message} />;

  return (
    <>
      <PageHeader
        breadcrumbText="商品"
        titleEn="Collections"
        titleCh="商品一覽"
      />
      <div className="px-5 py-8 md:px-8">
        <div className="flex justify-center gap-4 pb-4 overflow-x-auto">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Button
              key={cat.link}
              className={`px-6 max-h-10 border-dashed ${
                selectedCategory === cat.link
                  ? "border-primary bg-primary text-secondary"
                  : "border-primary/80 text-primary/60 hover:bg-secondary hover:border-primary hover:text-primary"
              }`}
              onClick={() => handleCategorySelect(cat.link)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
        <div className="grid w-full grid-cols-1 gap-10 py-10 mx-auto max-w-screen-2xl lg:gap-12 xl:gap-16 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <div key={product._id}>
              <ProductLinkImg product={product} className="-mb-12" />
              <div className="flex flex-col py-0.5 pl-4 border-l-2 border-primary">
                <h3 className="relative z-10 px-2 mb-1 text-base w-fit bg-primary text-secondary text-nowrap">
                  {product.title}
                </h3>
                <ul className="flex items-center gap-1.5">
                  {product.categories.map((category, index) => (
                    <li key={index} className="z-0 text-xs w-fit bg-secondary">
                      <Link to={`/collections/${linkToCategory[category]}`}>
                        # {category}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-2 mb-3 gap-x-2">
                  <p className="text-xl font-semibold text-nowrap">
                    NT$ {addComma(product.price)}
                  </p>
                  <AddToCartInput
                    product={product}
                    quantity={quantities[product._id] || 1}
                    setQuantity={(quantity) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product._id!]:
                          typeof quantity === "function"
                            ? quantity(prev[product._id!] || 1)
                            : quantity,
                      }))
                    }
                    wrapperStyle="flex items-center gap-2"
                    inputStyle="rounded-none"
                    labelStyle="border-r text-xs border-gray-300 pr-1.5"
                  />
                </div>
                <AddToCartBtn
                  product={product}
                  quantity={quantities[product._id] || 1}
                  btnType="text"
                  btnStyle="ml-auto text-sm w-fit h-9 text-primary"
                  onAddSuccess={() => {
                    setQuantities((prev) => ({
                      ...prev,
                      [product._id!]: 1,
                    }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {page < pages && <div ref={ref} />}
      </div>
    </>
  );
};

export default Collections;
