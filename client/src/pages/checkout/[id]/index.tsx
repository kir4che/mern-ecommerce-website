import { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import useGetData from '../../../hooks/useGetData';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/Loading/Loading';
import Cookies from 'js-cookie';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useGetData(`/orders/${id}`, Cookies.get('token'));
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardDate: '',
    cardCode: '',
    cardName: ''
  });

  if (loading) return <Loading />
  else if (!loading && !data) navigate('/cart');

  // 暫時不串接金流，直接設定付款成功
  const handlePay = async () => {
    if (!paymentMethod) return alert('請選擇付款方式');
    else if (!paymentForm.cardNumber) return alert('請輸入卡號');
    else if (!paymentForm.cardDate) return alert('請輸入卡片有效年月');
    else if (!paymentForm.cardCode) return alert('請輸入CVV/CVC');
    else if (!paymentForm.cardName) return alert('請輸入持卡人姓名');

    // 更新訂單狀態
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
          status: '已付款',
          paymentStatus: '已付款'
        })
      });
      if (res.ok) {
        alert('付款成功！');
        setPaymentMethod('');
        setPaymentForm({
          cardNumber: '',
          cardDate: '',
          cardCode: '',
          cardName: ''
        });
        navigate(`/`);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  }

  return (
    <Layout>
      <section className='px-[5vw] p-10'>
        <h3 className="pb-2 mb-4 text-base border-b border-zinc-300">付款方式</h3>
        <div className='space-y-3 text-sm'>
          <button className={`${paymentMethod === '信用卡' ? 'border-primary' : ''} flex bg-white items-center gap-2 p-4 border-2 rounded-lg`} onClick={() => setPaymentMethod('信用卡')}>
            {paymentMethod === '信用卡' ? <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/ok--v1.png" alt="checked" /> : <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/circled.png" alt="unchecked" />}
            <div className='flex items-center gap-1'>
              <img width="36" height="36" src="https://img.icons8.com/ios/50/bank-card-back-side--v1.png" alt="credit-card" />
              <p>
                <span>信用卡</span>
                <span className='ml-2 text-xs text-zinc-500'>(VISA、MasterCard、JCB)</span>
              </p>
            </div>
          </button>
          <label className='block'>
            卡號
            <input
              type="text"
              name="cardNumber"
              value={paymentForm.cardNumber}
              minLength={16}
              maxLength={16}
              onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
              placeholder='**** **** **** ****'
            />
          </label>
          <div className='flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row'>
            <label className='flex-1 block'>
              卡片有效年月
              <input
                type="text"
                name="cardDate"
                value={paymentForm.cardDate}
                onChange={(e) => setPaymentForm({ ...paymentForm, cardDate: e.target.value })}
                placeholder='MM/YY'
              />
            </label>
            <label className='flex-1 block'>
              CVV/CVC
              <input
                type="text"
                name="cardCode"
                value={paymentForm.cardCode}
                minLength={3}
                maxLength={3}
                onChange={(e) => setPaymentForm({ ...paymentForm, cardCode: e.target.value })}
                placeholder='卡片背面檢查碼'
              />
            </label>
          </div>
          <label className='block'>
            持卡人姓名
            <input
              type="text"
              name="cardName"
              value={paymentForm.cardName}
              onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
            />
          </label>
        </div>
        <div className='flex justify-between w-full my-8'>
          <p>支付金額</p>
          <p className='text-2xl text-primary'>
            <span className='text-sm'>NT$ </span>
            <span className='font-medium'>{data?.order?.totalAmount.toLocaleString()}</span>
          </p>
        </div>
        <button className="w-full py-3 text-sm font-medium border-2 rounded border-primary hover:bg-secondary hover:text-primary text-secondary bg-primary" onClick={handlePay}>確認付款</button>
      </section>
    </Layout>
  )

}

export default Checkout;