import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAxios } from "@/hooks/useAxios";
import { useAuth } from "@/context/AuthContext";

import Layout from "@/layouts/AppLayout";
import OrderTable from "@/components/organisms/OrdersTable";
import ProductsManager from "@/components/organisms/ProductsManager";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/atoms/Loading";

import { ReactComponent as RefreshIcon } from "@/assets/icons/refresh.inline.svg";
import { ReactComponent as EditIcon } from "@/assets/icons/edit.inline.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/xmark.inline.svg";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 權限檢查
  useEffect(() => {
    if (user?.role !== "admin") navigate("/");
  }, [user?.role, navigate]);

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
  const { data: newData, refresh: refreshNew } = useAxios(
    (params) => `/news/${params?.id}`,
    { withCredentials: true },
    { immediate: false }
  );
  const news = newsData?.news;

  return (
    <Layout className="px-4 py-4 md:px-8">
      <h2 className="mb-3">管理員後台</h2>
      {productsLoading || newsLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col w-full gap-6 mb-6 lg:gap-12 sm:flex-row">
          {/* 商品管理 */}
          <div
            className={`flex-1 sm:w-1/2 min-h-48 ${productsError && "flex items-center justify-center"}`}
          >
            {productsError ? (
              <div className="flex flex-col items-center gap-y-4">
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
            className={`flex-1 sm:w-1/2 min-h-48 ${newsError && "flex items-center justify-center"}`}
          >
            {newsError ? (
              <div className="flex flex-col items-center gap-y-4">
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
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3>消息管理</h3>
                  <Button
                    onClick={() => {
                      (
                        document.getElementById(
                          "newManageForm"
                        ) as HTMLDialogElement
                      ).showModal();
                    }}
                    className="h-9"
                  >
                    新增消息
                  </Button>
                  <Modal
                    id="newManageForm"
                    confirmText="新增"
                    onConfirm={() => {}}
                    isShowCloseIcon={true}
                  ></Modal>
                </div>
                {news?.length > 0 ? (
                  <ul className="px-4 overflow-y-auto border shadow max-h-80">
                    {news?.map((newsItem) => (
                      <li
                        className="flex items-center justify-between py-3 border-b border-gray-300 border-dashed"
                        key={newsItem._id}
                      >
                        <p className="overflow-hidden truncate hover:opacity-80 whitespace-nowrap">
                          {newsItem.title}
                        </p>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <Button
                            variant="icon"
                            icon={EditIcon}
                            className="border-none h-fit"
                            onClick={() =>
                              (
                                document.getElementById(
                                  "newManageForm"
                                ) as HTMLDialogElement
                              ).showModal()
                            }
                          />
                          <Modal
                            id="newManageForm"
                            confirmText="更新"
                            onConfirm={() => {}}
                            isShowCloseIcon={true}
                          ></Modal>
                          <Button
                            variant="icon"
                            icon={CloseIcon}
                            onClick={() =>
                              (
                                document.getElementById(
                                  "deleteNewModal"
                                ) as HTMLDialogElement
                              ).showModal()
                            }
                            className="border-none h-fit"
                          />
                          <Modal
                            id="deleteNewModal"
                            title="確定要刪除此消息嗎？"
                            confirmText="刪除"
                            onConfirm={() => {}}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>尚無任何消息...</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {/* 訂單管理 */}
      <OrderTable isAdmin={true} />
    </Layout>
  );
};

export default AdminDashboard;
