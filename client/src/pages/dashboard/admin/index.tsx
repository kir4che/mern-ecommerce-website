import { useCallback, useEffect, useState } from "react";

import { useAxios } from "@/hooks/useAxios";

import OrderTable from "@/components/organisms/OrdersTable";
import ProductsManager from "@/components/organisms/ProductsManager";
import NewsManager from "@/components/organisms/NewsManager";
import Button from "@/components/atoms/Button";
import Loading from "@/components/atoms/Loading";
import AdminGate from "@/components/organisms/AdminGate";

import type { ProductsResponse, NewsResponse } from "@/types/api";
import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";

const AdminDashboard = () => {
  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
    status: productsStatus,
    refresh: refreshProducts,
  } = useAxios<ProductsResponse>("/products", { withCredentials: true });

  const {
    data: newsData,
    error: newsError,
    isLoading: newsLoading,
    status: newsStatus,
    refresh: refreshNews,
  } = useAxios<NewsResponse>("/news", { withCredentials: true });

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (
      initialLoading &&
      productsStatus !== "idle" &&
      newsStatus !== "idle" &&
      !productsLoading &&
      !newsLoading
    ) {
      setInitialLoading(false);
    }
  }, [
    initialLoading,
    productsStatus,
    newsStatus,
    productsLoading,
    newsLoading,
  ]);

  const products = productsData?.products ?? [];
  const news = newsData?.news ?? [];

  const handleRefreshProducts = useCallback(() => {
    void refreshProducts();
  }, [refreshProducts]);

  const handleRefreshNews = useCallback(() => {
    void refreshNews();
  }, [refreshNews]);

  return (
    <AdminGate>
      <div className="px-4 py-6 md:px-8">
        <h2 className="mb-6">管理員後台</h2>
        {initialLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
              <section className="flex-1 min-h-[12rem]">
                {productsError ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 rounded border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <p className="text-base text-gray-700">
                      {productsError.message ?? "抱歉，暫時無法取得商品資訊"}
                    </p>
                    <Button
                      onClick={handleRefreshProducts}
                      icon={RefreshIcon}
                      className="flex h-10 items-center gap-x-2"
                      disabled={productsLoading}
                    >
                      重新載入
                    </Button>
                  </div>
                ) : (
                  <ProductsManager
                    products={products}
                    refreshProducts={handleRefreshProducts}
                  />
                )}
              </section>
              <section className="flex-1 min-h-[12rem]">
                {newsError ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 rounded border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <p className="text-base text-gray-700">
                      {newsError.message ?? "抱歉，暫時無法取得消息資訊"}
                    </p>
                    <Button
                      onClick={handleRefreshNews}
                      icon={RefreshIcon}
                      className="flex h-10 items-center gap-x-2"
                      disabled={newsLoading}
                    >
                      重新載入
                    </Button>
                  </div>
                ) : (
                  <NewsManager news={news} refreshNews={handleRefreshNews} />
                )}
              </section>
            </div>
            <section className="w-full">
              <h3 className="mb-4">訂單管理</h3>
              <OrderTable isAdmin={true} />
            </section>
          </div>
        )}
      </div>
    </AdminGate>
  );
};

export default AdminDashboard;
