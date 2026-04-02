import { debounce } from "lodash-es";
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/atoms/Loading";
import Modal from "@/components/molecules/Modal";
import ConfirmDeliveryForm from "@/components/organisms/ConfirmDeliveryForm";
import {
  ORDER_FILTER_OPTIONS,
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  SHIPPING_STATUS_MAP,
} from "@/constants/actionTypes";
import { useAlert } from "@/context/AlertContext";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "@/store/slices/apiSlice";
import type {
  Order,
  OrderStatus,
  PaymentStatus,
  ShippingStatus,
} from "@/types";
import { addComma } from "@/utils/addComma";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getOrderStatus } from "@/utils/getOrderStatus";

import ArrowDownIcon from "@/assets/icons/nav-arrow-down.inline.svg?react";
import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";
import ArrowUpIcon from "@/assets/icons/nav-arrow-up.inline.svg?react";
import SearchIcon from "@/assets/icons/search.inline.svg?react";

interface GetOrdersArgs {
  page?: number;
  limit?: number;
  status?: string;
  keyword?: string;
  sortBy?: string;
  orderBy?: "asc" | "desc";
}

const OrdersFilterTab = memo(
  ({
    label,
    filterValue,
    activeFilter,
    onClick,
  }: {
    label: string;
    filterValue: number;
    activeFilter: number;
    onClick: () => void;
  }) => (
    <button
      type="button"
      role="tab"
      onClick={onClick}
      className={cn(
        "tab h-9 text-nowrap font-medium transition-colors",
        activeFilter === filterValue
          ? "tab-active border-primary border-b-2 text-primary"
          : "hover:bg-gray-200"
      )}
    >
      {label}
    </button>
  )
);

OrdersFilterTab.displayName = "OrdersFilterTab";

