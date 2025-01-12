import logoPath from "@/assets/images/logo.png";
import logoWhitePath from "@/assets/images/logo-white.png";

interface LogoProps {
  className?: string;
  isWhite?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, isWhite = false }) => (
  <img
    src={isWhite ? logoWhitePath : logoPath}
    className={"w-40 " + className}
    alt="logo"
  />
);

export default Logo;
