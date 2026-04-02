import { Link } from "react-router";

import Button from "@/components/atoms/Button";
import OrderTable from "@/components/organisms/OrdersTable";
import { useAuth } from "@/hooks/useAuth";

import LogoutIcon from "@/assets/icons/logout.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";

const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full min-h-[calc(100vh-15rem)] flex flex-col max-w-6xl px-5 pt-8 mx-auto md:px-8">
      <div className="flex max-sm:justify-between items-center gap-4 mb-6">
        <p className="text-base">{user?.email}</p>
        <Button
          variant="link"
          icon={LogoutIcon}
          iconPosition="end"
          onClick={logout}
          className="text-primary hover:opacity-70"
        >
          登出
        </Button>
      </div>
      <OrderTable isAdmin={false} />
      <div className="mt-auto pt-8">
        <Link
          to="/contact"
          className="flex items-center justify-end gap-1 text-sm font-medium text-gray-content/70 hover:text-primary transition-colors"
        >
          聯繫客服 <ArrowRightIcon className="size-5" />
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
