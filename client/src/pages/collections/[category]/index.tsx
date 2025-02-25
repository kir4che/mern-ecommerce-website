import { useEffect, useState, useMemo, memo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useInView } from 'react-intersection-observer';

import { PRODUCT_CATEGORIES } from "@/constants/actionTypes";
import { Product } from '@/types/product';
import { useCart } from "@/context/CartContext";
import { useAxios } from "@/hooks/useAxios";
import { filterProductsByCategory } from '@/utils/productFilters';
import { linkToCategory } from "@/utils/linkToCategory";
import { preventInvalidInput, handleQuantityChange, handleAddToCart } from "@/utils/cartUtils";
import { addComma } from "@/utils/addComma";

import Layout from "@/layouts/AppLayout";
import NotFound from "@/pages/notFound";
import PageHeader from '@/components/molecules/PageHeader'
import Loading from "@/components/atoms/Loading";
import ProductLinkImg from '@/components/atoms/ProductLinkImg';
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

import { ReactComponent as CartPlusIcon } from "@/assets/icons/cart-plus.inline.svg";

const ITEMS_PER_PAGE = 10; // 每頁顯示的商品數量

const Collections = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { addToCart } = useCart();
  const { data, error, isLoading, isError } = useAxios("/products");
  const products = data?.products as Product[];

  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // 偵測 DOM 元素是否進入視窗範圍，用以實現無限滾動。
  const { ref, inView } = useInView({
    threshold: 0, // 只要有東西進到視窗範圍就會觸發
    triggerOnce: false, // 可以多次觸發
    rootMargin: '100px' // 在視窗底部提早 100px 觸發
  });

  // 處理分類選擇
  const handleCategorySelect = (link: string) => {
    if (link === selectedCategory) return;
    setSelectedCategory(link);
    navigate(`/collections/${link}`);
    setCurrentPage(1); // 重置頁數
  };

  // 初始化選擇的分類
  useEffect(() => {
    setSelectedCategory(category || "all");
  }, [category]);

  // 篩選商品列表
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return filterProductsByCategory(products, category || 'all');
  }, [products, category]);

  // 根據當前頁數和每頁顯示的商品數量，計算出當前顯示的商品列表。
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // 當商品進入視窗範圍 (inView 為 true) 且有更多商品可加載時，更新 currentPage。
  useEffect(() => {
    if (inView && filteredProducts.length > displayedProducts.length) {
      // 提前加載更多商品
      const loadMoreProducts = () => {
        setCurrentPage(prev => prev + 1);
      };

      // 使用 setTimeout 來延遲加載，讓使用者感覺更順。
      const timeoutId = setTimeout(loadMoreProducts, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [inView, filteredProducts.length, displayedProducts.length]);

  if (isError) return <NotFound message={error?.message} />;

  return (
    <Layout>
      <PageHeader 
        breadcrumbText="商品"
        titleEn="Collections"
        titleCh="商品一覽"
      />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="px-5 py-8 md:px-8">
          <div className="flex justify-center gap-4 overflow-x-auto pb-7">
            {PRODUCT_CATEGORIES.map((category) => (
              <Button
                key={category.link}
                className={`px-6 max-h-10 border-dashed ${selectedCategory === category.link ? "border-primary bg-primary text-secondary" : "border-primary/80 text-primary/60 hover:bg-secondary hover:border-primary hover:text-primary"}`}
                onClick={() => handleCategorySelect(category.link)}
              >
                {category.label}
              </Button>
            ))}
          </div>
          <div className="grid w-full grid-cols-1 gap-10 py-10 mx-auto max-w-screen-2xl lg:gap-12 xl:gap-16 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {displayedProducts.map((product) => (
              <div key={product._id}>
                <ProductLinkImg product={product} data={data} isError={isError} className='-mb-12' />
                <div className="flex flex-col py-0.5 pl-4 border-l-2 border-primary">
                  <h3 className="relative z-10 px-2 mb-1 text-base w-fit bg-primary text-secondary text-nowrap">
                    {product.title}
                  </h3>
                  <ul className="flex items-center gap-1.5">
                    {product.categories.map((category, index) => (
                      <li
                        key={index}
                        className="z-0 text-xs w-fit bg-secondary"
                      >
                        <Link to={`/collections/${linkToCategory[category]}`}># {category}</Link>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mt-2 mb-4">
                    <p className="text-xl font-semibold">NT$ {addComma(product.price)}</p>
                    <Input
                      type="number"
                      label="數量"
                      min={1}
                      max={product.countInStock}
                      value={quantities[product._id] || 1}
                      defaultValue={1}
                      onChange={(e) => handleQuantityChange(
                        e,
                        product,
                        value => setQuantities((prev) => ({ ...prev, [product._id]: value })))}
                      onKeyDown={preventInvalidInput}
                      disabled={product.countInStock <= 0}
                      wrapperStyle="flex items-center gap-2"
                      labelStyle="border-r border-gray-300 pr-1.5"
                    />
                  </div>
                  <Button
                    key={product._id}
                    icon={product.countInStock !== 0 && CartPlusIcon}
                    onClick={() => handleAddToCart(
                      product, 
                      quantities[product._id],
                      addToCart, 
                      (value) => setQuantities((prev) => ({ ...prev, [product._id]: value }))
                    )}
                    disabled={product.countInStock <= 0}
                    className='ml-auto text-sm w-fit h-9 text-primary'
                  >
                    {product.countInStock <= 0 ? '補貨中' : '加入購物車'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length > displayedProducts.length && (
            <div ref={ref} className="flex items-center justify-center w-full h-20 my-4">
              <Loading />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default memo(Collections);
