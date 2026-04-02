import AdminGate from "@/components/organisms/AdminGate";
import CouponManager from "@/components/organisms/CouponManager";
import NewsManager from "@/components/organisms/NewsManager";
import OrderTable from "@/components/organisms/OrdersTable";
import ProductsManager from "@/components/organisms/ProductsManager";

const AdminDashboard = () => {
  return (
    <AdminGate>
      <div className="p-4 md:px-8">
        <h2 className="mb-6">管理員後台</h2>
        <div className="flex flex-col">
          <OrderTable isAdmin={true} />
          <div className="mt-8 flex max-xl:flex-col gap-x-8">
            <section className="min-h-48 min-w-0 flex-1">
              <ProductsManager />
            </section>
            <section className="min-h-48 min-w-0 flex-1">
              <NewsManager />
            </section>
          </div>
          <section className="mt-6 min-h-48 min-w-0">
            <CouponManager />
          </section>
        </div>
      </div>
    </AdminGate>
  );
};

export default AdminDashboard;
