import { Link } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import Layout from "@/layouts/AppLayout";
import OrderTable from "@/components/organisms/OrderTable";
import Button from "@/components/atoms/Button";

import { ReactComponent as LogoutIcon } from "@/assets/icons/logout.inline.svg";
import { ReactComponent as ArrowRightIcon } from "@/assets/icons/nav-arrow-right.inline.svg";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <Layout className="w-full max-w-6xl px-5 pt-8 pb-4 mx-auto md:px-8">
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
      <OrderTable isAdmin={false} />
      <Link to="/contact" className="flex items-center justify-end gap-1 mt-12 text-sm">
        聯繫客服 <ArrowRightIcon className="w-5 h-5" />
      </Link>
    </Layout>
  );
};

export default UserDashboard;
