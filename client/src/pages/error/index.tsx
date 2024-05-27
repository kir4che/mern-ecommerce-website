import { useNavigate } from 'react-router-dom';
import Layout from '../../layouts/AppLayout';

const Error = ({ message = {} }) => {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className='flex items-center justify-center min-h-screenwithhf'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <h1 className='text-4xl font-medium'>404</h1>
          <p className='text-xl'>找不到頁面</p>
          <button className='px-5 py-1.5 text-sm duration-500 border rounded-full border-primary hover:text-primary hover:bg-secondary text-secondary bg-primary' onClick={() => navigate('/')}>回首頁</button>
        </div>
      </section>
    </Layout>
  )
}

export default Error;