const OrdersTable = ({ isAdmin }: { isAdmin: boolean }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [inputKeyword, setInputKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterType, setFilterType] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shippingTrackingNo, setShippingTrackingNo] = useState<string>("");
  const [shippingCarrier, setShippingCarrier] = useState<string>("黑貓宅急便");
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const queryArgs: GetOrdersArgs & { isAdmin: boolean } = {
    page: currentPage,
    limit: 25,
    status: filterType !== 0 ? String(filterType) : undefined,
    keyword: searchKeyword || undefined,
    sortBy,
    orderBy,
    isAdmin,
  };

  const {
    data: ordersData,
    isLoading,
    error,
    refetch: refreshOrders,
  } = useGetOrdersQuery(queryArgs as Parameters<typeof useGetOrdersQuery>[0]);

  const orders = useMemo(() => ordersData?.orders ?? [], [ordersData]);
  const totalPages = useMemo(() => ordersData?.totalPages ?? 1, [ordersData]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchKeyword(value), 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputKeyword(value);
      setCurrentPage(1);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleSort = useCallback(
    (key: string) => {
      setOrderBy((prev) => (sortBy === key && prev === "asc" ? "desc" : "asc"));
      setSortBy(key);
    },
    [sortBy]
  );

  // 處理換頁
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 處理完成訂單
  const handleCompleteOrder = async () => {
    if (!selectedOrder) return;
    try {
      await updateOrder({
        id: selectedOrder._id,
        status: "shipped",
      }).unwrap();
      showAlert({ variant: "success", message: "訂單已完成！" });
      refreshOrders();
      (
        document.getElementById("completeOrderModal") as HTMLDialogElement
      ).close();
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "更新失敗"),
      });
    }
  };

  // 處理出貨訂單
  const handleDeliverOrder = async () => {
    if (!selectedOrder) return;
    try {
      const payload = {
        id: selectedOrder._id,
        status: "shipped",
        shippingCarrier: shippingCarrier,
        shippingTrackingNo: shippingTrackingNo,
      };

      await updateOrder(
        payload as unknown as Parameters<typeof updateOrder>[0]
      ).unwrap();

      showAlert({ variant: "success", message: "訂單已出貨！" });
      setShippingTrackingNo("");
      setShippingCarrier("黑貓宅急便");
      refreshOrders();
      (
        document.getElementById("confirmDeliveryModal") as HTMLDialogElement
      ).close();
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "更新失敗"),
      });
    }
  };

  const openModal = (modalId: string, order: Order) => {
    setSelectedOrder(order);
    (document.getElementById(modalId) as HTMLDialogElement).showModal();
  };

  return (
    <>
      <div className="flex max-sm:flex-col sm:items-center gap-4 mb-4">
        <h3 className="font-bold">{isAdmin ? "訂單管理" : "我的訂單"}</h3>
        <Input
          value={inputKeyword}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="搜尋訂單編號或商品名稱"
          icon={SearchIcon}
          className="max-w-80"
          aria-label="搜尋訂單"
        />
      </div>
      <div
        role="tablist"
        className="tabs tabs-bordered w-full overflow-x-auto mb-4 hide-scrollbar"
      >
        {ORDER_FILTER_OPTIONS.map((tab) => (
          <OrdersFilterTab
            key={tab.id}
            label={tab.label}
            filterValue={tab.value}
            activeFilter={filterType}
            onClick={() => {
              setFilterType(tab.value);
              setCurrentPage(1);
            }}
          />
        ))}
      </div>
      {isLoading ? (
        <div className="flex-center h-64">
          <Loading />
        </div>
      ) : error ? (
        <div className="flex-center flex-col h-64 gap-4">
          <p className="text-gray-700">
            {getErrorMessage(error, "載入訂單時發生錯誤")}
          </p>
          <Button onClick={refreshOrders} className="btn-outline">
            載入
          </Button>
        </div>
      ) : orders.length > 0 ? (
        <>
          <div className="overflow-x-auto border border-gray-200">
            <table className="table table-zebra w-full">
              <thead className="bg-gray-100 text-nowrap">
                <tr>
                  {isAdmin && (
                    <th
                      className="cursor-pointer"
                      onClick={() => handleSort("userId")}
                    >
                      <div className="flex items-center gap-1">
                        會員編號{" "}
                        {sortBy === "userId" &&
                          (orderBy === "asc" ? (
                            <ArrowUpIcon className="size-4" />
                          ) : (
                            <ArrowDownIcon className="size-4" />
                          ))}
                      </div>
                    </th>
                  )}
                  <th>訂單編號</th>
                  <th
                    className="cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      成立日期
                      {sortBy === "createdAt" &&
                        (orderBy === "asc" ? (
                          <ArrowUpIcon className="size-4" />
                        ) : (
                          <ArrowDownIcon className="size-4" />
                        ))}
                    </div>
                  </th>
                  {isAdmin ? (
                    <>
                      <th>訂單狀態</th>
                      <th>付款狀態</th>
                      <th>出貨狀態</th>
                    </>
                  ) : (
                    <th>訂單狀態</th>
                  )}

                  <th className="text-right">總金額</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: Order) => {
                  const orderStatus = getOrderStatus(order);

                  return (
                    <Fragment key={order._id}>
                      <tr className="text-nowrap">
                        {isAdmin && (
                          <td>
                            {typeof order.userId === "object" &&
                            order.userId !== null
                              ? order.userId._id
                              : (order.userId as string) || "-"}
                          </td>
                        )}
                        <td>{order.orderNo}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        {isAdmin ? (
                          <>
                            <td>
                              <span className="badge badge-ghost border-none h-7 bg-orange-100/80">
                                {ORDER_STATUS_MAP[
                                  order.status as OrderStatus
                                ] || order.status}
                              </span>
                            </td>
                            <td>
                              {PAYMENT_STATUS_MAP[
                                order.paymentStatus as PaymentStatus
                              ] || order.paymentStatus}
                            </td>
                            <td>
                              {SHIPPING_STATUS_MAP[
                                order.shippingStatus as ShippingStatus
                              ] || order.shippingStatus}
                            </td>
                          </>
                        ) : (
                          <td>
                            <span className="px-2 py-1 rounded text-sm font-medium">
                              {orderStatus}
                            </span>
                          </td>
                        )}
                        <td className="text-right font-medium text-primary">
                          NT$ {addComma(order.totalAmount)}
                        </td>
                        <td className="flex items-center gap-2 justify-end">
                          {!isAdmin && order.status === "completed" && (
                            <span className="text-sm">已完成</span>
                          )}
                          {!isAdmin && order.paymentStatus === "unpaid" && (
                            <Button
                              onClick={() => navigate(`/checkout/${order._id}`)}
                              className="rounded-full"
                            >
                              重新付款
                            </Button>
                          )}
                          {!isAdmin && order.status === "shipped" && (
                            <Button
                              onClick={() =>
                                openModal("completeOrderModal", order)
                              }
                              className="rounded-full btn-outline"
                            >
                              完成訂單
                            </Button>
                          )}
                          {isAdmin && order.status === "paid" && (
                            <Button
                              onClick={() =>
                                openModal("confirmDeliveryModal", order)
                              }
                              className="rounded-full"
                            >
                              出貨
                            </Button>
                          )}
                          <Button
                            variant="icon"
                            icon={
                              expandedOrderId === order._id
                                ? ArrowUpIcon
                                : ArrowDownIcon
                            }
                            onClick={() =>
                              setExpandedOrderId((prev) =>
                                prev === order._id ? null : order._id
                              )
                            }
                          />
                        </td>
                      </tr>
                      {expandedOrderId === order._id && (
                        <tr>
                          <td
                            colSpan={isAdmin ? 8 : 5}
                            className="p-0 border-b-0"
                          >
                            <div className="px-6 py-4 text-sm bg-gray-50/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                  <div>
                                    <p className="font-medium mb-2">商品明細</p>
                                    <ul className="space-y-1">
                                      {order.orderItems.map((item) => (
                                        <li
                                          key={item.productId}
                                          className="flex justify-between gap-4"
                                        >
                                          <span className="flex-1 truncate">
                                            {item.title} x{item.quantity}
                                          </span>
                                          <span className="font-medium">
                                            NT${" "}
                                            {addComma(
                                              item.price * item.quantity
                                            )}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  {order.note && (
                                    <div className="pt-4">
                                      <p className="font-medium mb-2">
                                        買家備註
                                      </p>
                                      <p className="text-sm whitespace-pre-wrap p-2 bg-white shadow wrap-break-words">
                                        {order.note}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div>
                                    <p className="font-medium mb-2">物流資訊</p>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span>配送進度</span>
                                        <span>
                                          {SHIPPING_STATUS_MAP[
                                            order.shippingStatus as ShippingStatus
                                          ] || order.shippingStatus}
                                        </span>
                                      </div>
                                      {order.shippingTrackingNo && (
                                        <div className="flex justify-between">
                                          <span>物流單號</span>
                                          <span>
                                            {order.shippingTrackingNo}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="pt-4">
                                    <p className="font-medium mb-2">金額明細</p>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span>商品金額</span>
                                        <span>
                                          NT$ {addComma(order.subtotal)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>運費</span>
                                        <span>
                                          {order.shippingFee === 0
                                            ? "免運費"
                                            : `NT$ ${addComma(order.shippingFee)}`}
                                        </span>
                                      </div>
                                      {order.couponCode && (
                                        <div className="flex justify-between text-green-600">
                                          <span>
                                            優惠碼：{order.couponCode}
                                          </span>
                                          <span className="font-medium">
                                            - NT$ {addComma(order.discount)}
                                          </span>
                                        </div>
                                      )}
                                      {!order.couponCode &&
                                        order.discount > 0 && (
                                          <div className="flex justify-between text-red-600">
                                            <span>折扣</span>
                                            <span className="font-medium">
                                              - NT$ {addComma(order.discount)}
                                            </span>
                                          </div>
                                        )}
                                      <hr className="border-t my-3" />
                                      <div className="flex justify-between font-medium">
                                        <span>總金額</span>
                                        <span>
                                          NT$ {addComma(order.totalAmount)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center text-sm text-gray-600 justify-end gap-2 mt-2">
              <Button
                variant="icon"
                icon={ArrowLeftIcon}
                onClick={() => handlePageChange(currentPage - 1)}
                iconStyle="size-4"
              />
              <span>{currentPage}</span>
              <span>/</span>
              <span>{totalPages}</span>
              <Button
                variant="icon"
                icon={ArrowRightIcon}
                onClick={() => handlePageChange(currentPage + 1)}
                iconStyle="size-4"
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex-center flex-col h-64 gap-2 bg-gray-100 rounded-lg border border-gray-200">
          <p className="text-gray-content/60">尚無訂單資訊</p>
        </div>
      )}
      <Modal
        id="completeOrderModal"
        onConfirm={handleCompleteOrder}
        title="確認收到商品無誤，再按下「確定」以完成訂單。"
        disabled={isUpdating}
        showAlert
      />
      {isAdmin && selectedOrder && (
        <Modal
          id="confirmDeliveryModal"
          onConfirm={handleDeliverOrder}
          title="訂單出貨"
          confirmText="確認出貨"
          isShowCloseBtn={false}
          disabled={!/^[A-Z0-9]{8,20}$/.test(shippingTrackingNo) || isUpdating}
          showAlert
        >
          <ConfirmDeliveryForm
            order={selectedOrder}
            shippingTrackingNo={shippingTrackingNo}
            setShippingTrackingNo={setShippingTrackingNo}
            shippingCarrier={shippingCarrier}
            setShippingCarrier={setShippingCarrier}
          />
        </Modal>
      )}
    </>
  );
};

export default OrdersTable;
