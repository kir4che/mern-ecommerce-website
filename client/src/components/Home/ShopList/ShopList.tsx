import shop1 from '../../../assets/images/shops/shop1.jpg';
import shop2 from '../../../assets/images/shops/shop2.jpg';

const ShopList = () => {
  return (
    <section className='pt-16 overflow-hidden'>
      <h1 className=' px-[2.5vw] md:px-0 text-2xl md:text-lg font-normal border-t border-primary/30 mx-[2.5vw] pt-2 space-x-2'>
        <span>Shop List</span>
        <span className='text-base font-medium md:text-xxs'>/ 店家一覽</span>
      </h1>
      <div className='px-[5vw] py-6 md:flex-row gap-12 md:gap-0 flex-col flex justify-between'>
        <div>
          <img src={shop1} className='object-cover w-full md:w-[43vw] mb-4 rounded h-max max-h-[45vw] md:max-h-[24vw]' alt='shop1' />
          <div className='flex items-baseline gap-1.5'>
            <p className='text-3xl font-medium md:text-base'>日出本店</p>
            <p className='text-lg font-light md:text-xs'>Sunrise</p>
          </div>
          <div className='mt-6 md:mt-4 space-y-2.5 md:space-y-1.5 text-base md:text-xxs'>
            <p className='space-x-5 md:space-x-3'>
              <span className='inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-14 bg-gray-200'>地址</span>
              <span className='font-medium'>
                <a href='https://maps.app.goo.gl/qNLAEC3tF2YbEG5v6' target='_blank' rel='noreferrer' className='hover:underline'>
                  104 臺北市中山區民生西路 30 號 1 樓
                </a>
              </span>
            </p>
            <p className='space-x-5 md:space-x-3'>
              <span className='inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-14 bg-gray-200'>營業時間</span>
              <span className='font-medium'>週一至週日 11:00 - 21:00</span>
            </p>
            <p className='space-x-5 md:space-x-3'>
              <span className='inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-14 bg-gray-200'>電話</span>
              <span className='font-medium'>02-2517-7189</span>
            </p>
            <p className='space-x-5 md:space-x-3'>
              <span className='inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-14 bg-gray-200'>交通方式</span>
              <span className='font-medium'>雙連站1號出口步行約 2 分鐘</span>
            </p>
          </div>
        </div>
        <div>
          <img src={shop2} className='object-cover w-full md:w-[43vw] mb-4 rounded h-max max-h-[45vw] md:max-h-[24vw]' alt='shop2' />
          <div className='space-y-2'>
            <p className='text-3xl font-medium md:text-base'>日出二店</p>
            <p className='text-base md:text-xs'>即將開幕</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShopList;