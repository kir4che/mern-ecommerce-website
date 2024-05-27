import { Disclosure } from '@headlessui/react';
import Breadcrumb from '../../components/molecules/Breadcrumb';
import Layout from '../../layouts/AppLayout';

const FAQ = () => {
  const faqItems = [
    { id: 1, question: '如何訂購麵包？', answer: '您可以在我們的官方網站或門市直接購買麵包。線上訂購可享有特別優惠！' },
    { id: 2, question: '配送選項有哪些？', answer: '我們提供宅配和自取兩種選項，配送範圍涵蓋全台灣。具體詳情可於結帳時選擇。' },
    { id: 3, question: '是否有提供素食者或特殊飲食需求的麵包？', answer: '是的，我們提供多樣化的選擇，包括素食麵包和無麩質麵包，以滿足不同飲食需求的顧客。' },
    { id: 4, question: '如何加入日出麵包坊的會員計畫？', answer: '加入我們的會員計畫非常簡單，您只需要到店內櫃檯填寫申請表格，即可享有會員專屬優惠和活動通知。' },
    { id: 5, question: '是否接受活動訂製或大量訂購？', answer: '是的，我們樂意接受各類活動訂製和大量訂購，請提前與我們的客服聯絡，我們將提供最合適的方案滿足您的需求。' },
  ];

  return (
    <Layout>
      <section className='px-8 pt-3 h-36 md:min-h-32 md:h-[9.6vw] bg-primary'>
        <Breadcrumb text='最新消息' textColor='text-secondary' />
        <h1 className="flex flex-col items-center mx-auto md:gap-2 w-fit text-secondary">
          <span className='md:text-base font-light text-1.5xl'>FAQ</span>
          <span className='text-4xl md:text-xl'>常見問題</span>
        </h1>
      </section>
      <div className="faq__item">
        {faqItems.map((item) => (
          <Disclosure key={item.id}>
            {({ open }) => (
              <div className='space-y-4'>
                <Disclosure.Button className="faq__item__question">
                  <h2 className="text-base">{item.question}</h2>
                  <span className={open ? 'transform rotate-180' : 'transform rotate-0'}>▼</span>
                </Disclosure.Button>
                <Disclosure.Panel className='faq__item__answer'>{item.answer}</Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </Layout>
  );
};

export default FAQ;
