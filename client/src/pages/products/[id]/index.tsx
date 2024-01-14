import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Error from '../../../components/Error/Error';
import RecommendProducts from '../../../components/Home/Recommend/Products/Products';
import Layout from '../../../components/Layout/Layout';
import Loading from '../../../components/Loading/Loading';
import { useCart } from '../../../hooks/useCart';
import useGetData from '../../../hooks/useGetData';

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useCart()
  const { data, loading, error } = useGetData(`/products/${id}`)
  const product = data?.product

  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (product) => {
    addToCart({
      productId: product._id,
      quantity: quantity || 1
    });
    setQuantity(1)
  }

  if (loading) return <Loading />
  else if (!loading && !product) return <Error message={[error]} />

  return (
    <Layout>
      <section className='flex flex-col justify-between gap-5 xl:gap-0 md:flex-row pb-14'>
        <div className='md:max-w-[50%]'>
          <img src={product.imageUrl} alt={product.title} className='object-cover object-center h-full md:min-h-screenwithh' />
        </div>
        <div className="px-[5vw] md:px-0 mx-auto md:pt-20 md:max-w-lg">
          <p className="text-xs">{product.tagline}</p>
          <h1 className="mb-6 text-2xl font-medium">{product.title}</h1>
          <div className="flex gap-1.5">
            {product.categories.map((category, index) => <p className="px-3 py-0.75 text-sm font-medium bg-secondary border rounded-full w-fit sm:text-xs border-primary" key={index}>#{category}</p>)}
          </div>
          <p className='pt-6 pb-4 my-5 text-xs border-t-[1.25px] border-gray-300 border-dashed'>{product.description}</p>
          <div className="flex justify-between pb-6 border-b-2 border-gray-400 border-dashed sm:items-center">
            <p className="text-3xl sm:text-2xl">NT${product.price}</p>
            <div className='flex items-center gap-2.5'>
              <div className="flex items-center justify-between gap-3">
                <label className="pr-2 text-sm border-r border-gray-300 min-w-fit sm:text-xs">數量</label>
                <input type="number" name="quantity" id="quantity" className="text-base outline-none sm:text-sm" min={1} max={product.countInStock} value={quantity} defaultValue={1} onChange={(e) => setQuantity(Number(e.target.value))} />
              </div>
              <button className="px-4 py-2 text-sm duration-500 border rounded-full md:px-6 border-primary hover:text-primary hover:bg-secondary text-secondary bg-primary" onClick={() => handleAddToCart(product)}>
                加入購物車
              </button>
            </div>
          </div>
          <div className="space-y-2.5 border-b border-gray-400 pt-7 pb-10 text-xxs">
            <p className='space-x-5 md:space-x-3'>
              <span className='inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-20 bg-gray-200'>內容</span>
              <span>{product.content}</span>
            </p>
            <p className='space-x-5 md:space-x-3'>
              <span className='inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-20 bg-gray-200'>保存期限</span>
              <span>{product.expiryDate}</span>
            </p>
            <p className='space-x-5 md:space-x-3'>
              <span className='inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-20 bg-gray-200'>過敏原標示</span>
              <span>{product.allergens.map(allergen => <span className="product__info__first-content">{allergen}、</span>)}</span>
            </p>
            <p className='space-x-5 md:space-x-3'>
              <span className='inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-20 bg-gray-200'>配送方法</span>
              <span>{product.delivery}</span>
            </p>
            <p className='space-x-5 md:space-x-3'>
              <span className='inline-block py-1 md:py-0.5 text-center rounded min-w-24 md:min-w-20 bg-gray-200'>保存方法</span>
              <span>{product.storage}</span>
            </p>
          </div>
          <div>
            <details className="py-5 text-xs border-b border-gray-400 group" open>
              <summary className="flex items-center justify-between cursor-pointer">
                <p className='font-medium'>原材料</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" fill="none" className="block group-open:rotate-180" viewBox="0 0 16 9">
                  <path fill="#081122" d="M.358.353a.5.5 0 0 1 .707 0l6.56 6.56 6.561-6.56a.5.5 0 1 1 .707.708L7.626 8.328.358 1.061a.5.5 0 0 1 0-.708Z" clip-rule="evenodd"></path>
                </svg>
              </summary>
              <p className="border-t-[1.25px] pt-4 mt-4 border-gray-300 border-dashed">{product.ingredients}</p>
            </details>
            <details className="py-5 text-xs border-b border-gray-400 group" open>
              <summary className="flex items-center justify-between cursor-pointer">
                <p className='font-medium'>營養成分表示</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" fill="none" className="block group-open:rotate-180" viewBox="0 0 16 9">
                  <path fill="#081122" d="M.358.353a.5.5 0 0 1 .707 0l6.56 6.56 6.561-6.56a.5.5 0 1 1 .707.708L7.626 8.328.358 1.061a.5.5 0 0 1 0-.708Z" clip-rule="evenodd"></path>
                </svg>
              </summary>
              <p className="border-t-[1.25px] pt-4 mt-4 border-gray-300 border-dashed">{product.nutrition}</p>
            </details>
          </div>
        </div>
      </section>
      <section>
        <h2 className="flex flex-col max-w-6xl mx-auto items-center border-y-[3.2px] py-6 border-primary">
          <span className='text-1.5xl font-medium'>您可能也會喜歡</span>
          <span>Recommend</span>
        </h2>
        <div className='py-16 px-[5vw] sm:px-0'>
          <RecommendProducts />
        </div>
      </section>
    </Layout>
  );
}

export default Product;