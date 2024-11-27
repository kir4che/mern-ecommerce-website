import Logo from "@/components/atoms/Logo";

const Footer = () => (
  <footer className="p-8 m-5 md:px-16 md:py-10 text-secondary bg-primary rounded-xl">
    <div className="flex flex-wrap items-baseline justify-between gap-y-4">
      <Logo isWhite={true} />
      <p className="font-light text-xxs">
        Copyright © 2024 日出麵包坊 all rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
