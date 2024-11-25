import logoPath from "@/assets/images/logo.png";

const Logo = ({ className = "" }) => (
  <img src={logoPath} className={className} alt="logo" />
);

export default Logo;
