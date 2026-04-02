import { debounce } from "lodash-es";
import { Fragment, memo, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/atoms/Loading";
import {
  ORDER_FILTER_OPTIONS,
  SHIPPING_STATUS_MAP,
} from "@/constants/actionTypes";
import { useAlert } from "@/context/AlertContext";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import { useOrders } from "@/hooks/useOrders";
import {
  useCancelOrderMutation,
  useUpdateOrderMutation,
} from "@/store/slices/apiSlice";
import type { Order, ShippingStatus } from "@/types";
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

const UserOrdersTable = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const confirmDialog = useConfirmDialog();

  const {
    orders,
    isLoading,
    error,
    totalPages,
    currentPage,
    filterType,
    inputKeyword,
    expandedOrderId,
    setInputKeyword,
    setSearchKeyword,
    setFilterType,
    setCurrentPage,
    setExpandedOrderId,
    handlePageChange,
    refreshOrders,
  } = useOrders(false);

  const [updateOrder] = useUpdateOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchKeyword(value), 500),
    [setSearchKeyword]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setInputKeyword(value);
    setCurrentPage(1);
    debouncedSearch(value);
  };

  // 處理完成訂單（收貨）
  const handleCompleteOrder = async (orderId: string) => {
    try {
      await updateOrder({
        id: orderId,
        status: "completed",
      }).unwrap();

      showAlert({ variant: "success", message: "訂單已完成！" });
      refreshOrders();
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "更新失敗"),
      });
    }
  };

  // 處理取消訂單
  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId).unwrap();
      showAlert({ variant: "success", message: "訂單已取消" });
      refreshOrders();
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "取消失敗"),
      });
    }
  };

  return (
    <>
      <div className="flex max-sm:flex-col sm:items-center gap-4 mb-4">
        <h3 className="font-bold">我的訂單</h3>
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
                  <th>訂單編號</th>
                  <th>成立日期</th>
                  <th>訂單狀態</th>
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
                        <td>{order.orderNo}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          <span className="px-2 py-1 rounded text-sm font-medium">
                            {orderStatus}
                          </span>
                        </td>
                        <td className="text-right font-medium text-primary">
                          NT$ {addComma(order.totalAmount)}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {order.status === "completed" && (
                              <span className="badge badge-ghost text-gray-500 font-medium px-3 py-3 rounded-full bg-gray-100 border-none">
                                已完成
                              </span>
                            )}
                            {order.paymentStatus === "unpaid" && (
                              <div className="flex items-center gap-3 bg-orange-50 pr-1.5 pl-3 py-1.5 rounded-full border border-orange-200">
                                <span className="text-xs font-medium text-orange-600 whitespace-nowrap flex items-center gap-1">
                                  <span className="relative flex size-2">
                                    <span className="animate-ping absolute inline-flex size-full rounded-full bg-orange-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full size-2 bg-orange-500"></span>
                                  </span>
                                  請在 24h 內付款
                                </span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    onClick={() => {
                                      confirmDialog.open({
                                        title: "取消訂單",
                                        message:
                                          "確定要取消此訂單嗎？取消後無法復原。",
                                        confirmText: "確認取消",
                                        onConfirm: () =>
                                          handleCancelOrder(order._id),
                                      });
                                    }}
                                    className="px-3 text-xs rounded-full bg-white text-gray-800 hover:bg-gray-100 shadow border-gray-200 hover:border-gray-300"
                                  >
                                    取消
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      navigate(`/checkout/${order._id}`)
                                    }
                                    className="px-3 text-xs rounded-full shadow bg-orange-500 hover:bg-orange-600"
                                  >
                                    前往付款
                                  </Button>
                                </div>
                              </div>
                            )}
                            {order.status === "shipped" && (
                              <Button
                                onClick={() => {
                                  confirmDialog.open({
                                    title: "完成訂單",
                                    message:
                                      "確認收到商品無誤，再按下「確認完成」以完成訂單。",
                                    confirmText: "確認完成",
                                    onConfirm: () =>
                                      handleCompleteOrder(order._id),
                                  });
                                }}
                                className="text-sm rounded-full"
                              >
                                完成訂單
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
                          </div>
                        </td>
                      </tr>
                      {expandedOrderId === order._id && (
                        <tr>
                          <td colSpan={5} className="p-0 border-b-0">
                            <div className="px-6 py-4 text-sm bg-gray-50/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col h-full">
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
                                    <div className="pt-4 flex-1 flex flex-col">
                                      <p className="font-medium mb-2">
                                        買家備註
                                      </p>
                                      <p className="text-sm whitespace-pre-wrap p-3 bg-white shadow rounded-md wrap-break-word flex-1">
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
    </>
  );
};

export default UserOrdersTable;
