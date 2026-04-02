import Button from "@/components/atoms/Button";
import Loading from "@/components/atoms/Loading";
import AdminGate from "@/components/organisms/AdminGate";
import CouponManager from "@/components/organisms/CouponManager";
import NewsManager from "@/components/organisms/NewsManager";
import OrderTable from "@/components/organisms/OrdersTable";
import ProductsManager from "@/components/organisms/ProductsManager";
import {
  useGetCouponsQuery,
  useGetNewsQuery,
  useGetProductsQuery,
} from "@/store/slices/apiSlice";
import { getErrorMessage } from "@/utils/getErrorMessage";

import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";

const ADMIN_MANAGER_LIST_LIMIT = 1000;

const AdminDashboard = () => {
  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
    isFetching: productsFetching,
    refetch: refreshProducts,
  } = useGetProductsQuery({ page: 1, limit: ADMIN_MANAGER_LIST_LIMIT });

  const {
    data: newsData,
    error: newsError,
    isLoading: newsLoading,
    isFetching: newsFetching,
    refetch: refreshNews,
  } = useGetNewsQuery({ page: 1, limit: ADMIN_MANAGER_LIST_LIMIT });

  const {
    data: couponsData,
    error: couponsError,
    isLoading: couponsLoading,
    isFetching: couponsFetching,
    refetch: refreshCoupons,
  } = useGetCouponsQuery();

  const products = productsData?.products ?? [];
  const news = newsData?.news ?? [];
  const coupons = couponsData?.coupons ?? [];

  if (productsLoading || newsLoading || couponsLoading)
    return <Loading fullPage />;

  return (
    <AdminGate>
      <div className="p-4 md:px-8">
        <h2 className="mb-6">管理員後台</h2>
        <div className="flex flex-col">
          <OrderTable isAdmin={true} />
          <div className="mt-8 flex max-xl:flex-col gap-x-8">
            <section className="min-h-48 min-w-0 flex-1">
              {productsError ? (
                <div className="flex-center h-full flex-col gap-4 rounded border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <p className="text-base text-gray-600">
                    {getErrorMessage(
                      productsError,
                      "抱歉，暫時無法取得商品資訊。"
                    )}
                  </p>
                  <Button
                    onClick={refreshProducts}
                    icon={RefreshIcon}
                    className="flex h-10 items-center gap-x-2"
                    disabled={productsFetching}
                  >
                    {productsFetching ? "載入中" : "重新載入"}
                  </Button>
                </div>
              ) : (
                <ProductsManager products={products} />
              )}
            </section>
            <section className="min-h-48 min-w-0 flex-1">
              {newsError ? (
                <div className="flex-center h-full flex-col gap-4 rounded border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <p className="text-base text-gray-600">
                    {getErrorMessage(newsError, "抱歉，暫時無法取得消息資訊")}
                  </p>
                  <Button
                    onClick={refreshNews}
                    icon={RefreshIcon}
                    className="flex h-10 items-center gap-x-2"
                    disabled={newsFetching}
                  >
                    {newsFetching ? "載入中" : "重新載入"}
                  </Button>
                </div>
              ) : (
                <NewsManager news={news} />
              )}
            </section>
          </div>
          <section className="mt-6 min-h-48 min-w-0">
            {couponsError ? (
              <div className="flex-center h-full flex-col gap-4 rounded border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-base text-gray-600">
                  {getErrorMessage(
                    couponsError,
                    "抱歉，暫時無法取得優惠碼資訊"
                  )}
                </p>
                <Button
                  onClick={refreshCoupons}
                  icon={RefreshIcon}
                  className="flex h-10 items-center gap-x-2"
                  disabled={couponsFetching}
                >
                  {couponsFetching ? "載入中" : "重新載入"}
                </Button>
              </div>
            ) : (
              <CouponManager coupons={coupons} />
            )}
          </section>
        </div>
      </div>
    </AdminGate>
  );
};

export default AdminDashboard;
