import { Link, useNavigate } from 'react-router-dom';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useCart } from '../../../../hooks/useCart';
import useGetData from '../../../../hooks/useGetData';
import { useState } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';

const RecommendProducts = () => {
  const { addToCart } = useCart()
  const { data } = useGetData('/products')
  const products = data?.products

  const [quantities, setQuantities] = useState({})

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: newQuantity
    }));
  };

  const handleAddToCart = (product) => {
    addToCart({
      productId: product._id,
      quantity: quantities[product._id] || 1
    });
    setTimeout(() => {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [product._id]: 1
      })
      )
    }, 500);
  }

  return (
    <Swiper
      slidesPerView={5}
      centeredSlides
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop
      loopAdditionalSlides={3}
      navigation
      cssMode
      style={{
        '--swiper-navigation-color': '#061222',
        '--swiper-navigation-size': '2rem',
      }}
      modules={[Autoplay, Navigation]}
      breakpoints={{
        0: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        652: {
          slidesPerView: 2.15,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 2.5,
          spaceBetween: 0,
        },
        1024: {
          slidesPerView: 3.2,
          spaceBetween: 20,
        },
        1280: {
          slidesPerView: 3.6,
          spaceBetween: 40,
        },
      }}
    >
      {products && products.slice(0, 5).map((product) => (
        <SwiperSlide key={product.title}>
          <div className="recommend__item">
            <h3 className="space-y-0.5 px-2 w-fit bg-primary sm:text-lg z-10 relative mb-2.5 text-secondary">{product.title}</h3>
            <div className="flex z-10 relative gap-1.5">
              {product.categories.map((category, index) => <p className="px-3 py-1 sm:py-0 sm:px-2 border sm:border-[0.875px] w-fit font-medium rounded-full text-sm sm:text-xxs bg-secondary border-primary" key={index}>#{category}</p>)}
            </div>
            <Link to={`/products/${product._id}`} className="block mb-4 -mt-12 recommend__item__img">
              <img src={product.imageUrl} height="360px" width="360px" alt={product.title} loading="lazy" />
              <div className='hidden recommend__item__img-cover'>
                <p className="absolute z-10 font-light underline -translate-x-1/2 -translate-y-1/2 text-secondary top-1/2 left-1/2">查看更多</p>
                <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full overflow-hidden bg-fixed rounded-full bg-primary/50" />
              </div>
            </Link>
            <div className='recommend__item__info'>
              <div className="flex justify-between sm:items-center">
                <p className="text-3xl sm:text-xl">NT${product.price}</p>
                <div className='flex flex-col items-center gap-2 md:flex-row'>
                  <div className="flex items-center justify-between gap-2">
                    <label className="w-full pr-3 text-sm border-r border-gray-300 sm:pr-1 sm:text-xs">數量</label>
                    <input type="number" name="quantity" id="quantity" className="py-1 pl-1.5 pr-0 min-w-14 sm:min-w-12 sm:text-xs" min={1} max={product.countInStock} value={quantities[product._id]} defaultValue={1} onChange={(e) => handleQuantityChange(product._id, Number(e.target.value))} />
                  </div>
                  <button className="px-5 py-2 text-sm duration-500 border rounded-full border-primary hover:text-primary hover:bg-secondary text-secondary sm:py-1 sm:px-2 sm:text-xs bg-primary" onClick={() => handleAddToCart(product)}>
                    加入購物車
                  </button>
                </div>
              </div>
              <div className='justify-between gap-14 sm:flex'>
                <div className='mb-5 -mt-8 text-sm sm:mb-0 sm:mt-0 sm:text-xxs min-w-fit'>
                  <p className="mb-3 text-gray-600 sm:mb-1">過敏原標示</p>
                  <p className="font-medium leading-6 sm:leading-5">
                    {product.allergens.map((allergen, index) => <span key={index} className='block'>{allergen}</span>)}
                  </p>
                </div>
                <p className="text-sm leading-6 line-clamp-5 sm:leading-5 sm:text-xxs">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper >
  );
}

export default RecommendProducts;