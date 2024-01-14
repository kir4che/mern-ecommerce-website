import logo from '../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="px-20 py-12 m-6 text-secondary bg-primary rounded-xl">
      <div className='flex items-baseline justify-between'>
        <img src={logo} className='w-52 invert brightness-0' alt='logo' />
        <p className='font-light text-xxs'>Copyright © 2024 日出麵包坊 all rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;