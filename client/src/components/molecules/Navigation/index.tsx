import { Link } from "react-router-dom";

const Navigation = ({ className, handleMenuOpen }) => (
  <nav className={className}>
    <ul>
      <li>
        <Link to="/" className="menu__item" onClick={handleMenuOpen}>
          首頁
        </Link>
      </li>
      <li>
        <Link to="/pages/about" className="menu__item" onClick={handleMenuOpen}>
          關於我們
        </Link>
      </li>
      <li>
        <Link to="/blogs/news" className="menu__item" onClick={handleMenuOpen}>
          最新消息
        </Link>
      </li>
      <li>
        <Link to="/pages/faq" className="menu__item" onClick={handleMenuOpen}>
          常見問題
        </Link>
      </li>
      <li>
        <Link
          to="/pages/contact"
          className="menu__item"
          onClick={handleMenuOpen}
        >
          聯繫我們
        </Link>
      </li>
    </ul>
    <ul>
      <li>
        <Link
          to="/collections/all"
          className="menu__item"
          onClick={handleMenuOpen}
        >
          所有商品
        </Link>
      </li>
      <li>
        <Link
          to="/collections/recommend"
          className="menu__item"
          onClick={handleMenuOpen}
        >
          推薦
        </Link>
      </li>
      <li>
        <Link
          to="/collections/bread"
          className="menu__item"
          onClick={handleMenuOpen}
        >
          麵包
        </Link>
      </li>
      <li>
        <Link
          to="/collections/cake"
          className="menu__item"
          onClick={handleMenuOpen}
        >
          蛋糕
        </Link>
      </li>
      <li>
        <Link
          to="/collections/cookie"
          className="menu__item"
          onClick={handleMenuOpen}
        >
          餅乾
        </Link>
      </li>
      <li>
        <Link
          to="/collections/other"
          className="menu__item"
          onClick={handleMenuOpen}
        >
          其他
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;
