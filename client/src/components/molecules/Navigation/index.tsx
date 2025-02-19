import { Link } from "react-router-dom";

const sections = [
  {
    items: [
      { title: "首頁", path: "/" },
      { title: "關於我們", path: "/about" },
      { title: "最新消息", path: "/news" },
      { title: "常見問題", path: "/faq" },
      { title: "聯繫我們", path: "/contact" },
      { title: "會員中心", path: "/my-account", role: "user" },
      { title: "管理後台", path: "/admin/dashboard", role: "admin" }
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
    ]
  }
];

const Navigation = ({ user, handleMenuClose }) => {
  const filteredSections = sections.map((section) => {
    const filteredItems = section.items?.filter((item) => {
      if (!item.role) return true; // 無角色限制的項目所有人都能看見
      if (item.role === "admin" && user?.role !== "admin") return false; // 非 admin 隱藏「管理後台」
      if (item.role === "user" && !["user", "admin"].includes(user?.role)) return false;
      return true;
    });

    return { ...section, items: filteredItems };
  });

  return (
  <nav className="flex w-2/3 gap-24 pt-16 pb-24 mx-auto lg:w-3/5 max-w-96 text-secondary">
    {filteredSections.map((section, index) => (
      <ul key={index} className="flex-1 space-y-4">
        {section.title && (
          <li className="pb-2.5 border-b border-dashed border-secondary">
            <Link to={section.path} onClick={handleMenuClose}>
              {section.title}
            </Link>
          </li>
        )}
        <ul className={`text-nowrap ${index === 1 ? "space-y-2.5" : "space-y-4"}`}>
          {section.items.map(({ title, path }) => (
            <li key={path}>
              <Link to={path} onClick={handleMenuClose}>
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </ul>
    ))}
  </nav>
  );
};

export default Navigation;
