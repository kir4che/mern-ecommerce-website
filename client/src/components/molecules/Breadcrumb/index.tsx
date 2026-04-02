import { cn } from "@/utils/cn";
import { Link } from "react-router";

interface BreadcrumbProps {
  textColor?: string;
  link: string;
  text: string;
}

const Breadcrumb = ({
  textColor = "text-primary",
  link,
  text,
}: BreadcrumbProps) => (
  <div className={cn("breadcrumbs text-xs", textColor)}>
    <ul>
      <li>
        <Link to="/" data-testid="home-link">
          首頁
        </Link>
      </li>
      <li>
        <Link to={`/${link}`} data-testid="breadcrumb-link">
          {text}
        </Link>
      </li>
    </ul>
  </div>
);

export default Breadcrumb;
