import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useAxios } from "@/hooks/useAxios";

import Layout from "@/layouts/AppLayout";
import NotFound from "@/pages/notFound";
import OrderTable from "@/components/organisms/OrderTable";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/atoms/Loading";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

import { ReactComponent as LogoutIcon } from "@/assets/icons/logout.inline.svg";
import { ReactComponent as ArrowRightIcon } from "@/assets/icons/nav-arrow-right.inline.svg";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data, error: ordersError, isLoading: ordersLoading, refresh: refreshOrders } = useAxios(
    "/orders",
    { withCredentials: true }
  );
  const orders = data?.orders;

  const { refresh: updateOrder } = useAxios(
    params => `/orders/${params?.id}`,
    { method: "PATCH", withCredentials: true },
    { immediate: false }
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleRepayment = async (orderId: string) => {
    navigate(`/checkout/${orderId}`);
  };

  const handleComplete = async (orderId: string) => {
    await updateOrder({ id: orderId, status: "completed" });
    refreshOrders();
    setModalOpen(false);
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId); // 切換顯示或隱藏訂單商品
  };

  if (ordersError) return <NotFound message={[ordersError]} />;
  if (ordersLoading) return <Loading />;

  return (
    <Layout className="w-full max-w-6xl px-5 py-8 mx-auto md:px-8">
      <h2>帳戶</h2>
      <div className="flex items-center gap-4 mb-6">
        <p className="text-base">{user.email}</p>
        <Button
          variant="link"
          icon={LogoutIcon}
          iconPosition="end"
          onClick={logout}
          className="text-primary"
        >
          登出
        </Button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onConfirm={() => selectedOrderId && handleComplete(selectedOrderId)}
        onClose={setModalOpen.bind(null, false)}
        title="確認收到商品無誤，再按下「確定」以完成訂單。"
      />
      <h3 className="mb-4">我的訂單</h3>
      {orders?.length ? (
        <OrderTable
          orders={orders}
          setSelectedOrderId={setSelectedOrderId}
          setModalOpen={setModalOpen}
          expandedOrderId={expandedOrderId}
          toggleOrderDetails={toggleOrderDetails}
          handleRepayment={handleRepayment}
        />
      ) : (
        <p className="text-base">尚無訂單資訊...</p>
      )}
      <div className="mt-12 text-right">
        <Button variant="link" onClick={() => navigate("/contact")} className="text-primary h-9">
          <span className="font-normal">聯繫客服</span> <ArrowRightIcon className="w-5 h-5" />
        </Button>
      </div>
    </Layout>
  );
};

export default UserDashboard;
