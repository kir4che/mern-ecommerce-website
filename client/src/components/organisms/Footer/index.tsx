import Logo from '../../../components/atoms/Logo';

const Footer = () => {
  return (
    <footer className="px-20 py-12 m-6 text-secondary bg-primary rounded-xl">
      <div className='flex items-baseline justify-between'>
        <Logo className='w-24 h-8' />
        <p className='font-light text-xxs'>Copyright © 2024 日出麵包坊 all rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;