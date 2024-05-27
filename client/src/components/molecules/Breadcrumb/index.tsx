import { Link } from 'react-router-dom';

const Breadcrumb = ({ text, textColor = 'text-primary' }) => {
  return (
    <p className={`flex items-center space-x-1 text-sm md:text-xxs ${textColor}`}>
      <Link to='/' className='hover:underline'>首頁</Link>
      <span>{'>'}</span>
      <span>{text}</span>
    </p>
  )
}

export default Breadcrumb;
