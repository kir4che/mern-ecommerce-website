import { Link } from "react-router";

interface BreadcrumbProps {
  textColor?: string;
  link: string;
  text: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  textColor = "text-primary",
  link,
  text,
}) => (
  <p className={`flex items-center space-x-1 text-xs ${textColor}`}>
    <Link to="/" className="hover:underline">
      首頁
    </Link>
    <span>{">"}</span>
    <Link to={`/${link}`} className="hover:underline">
      {text}
    </Link>
  </p>
);

export default Breadcrumb;
