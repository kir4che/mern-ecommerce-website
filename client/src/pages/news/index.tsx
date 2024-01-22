import { Link } from 'react-router-dom';
import Breadcrumb from "../../components/molecules/Breadcrumb";
import Error from '../error';
import Layout from "../../layouts/AppLayout";
import Loading from '../../components/Loading';
import useGetData from '../../hooks/useGetData';

const News = () => {
  const { data, loading, error } = useGetData('/posts')

  if (loading) return <Loading />
  else if (!loading && !data) return <Error message={[error]} />

  return (
    <Layout>
      <section className='px-8 pt-3 h-36 md:min-h-32 md:h-[9.6vw] bg-primary'>
        <Breadcrumb text='最新消息' textColor='text-secondary' />
        <h1 className="flex flex-col items-center mx-auto md:gap-2 w-fit text-secondary">
          <span className='md:text-base font-light text-1.5xl'>News</span>
          <span className='text-4xl md:text-xl'>最新消息列表</span>
        </h1>
      </section>
      <ul className="px-[5vw] py-12 w-full max-w-3xl md:py-20 mx-auto">
        {
          data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((post) => (
            <li key={post._id}>
              <Link to={`/blogs/news/${post._id}`} className='flex items-center gap-y-4 md:gap-y-0 py-4 border-b-[1.5px] md:border-b-[0.875px] border-dashed border-primary'>
                <div className='flex items-center gap-2 min-w-40 md:min-w-36 w-fit'>
                  <p className='w-[4.85rem] text-sm font-light md:w-16 md:text-xxs'>{post.date}</p>
                  <p className='px-3 py-1 text-sm font-light rounded-full min-w-fit text-secondary md:text-xxs bg-primary'>{post.category}</p>
                </div>
                <p className='inline-block w-full text-lg duration-500 ease-in-out md:text-sm md:inline hover:opacity-60'>{post.title}</p>
              </Link>
            </li>
          ))
        }
      </ul>
    </Layout >
  );
}

export default News;