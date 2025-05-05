import { Fragment, useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { debounce } from "lodash";

import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  SHIPPING_STATUS,
  ORDERS_FILTER_TYPES,
  ORDER_FILTER_TYPE_LABELS,
} from "@/constants/actionTypes";
import { Order } from "@/types/order";
import { addComma } from "@/utils/addComma";
import { formatDate } from "@/utils/formatDate";
import { useAlert } from "@/context/AlertContext";
import { useAxios } from "@/hooks/useAxios";

import ConfirmDeliveryForm from "@/components/organisms/ConfirmDeliveryForm";
import Modal from "@/components/molecules/Modal";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

import { ReactComponent as SearchIcon } from "@/assets/icons/search.inline.svg";
import { ReactComponent as ArrowDownIcon } from "@/assets/icons/nav-arrow-down.inline.svg";
import { ReactComponent as ArrowUpIcon } from "@/assets/icons/nav-arrow-up.inline.svg";
import { ReactComponent as ArrowLeftIcon } from "@/assets/icons/nav-arrow-left.inline.svg";
import { ReactComponent as ArrowRightIcon } from "@/assets/icons/nav-arrow-right.inline.svg";

interface OrdersFilterTabProps {
  label: string;
  filterValue: number;
  activeFilter: number;
  onClick: () => void;
}

interface OrdersActionsProps {
  order: Order;
  refreshOrders: () => void;
  isAdmin: boolean;
  onRepayment: (orderId: string) => void;
  onComplete: (orderId: string) => void;
  onDeliver: (orderId: string) => void;
}

interface OrdersTableProps {
  isAdmin: boolean;
}

const OrdersFilterTab = ({
  filterValue,
  activeFilter,
  onClick,
}: OrdersFilterTabProps) => (
  <button
    type="button"
    role="tab"
    onClick={onClick}
    className={`tab h-9 text-nowrap ${activeFilter === filterValue ? "border-primary border-b-[1.5px]" : "hover:border-b"}`}
  >
    {ORDER_FILTER_TYPE_LABELS[filterValue]}
  </button>
);

const OrdersActions = ({
  order,
  refreshOrders,
  isAdmin,
  onRepayment,
  onComplete,
  onDeliver,
}: OrdersActionsProps) => {
  const { _id, status, paymentStatus } = order;
  const { showAlert } = useAlert();

  const [shippingTrackingNo, setShippingTrackingNo] = useState<string>("");

  const { refresh: updateOrder } = useAxios(
    (params) => `/orders/${params?.id}`,
    { method: "PATCH", withCredentials: true },
    {
      immediate: false,
      onError: () =>
        showAlert({
          variant: "error",
          message: "更新訂單失敗，請稍後再試。",
        }),
    },
  );

  // 完成訂單（user）
  const handleComplete = async (orderId: string) => {
    await updateOrder({ id: orderId, status: "completed" });
    refreshOrders();
  };

  // 訂單出貨（admin）
  const handleDeliver = async (orderId, shippingTrackingNo) => {
    await updateOrder({ id: orderId, status: "shipped", shippingTrackingNo });
    setShippingTrackingNo("");
    refreshOrders();
  };

  if (!isAdmin) {
    if (status === "completed") return <span>已完成</span>;
    if (paymentStatus === "unpaid")
      return (
        <Button onClick={() => onRepayment(_id)} className="px-3 h-9">
          重新付款
        </Button>
      );

    return (
      <>
        <Button
          onClick={() => onComplete(_id)}
          className="px-3 h-9"
          disabled={status !== "picked_up"}
        >
          完成訂單
        </Button>
        <Modal
          id="completeOrderModal"
          onConfirm={() => handleComplete(_id)}
          title="確認收到商品無誤，再按下「確定」以完成訂單。"
          showAlert
        />
      </>
    );
  }

  if (status === "paid")
    return (
      <>
        <Button onClick={() => onDeliver(_id)} className="px-3 h-9">
          出貨
        </Button>
        <Modal
          id="confirmDeliveryModal"
          onConfirm={() => handleDeliver(_id, shippingTrackingNo)}
          title="出貨確認單"
          confirmText="確認出貨"
          isShowCloseIcon={true}
          isShowCloseBtn={false}
          disabled={!/^[A-Z0-9]{8,20}$/.test(shippingTrackingNo)}
          showAlert
        >
          <ConfirmDeliveryForm
            order={order}
            shippingTrackingNo={shippingTrackingNo}
            setShippingTrackingNo={setShippingTrackingNo}
          />
        </Modal>
      </>
    );

  return null;
};

