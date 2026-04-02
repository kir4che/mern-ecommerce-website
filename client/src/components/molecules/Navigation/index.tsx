import { UserRole } from "@/types";
import { cn } from "@/utils/cn";
import { Link } from "react-router";

type Role = UserRole | string | null | undefined;

interface NavigationProps {
  role?: Role;
  handleMenuClose: () => void;
}

const sections = [
  {
    items: [
      { title: "首頁", path: "/" },
      { title: "關於我們", path: "/about" },
      { title: "最新消息", path: "/news" },
      { title: "常見問題", path: "/faq" },
      { title: "聯繫我們", path: "/contact" },
      { title: "會員中心", path: "/my-account", role: "user" },
      { title: "管理後台", path: "/admin/dashboard", role: "admin" },
    ],
  },
  {
    title: "所有商品",
    path: "/collections/all",
    items: [
      { title: "推薦", path: "/collections/recommend" },
      { title: "麵包", path: "/collections/bread" },
      { title: "蛋糕", path: "/collections/cake" },
      { title: "餅乾", path: "/collections/cookie" },
      { title: "其他", path: "/collections/other" },
    ],
  },
];

const Navigation = ({ role, handleMenuClose }: NavigationProps) => {
  const filteredSections = sections.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (!item.role) return true;
      if (item.role === "admin") return role === "admin";
      if (item.role === "user") return role === "admin" || role === "user";
      return false;
    }),
  }));

  return (
    <nav
      aria-label="主選單"
      className="flex max-sm:flex-col sm:items-baseline w-full max-w-xs sm:max-w-2xl gap-12 sm:gap-24 pt-10 sm:pt-16 pb-24 mx-auto px-8 text-white"
    >
      {filteredSections.map((section, index) => (
        <div key={index} className="flex-1">
          {section.title && section.path && (
            <div className="pb-2.5 border-b border-dashed border-white/50 mb-4">
              <Link
                to={section.path}
                onClick={handleMenuClose}
                className="text-lg tracking-wider font-medium hover:text-gray-200 transition-colors"
              >
                {section.title}
              </Link>
            </div>
          )}
          <ul
            className={cn(
              "flex flex-col text-nowrap",
              index === 1 ? "space-y-3" : "space-y-4"
            )}
          >
            {section.items.map(({ title, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={handleMenuClose}
                  className="block w-fit opacity-80 hover:opacity-100 hover:translate-x-2 transition-all duration-300 font-light tracking-wide"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
