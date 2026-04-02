import AdminOrdersTable from "@/components/organisms/AdminOrdersTable";
import UserOrdersTable from "@/components/organisms/UserOrdersTable";

const OrdersTable = ({ isAdmin }: { isAdmin: boolean }) => {
  return isAdmin ? <AdminOrdersTable /> : <UserOrdersTable />;
};

export default OrdersTable;
