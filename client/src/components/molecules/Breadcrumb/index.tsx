import { Link } from "react-router-dom";

interface BreadcrumbProps {
  textColor?: string;
  link: string;
  text: string;
  text2?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ textColor = "text-primary", link, text, text2 }) => (
  <p className={`flex items-center space-x-1 text-sm md:text-xxs ${textColor}`}>
    <Link to="/" className="hover:underline">首頁</Link>
    <span>{">"}</span>
    <Link to={`/${link}`} className="hover:underline">{text}</Link>
    {text2 && (
      <>
        <span>{">"}</span>
        <span>{text2}</span>
      </>
    )}
  </p>
);

export default Breadcrumb;
