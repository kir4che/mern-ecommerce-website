import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import Error from '../../../components/Error/Error';
import Layout from "../../../components/Layout/Layout";
import Loading from '../../../components/Loading/Loading';
import useGetData from '../../../hooks/useGetData';
import { useCart } from '../../../hooks/useCart';

const categories = [
  {
    label: '所有商品',
    link: 'all'
  },
  {
    label: '推薦',
    link: 'recommend'
  },
  {
    label: '熱銷',
    link: 'hot'
  },
  {
    label: '麵包',
    link: 'bread'
  },
  {
    label: '蛋糕',
    link: 'cake'
  },
  {
    label: '餅乾',
    link: 'cookie'
  },
  {
    label: '其他',
    link: 'other'
  }
]

const Collections = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { addToCart } = useCart()
  const { data, loading, error } = useGetData('/products')
  const products = data?.products

  const [productsByCategory, setProductsByCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')

  const handleCategorySelect = (link: string) => {
    setSelectedCategory(link);
    navigate(`/collections/${link}`);
  }

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
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [product._id]: 1
    }));
  }

  useEffect(() => {
    setSelectedCategory(category || 'all')
  }, [category])

  useEffect(() => {
    if (!products) return;
    switch (category) {
      case 'all':
        setProductsByCategory(products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        break;
      case 'recommend':
        setProductsByCategory(products.slice(0, 5).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        break;
      case 'hot':
        setProductsByCategory(products.sort((a, b) => b.salesCount - a.salesCount).slice(0, 10))
        break;
      case 'bread':
      case 'cake':
      case 'cookie':
      case 'other':
        setProductsByCategory(products.filter(item => item.categories.includes(
          category === 'bread' ? '麵包' : category === 'cake' ? '蛋糕' : category === 'cookie' ? '餅乾' : '其他'
        )).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        break;
      default:
        setProductsByCategory(products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        break;
    }
  }, [products, category])


  if (loading) return <Loading />
  else if (!loading && !products) return <Error message={[error]} />

  return (
    <Layout>
      <section className='px-8 pt-3 h-36 md:min-h-32 md:h-[9.6vw] bg-primary'>
        <Breadcrumb text='商品' textColor='text-secondary' />
        <h1 className="flex flex-col items-center mx-auto md:gap-2 w-fit text-secondary">
          <span className='md:text-base font-light text-1.5xl'>Collections</span>
          <span className='text-4xl md:text-xl'>商品一覽</span>
        </h1>
      </section>
      <section className="px-[5vw] py-8">
        <div className="flex justify-center gap-4 overflow-x-auto pb-7">
          {categories.map((category) => (
            <button className={`${selectedCategory === category.link ? "border-primary bg-primary text-secondary" : "border-primary/80 text-primary/60 bg-secondary"} px-6 py-2 min-w-fit text-sm border border-dashed rounded-full`} onClick={() => handleCategorySelect(category.link)} key={category.link}>
              {category.label}
            </button>
          ))}
        </div>
        <hr className='max-w-2xl mx-auto' />
        <div className='grid w-full grid-cols-1 py-10 gap-y-10 sm:gap-y-12 gap-x-8 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {
            productsByCategory.map((product) => (
              <div className="product__item">
                <Link to={`/products/${product._id}`} className="block -mb-4 product__item__img">
                  <img src={product.imageUrl} height="280px" width="280px" alt={product.title} loading="lazy" />
                  <div className='hidden product__item__img-cover'>
                    <p className="absolute z-10 font-light underline -translate-x-1/2 -translate-y-1/2 text-secondary top-1/2 left-1/2">查看更多</p>
                    <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full overflow-hidden bg-fixed rounded-full bg-primary/50" />
                  </div>
                </Link>
                <div className='product__item__info'>
                  <h3 className="relative z-10 px-2 mb-2 text-base sm:-mb-2 w-fit bg-primary text-secondary">{product.title}</h3>
                  <div className="mb-2 sm:-mb-2">
                    {product.categories.map((category, index) => <p className="py-1 px-2.5 border sm:border-[0.875px] w-fit font-medium rounded-full text-xs sm:text-xxs bg-secondary border-primary" key={index}>#{category}</p>)}
                    <div className="flex items-center gap-2 ml-auto w-fit">
                      <label className="w-full pr-3 text-sm border-r border-gray-300 sm:pr-1 sm:text-xs">數量</label>
                      <input type="number" name="quantity" id="quantity" className="py-1 pl-1.5 pr-0 min-w-14 sm:min-w-12 sm:text-xs" min={1} max={product.countInStock} value={quantities[product._id]} defaultValue={1} onChange={(e) => handleQuantityChange(product._id, Number(e.target.value))} />
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='text-sm sm:text-xxs min-w-fit'>
                      <p className="text-3xl sm:text-xl">NT${product.price}</p>
                    </div>
                    <button className="px-3 py-2 text-sm duration-500 border rounded-full border-primary hover:text-primary hover:bg-secondary text-secondary sm:py-1 sm:px-5 sm:text-xs bg-primary" onClick={() => handleAddToCart(product)}>
                      加入購物車
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </section>
    </Layout >
  )
}

export default Collections