const OrdersTable: React.FC<OrdersTableProps> = ({ isAdmin }) => {
  const navigate = useNavigate();

  const [inputKeyword, setInputKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterType, setFilterType] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");

  // 訂單 API 請求（admin / user）
  const apiUrl = isAdmin
    ? `/orders/all?page=${currentPage}&limit=10&keyword=${searchKeyword}&type=${filterType}&sortBy=${sortBy}&orderBy=${orderBy}`
    : `/orders?page=${currentPage}&limit=10&keyword=${searchKeyword}&type=${filterType}&sortBy=${sortBy}&orderBy=${orderBy}`;

  const { data: ordersData, refresh: refreshOrders } = useAxios(
    apiUrl,
    { withCredentials: true },
    { immediate: false },
  );
  const orders = ordersData?.orders;
  const totalOrders = ordersData?.totalOrders;
  const totalPages = ordersData?.totalPages;

  // 避免搜尋時過於頻繁發送請求
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchKeyword(value);
      }, 500),
    [],
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setInputKeyword(value);
    debouncedSearch(value);
  };

  const handleSort = (key: string) => {
    const newOrder = sortBy === key && orderBy === "asc" ? "desc" : "asc";
    setOrderBy(newOrder);
    setSortBy(key);
  };

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    refreshOrders();
  }, [currentPage, filterType, sortBy, orderBy, searchKeyword, refreshOrders]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3>{isAdmin ? "訂單管理" : "我的訂單"}</h3>
        <Input
          value={inputKeyword}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="透過訂單編號、商品名稱搜尋"
          icon={SearchIcon}
          containerStyle="w-full xs:w-72"
          inputStyle="bg-gray-100 h-10 text-sm border-none"
        />
      </div>
      {/* 篩選 Tabs */}
      <div
        role="tablist"
        className="mb-3 rounded bg-amber-100 tabs overflow-x-auto"
      >
        {Object.entries(ORDERS_FILTER_TYPES).map(([key, value]) => (
          <OrdersFilterTab
            key={key}
            label={key}
            filterValue={value}
            activeFilter={filterType}
            onClick={() => setFilterType(value)}
          />
        ))}
      </div>
      {/* 表格主體 */}
      {orders?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table min-w-full">
            <thead>
              <tr>
                {isAdmin && (
                  <th
                    className="flex items-center p-2 cursor-pointer gap-x-1"
                    onClick={() => handleSort("userId")}
                  >
                    <span>會員編號</span>
                    {sortBy === "userId" &&
                      (orderBy === "asc" ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      ))}
                  </th>
                )}
                <th className="p-2">訂單編號</th>
                <th
                  className="flex items-center p-2 cursor-pointer gap-x-1"
                  onClick={() => handleSort("createdAt")}
                >
                  <span>成立日期</span>
                  {sortBy === "createdAt" && orderBy === "asc" ? (
                    <ArrowUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4" />
                  )}
                </th>
                <th className="p-2">訂單狀態</th>
                <th className="p-2">付款狀態</th>
                <th className="p-2">出貨狀態</th>
                <th
                  className="flex items-center justify-end p-2 text-right cursor-pointer gap-x-1"
                  onClick={() => handleSort("totalAmount")}
                >
                  <span>總金額</span>
                  {sortBy === "totalAmount" &&
                    (orderBy === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    ))}
                </th>
                <th />
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              {orders.map((order) => (
                <Fragment key={order.orderNo}>
                  <tr>
                    {isAdmin && <td className="p-2">{order.userId}</td>}
                    <td className="p-2">{order.orderNo}</td>
                    <td className="p-2">{formatDate(order.createdAt)}</td>
                    <td className="p-2">{ORDER_STATUS[order.status]}</td>
                    <td className="p-2">
                      {PAYMENT_STATUS[order.paymentStatus]}
                    </td>
                    <td className="p-2">
                      {SHIPPING_STATUS[order.shippingStatus]}
                    </td>
                    <td className="p-2 text-right">
                      NT$ {addComma(order.totalAmount)}
                    </td>
                    <td className="flex items-center justify-end gap-x-2">
                      <OrdersActions
                        order={order}
                        refreshOrders={refreshOrders}
                        isAdmin={isAdmin}
                        onRepayment={(id) => navigate(`/checkout/${id}`)}
                        onComplete={() =>
                          (
                            document.getElementById(
                              "completeOrderModal",
                            ) as HTMLDialogElement
                          ).showModal()
                        }
                        onDeliver={() =>
                          (
                            document.getElementById(
                              "confirmDeliveryModal",
                            ) as HTMLDialogElement
                          ).showModal()
                        }
                      />
                      <Button
                        variant="icon"
                        icon={
                          expandedOrderId === order._id
                            ? ArrowUpIcon
                            : ArrowDownIcon
                        }
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === order._id ? null : order._id,
                          )
                        }
                        className="ml-2 border-none"
                      />
                    </td>
                  </tr>
                  {expandedOrderId === order._id && (
                    <tr className="bg-gray-100">
                      <td colSpan={8} className="px-4 py-2">
                        <ul className="list-disc list-inside">
                          {order.orderItems.map((item) => (
                            <li key={item.productId}>
                              {item.title} - NT$ {addComma(item.price)} x{" "}
                              {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <p className="text-base">尚無訂單資訊...</p>
        </div>
      )}
      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-gray-600">共 {totalOrders || 0} 筆訂單</p>
        {/* 分頁按鈕 */}
        <div className="flex items-center gap-x-2">
          <Button
            variant="icon"
            icon={ArrowLeftIcon}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`w-4 h-4 border-none hover:opacity-50 ${currentPage === 1 ? "invisible" : ""}`}
          />
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant="icon"
              onClick={() => handlePageChange(index + 1)}
              className={`w-4 h-4 text-xs border-none hover:opacity-80 ${index + 1 !== currentPage ? "text-gray-400" : ""}`}
            >
              {index + 1}
            </Button>
          ))}
          {currentPage < totalPages && (
            <Button
              variant="icon"
              icon={ArrowRightIcon}
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-4 h-4 border-none hover:opacity-50"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersTable;
