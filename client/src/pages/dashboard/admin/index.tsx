import { useState, useEffect } from "react";

import { useAxios } from "@/hooks/useAxios";

import OrderTable from "@/components/organisms/OrdersTable";
import ProductsManager from "@/components/organisms/ProductsManager";
import NewsManager from "@/components/organisms/NewsManager";
import Button from "@/components/atoms/Button";
import Loading from "@/components/atoms/Loading";
import AdminGate from "@/components/organisms/AdminGate";

import { ReactComponent as RefreshIcon } from "@/assets/icons/refresh.inline.svg";

const AdminDashboard = () => {
  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
    refresh: refreshProducts,
  } = useAxios("/products");
  const products = productsData?.products;

  const {
    data: newsData,
    error: newsError,
    isLoading: newsLoading,
    refresh: refreshNews,
  } = useAxios("/news");
  const news = newsData?.news;

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!productsLoading && !newsLoading && productsData && newsData)
      setInitialLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsLoading, newsLoading]);

  return (
    <div className="px-4 py-4 md:px-8">
      <h2 className="mb-3">管理員後台</h2>
      {initialLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col w-full gap-6 mb-6 lg:gap-12 sm:flex-row">
          {/* 商品管理 */}
          <div
            className={`flex-1 sm:w-1/2 min-h-48 ${productsError ? "flex items-center justify-center" : ""}`}
          >
            {productsError ? (
              <div className="flex flex-col items-center gap-y-4">
                <p className="text-base text-gray-800">
                  抱歉，暫時無法取得商品資訊
                </p>
                <p className="text-base text-gray-800">
                  抱歉，暫時無法取得商品資訊
                </p>
                <Button
                  onClick={refreshProducts}
                  icon={RefreshIcon}
                  className="flex items-center h-10 gap-x-2"
                >
                  重新載入
                </Button>
              </div>
            ) : (
              <ProductsManager
                products={products}
                refreshProducts={refreshProducts}
              />
            )}
          </div>
          {/* 消息管理 */}
          <div
            className={`flex-1 sm:w-1/2 min-h-48 ${newsError ? "flex items-center justify-center" : ""}`}
          >
            {newsError ? (
              <div className="flex flex-col items-center gap-y-4">
                <p className="text-base text-gray-800">
                  抱歉，暫時無法取得消息資訊
                </p>
                <p className="text-base text-gray-800">
                  抱歉，暫時無法取得消息資訊
                </p>
                <Button
                  onClick={refreshNews}
                  icon={RefreshIcon}
                  className="flex items-center h-10 gap-x-2"
                >
                  重新載入
                </Button>
              </div>
            ) : (
              <NewsManager news={news} refreshNews={refreshNews} />
            )}
          </div>
        </div>
      )}
      {/* 訂單管理 */}
      <OrderTable isAdmin={true} />
    </div>
  );
};

export default AdminDashboard;
