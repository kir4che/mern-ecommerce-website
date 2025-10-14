import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../error';
import Layout from '../../layouts/AppLayout';
import Loading from '../../components/Loading';
import useGetData from '../../hooks/useGetData';

const UserProfile = () => {
  const navigate = useNavigate();
  const role = Cookies.get('role')

  useEffect(() => {
    if (role.includes('admin')) navigate('/')
  }, [role, navigate])

  const token = Cookies.get('token')
  const { data: userData, loading: userLoading, error: userError } = useGetData('/user', token)
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useGetData('/orders', token)
  const user = userData?.user
  const orders = ordersData?.orders

  if (userLoading || ordersLoading) return <Loading />
  else if ((!userLoading && !userData) || (!ordersLoading && !ordersData)) return <Error message={[userError, ordersError]} />

  // 暫時不處理實際完成訂單流程
  const handleComplete = async (id) => {
    // 更新訂單狀態
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({ status: '已完成' })
      });
      if (res.ok) navigate(0);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  return (
    <Layout>
      {role.includes('user') &&
        <div className="max-w-6xl space-y-10 px-[5vw] py-8 mx-auto">
          <h1>帳戶</h1>
          <div className='justify-between space-y-4 md:space-y-0 md:flex'>
            <div className='w-full max-w-2xl pb-4 space-y-4 overflow-x-auto'>
              <h2>訂單歷史</h2>
              <ul className='pb-3 border-b border-zinc-300'>
                <li className='flex text-xs'>
                  <p className='min-w-20'>訂單編號</p>
                  <p className='min-w-20'>訂單狀態</p>
                  <p className='min-w-20'>出貨狀態</p>
                  <p className='min-w-20'>付款狀態</p>
                  <p className='min-w-20'>總金額</p>
                  <p>成立日期</p>
                </li>
              </ul>
              {orders ? (
                <ul className='space-y-2'>
                  {orders.map((order, index) => (
                    <li className='flex text-sm'>
                      <p className='min-w-20'>{index + 1}</p>
                      <p className='min-w-20'>{order.status}</p>
                      <p className='min-w-20'>{order.shippingStatus}</p>
                      <p className='min-w-20'>{order.paymentStatus}</p>
                      <p className='min-w-20'>{order.totalAmount.toLocaleString()}</p>
                      <p className='min-w-fit'>{new Date(order.createdAt).toLocaleString()}</p>
                      <button className={`${order.shippingStatus !== '已送達' ? 'opacity-50' : 'hover:bg-zinc-100'} px-1 ml-auto py-0.5 text-xs`} onClick={() => handleComplete(order._id)} disabled={order.shippingStatus !== '已送達'}>完成訂單</button>
                    </li>
                  ))}
                </ul>
              ) : <p className='text-sm'>尚未有訂單。</p>
              }
            </div>
            {
              user && <div className='space-y-4'>
                <h2>詳細資訊</h2>
                <div className='space-y-2 text-sm'>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
              </div>
            }
          </div>
        </div>}
    </Layout >
  );
}

export default UserProfile;