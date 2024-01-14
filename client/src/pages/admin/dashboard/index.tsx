import { Dialog } from '@headlessui/react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '../../../components/Error/Error';
import Layout from '../../../components/Layout/Layout';
import Loading from '../../../components/Loading/Loading';
import useGetData from '../../../hooks/useGetData';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = Cookies.get('role')
  const { data: productsData, loading: productLoading, error: productError } = useGetData('/products')
  const { data: postsData, loading: postLoading, error: postError } = useGetData('/posts')
  const { data: ordersData, loading: orderLoading, error: orderError } = useGetData('/orders')
  const products = productsData?.products
  const posts = postsData?.posts
  const orders = ordersData?.orders

  const [isAddOrEditProductForm, setIsAddOrEditProductForm] = useState('')
  const [isAddOrEditPostForm, setIsAddOrEditPostForm] = useState('')
  const [productForm, setProductForm] = useState({
    _id: '',
    title: '',
    tagline: '',
    categories: [],
    description: '',
    price: 0,
    content: '',
    expiryDate: '',
    allergens: [],
    delivery: '',
    storage: '',
    ingredients: '',
    nutrition: '',
    countInStock: 0,
    imageUrl: '',
    updatedAt: ''
  })
  const [postForm, setPostForm] = useState({
    _id: '',
    title: '',
    category: '',
    date: '',
    content: '',
    imageUrl: '',
    updatedAt: ''
  })

  useEffect(() => {
    if (role.includes('user')) navigate('/')
  }, [role])

  if (productLoading || postLoading || orderLoading) return <Loading />
  else if ((!productLoading && !products) || (!postLoading && !posts) || (!orderLoading && !orders)) return <Error message={[productError, postError, orderError]} />

  const handleFormOpen = (item, data) => {
    if (item === 'products') {
      setIsAddOrEditProductForm(data.title === '' ? 'add' : 'edit')
      setProductForm(data)
    } else {
      setIsAddOrEditPostForm(data.title === '' ? 'add' : 'edit')
      setPostForm(data)
    }
  }

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    let updatedValue: string | number = value;

    if (name === 'price' || name === 'countInStock') updatedValue = parseInt(value)
    if (name === 'allergens' && typeof updatedValue === 'string') setProductForm({ ...productForm, allergens: updatedValue.split(',') });
    else if (name === 'categories') setProductForm({ ...productForm, categories: [updatedValue] });
    else setProductForm({ ...productForm, [name]: updatedValue });
  }

  const handlePostFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPostForm({ ...postForm, [name]: value });
  }

  const handleFormUpdate = async (item: string, todo: string) => {
    if (todo === 'add') {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/${item}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`
          },
          credentials: "include",
          body: JSON.stringify(item === 'products' ? {
            title: productForm.title,
            tagline: productForm.tagline,
            categories: productForm.categories,
            description: productForm.description,
            price: productForm.price,
            content: productForm.content,
            expiryDate: productForm.expiryDate,
            allergens: productForm.allergens,
            delivery: productForm.delivery,
            storage: productForm.storage,
            ingredients: productForm.ingredients,
            nutrition: productForm.nutrition,
            countInStock: productForm.countInStock,
            imageUrl: productForm.imageUrl,
          } : {
            title: postForm.title,
            category: postForm.category,
            date: postForm.date,
            content: postForm.content,
            imageUrl: postForm.imageUrl,
          })
        })
        if (res.ok) {
          if (item === 'products') setIsAddOrEditProductForm('')
          else setIsAddOrEditPostForm('')
        }
      } catch (error) {
        console.error(error.message)
      }
    } else if (todo === 'edit') {
      if (item === 'products') setProductForm({ ...productForm, updatedAt: new Date().toISOString() })
      else setPostForm({ ...postForm, updatedAt: new Date().toISOString() })
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/${item}/${item === 'products' ? productForm._id : postForm._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`
          },
          credentials: "include",
          body: JSON.stringify(item === 'products' ? productForm : postForm)
        })
        if (res.ok) {
          if (item === 'products') setIsAddOrEditProductForm('')
          else setIsAddOrEditPostForm('')
        }
      } catch (error) {
        console.error(error.message)
      }
    }
    navigate(0)
  }

  const handleDelete = async (item, id) => {
    window.confirm("確定要刪除嗎？") && deleteItem(item, id)
  }

  const deleteItem = async (item, id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/${item}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`
        },
        credentials: "include",
      })
      if (res.ok) {
        alert("刪除成功！")
        navigate(0) // 重新整理頁面
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  // 暫時不處理實際出貨流程
  const handleDeliver = async (id) => {
    // 更新訂單狀態
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
          status: '已出貨',
          shippingStatus: '運送中'
        })
      });
      if (res.ok) {
        alert('出貨成功！');
        navigate(0);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  }

  return (
    <Layout>
      {
        role.includes('admin') &&
        <div className='px-[5vw]'>
          <section className='flex items-baseline justify-between py-4 mb-4 border-b border-gray-400'>
            <h1 className='w-full text-lg'>管理員後台</h1>
          </section>
          <div className='flex flex-col w-full gap-8 sm:flex-row'>
            <section className='flex-1'>
              <h3 className="mb-2 text-base font-medium">商品管理</h3>
              <ul className='p-3 overflow-y-auto border shadow max-h-80'>
                {products.map((product) => (
                  <li className='flex items-center justify-between py-3 text-xs border-b border-gray-300 border-dashed cursor-pointer' key={product._id}>
                    <p className='hover:opacity-80'>{product.title}</p>
                    <div className='space-x-4'>
                      <button className='hover:opacity-60' onClick={() => handleFormOpen('products', product)}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50">
                          <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                        </svg>
                      </button>
                      <Dialog open={isAddOrEditProductForm === 'edit' || isAddOrEditProductForm === 'add'} className="relative z-50" onClose={() => { }}>
                        <div className="fixed inset-0 flex items-center justify-center w-screen bg-primary/5">
                          <Dialog.Panel className='max-w-md p-4 overflow-y-auto bg-white rounded-md max-h-[75%]'>
                            <Dialog.Title className='flex items-center justify-between pb-2 border-b border-gray-300'>
                              編輯商品資訊
                              <button className='hover:opacity-60' onClick={() => setIsAddOrEditProductForm('')} >
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24">
                                  <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                                </svg>
                              </button>
                            </Dialog.Title>
                            <Dialog.Description className='py-4 space-y-2 text-sm'>
                              <div className='flex gap-4'>
                                <label className='block w-2/3'>
                                  標題
                                  <input
                                    type="text"
                                    name="title"
                                    value={productForm.title}
                                    onChange={handleProductFormChange}
                                    autoFocus
                                  />
                                </label>
                                <label className='block w-1/3'>
                                  分類
                                  <select
                                    name="categories"
                                    value={productForm.categories}
                                    className='px-1 min-h-[2.5rem]'
                                    onChange={handleProductFormChange}
                                  >
                                    <option value="麵包">麵包</option>
                                    <option value="蛋糕">蛋糕</option>
                                    <option value="甜點">餅乾</option>
                                    <option value="飲品">其他</option>
                                  </select>
                                </label>
                              </div>
                              <div className='flex gap-4'>
                                <label className='flex-1 block'>
                                  價格
                                  <input
                                    type="number"
                                    name="price"
                                    value={productForm.price}
                                    onChange={handleProductFormChange}
                                  />
                                </label>
                                <label className='flex-1 block'>
                                  庫存數量
                                  <input
                                    type="number"
                                    name="countInStock"
                                    value={productForm.countInStock}
                                    onChange={handleProductFormChange}
                                  />
                                </label>
                              </div>
                              <label className='block'>
                                標語
                                <input
                                  type="text"
                                  name="tagline"
                                  value={productForm.tagline}
                                  onChange={handleProductFormChange}
                                />
                              </label>
                              <label className='block'>
                                簡介
                                <textarea
                                  name="description"
                                  value={productForm.description}
                                  rows={4}
                                  onChange={handleProductFormChange}
                                />
                              </label>
                              <div className='flex gap-4'>
                                <label className='block'>
                                  內容物
                                  <input
                                    type="text"
                                    name="content"
                                    value={productForm.content}
                                    onChange={handleProductFormChange}
                                  />
                                </label>
                                <label className='block'>
                                  過敏原
                                  <span className='text-xs font-light text-gray-600'> (請用半形逗號隔開)</span>
                                  <input
                                    type="text"
                                    name="allergens"
                                    value={productForm.allergens}
                                    onChange={handleProductFormChange}
                                    placeholder='小麥,乳製品,蛋'
                                  />
                                </label>
                              </div>
                              <label className='block'>
                                成分
                                <input
                                  type="text"
                                  name="ingredients"
                                  value={productForm.ingredients}
                                  onChange={handleProductFormChange}
                                  placeholder='小麥粉、牛奶、無鹽奶油、蛋...'
                                />
                              </label>
                              <label className='block'>
                                營養成分
                                <input
                                  type="text"
                                  name="nutrition"
                                  value={productForm.nutrition}
                                  onChange={handleProductFormChange}
                                  placeholder='（每100g）能量180kcal，蛋白質5.0g，脂肪2.5g，碳水化合物35.0g，食鹽相當量0.5g'
                                />
                              </label>
                              <label className='block'>
                                運送方式
                                <select
                                  name="delivery"
                                  value={productForm.delivery}
                                  className='px-1'
                                  onChange={handleProductFormChange}
                                >
                                  <option value="常溫宅配">常溫宅配</option>
                                  <option value="低溫宅配">低溫宅配</option>
                                </select>
                              </label>
                              <label className='block'>
                                有效期限
                                <input
                                  type="text"
                                  name="expiryDate"
                                  value={productForm.expiryDate}
                                  onChange={handleProductFormChange}
                                  placeholder='常溫保存3天，冷藏可延長效期約5天。'
                                />
                              </label>
                              <label className='block'>
                                保存方式
                                <select
                                  name="storage"
                                  value={productForm.storage}
                                  className='px-1'
                                  onChange={handleProductFormChange}
                                >
                                  <option value="請保存於陰涼處，避免高溫或陽光照射。">請保存於陰涼處，避免高溫或陽光照射。</option>
                                  <option value="請保存於陰涼處，避免高溫或陽光照射，亦可冷藏保存。">請保存於陰涼處，避免高溫或陽光照射，亦可冷藏保存。</option>
                                </select>
                              </label>
                              <label className='block'>
                                圖片網址
                                <input
                                  type="text"
                                  name="imageUrl"
                                  value={productForm.imageUrl}
                                  onChange={handleProductFormChange}
                                  placeholder='http://xxx.jpg'
                                />
                              </label>
                            </Dialog.Description>
                            <div className='ml-auto text-sm w-fit'>
                              <button className='px-2 py-1 rounded-md hover:bg-gray-100' onClick={() => handleFormUpdate('products', 'edit')}>確定變更</button>
                              <button className='px-2 py-1 rounded-md hover:bg-gray-100' onClick={() => setIsAddOrEditProductForm('')}>取消</button>
                            </div>
                          </Dialog.Panel>
                        </div>
                      </Dialog>
                      <button className='hover:opacity-60' onClick={() => handleDelete('products', product._id)} >
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24">
                          <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button className='block mt-3 ml-auto text-sm w-fit text-secondary hover:text-primary hover:bg-secondary border-primary bg-primary btn-primary' onClick={() => handleFormOpen('products', {
                title: '',
                tagline: '',
                categories: [],
                description: '',
                price: 0,
                content: '',
                expiryDate: '',
                allergens: [],
                delivery: '',
                storage: '',
                ingredients: '',
                nutrition: '',
                countInStock: 0,
                imageUrl: '',
              })}
              >新增商品</button>
            </section>
            <section className='flex-1'>
              <h3 className="mb-2 text-base font-medium">最新消息管理</h3>
              <ul className='p-4 overflow-y-auto border shadow max-h-80'>
                {posts.map((post) => (
                  <li className='flex items-center justify-between py-3 text-xs border-b border-gray-300 border-dashed cursor-pointer' key={post._id}>
                    <p className='hover:opacity-80'>{post.title}</p>
                    <div className='space-x-4'>
                      <button className='hover:opacity-60' onClick={() => handleFormOpen('posts', post)}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50">
                          <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                        </svg>
                      </button>
                      <Dialog open={isAddOrEditPostForm === 'edit' || isAddOrEditPostForm === 'add'} className="relative z-50" onClose={() => { }}>
                        <div className="fixed inset-0 flex items-center justify-center w-screen bg-primary/5">
                          <Dialog.Panel className='max-w-xl w-full min-w-[400px] p-4 overflow-y-auto bg-white rounded-md max-h-[75%]'>
                            <Dialog.Title className='flex items-center justify-between pb-2 border-b border-gray-300'>
                              編輯最新消息
                              <button className='hover:opacity-60' onClick={() => setIsAddOrEditPostForm('')}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24">
                                  <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                                </svg>
                              </button>
                            </Dialog.Title>
                            <Dialog.Description className='py-4 space-y-2 text-sm'>
                              <label className='block'>
                                標題
                                <input
                                  type="text"
                                  name="title"
                                  value={postForm.title}
                                  onChange={handlePostFormChange}
                                  autoFocus
                                />
                              </label>
                              <label className='block'>
                                分類
                                <input
                                  type="text"
                                  name="category"
                                  value={postForm.category}
                                  onChange={handlePostFormChange}
                                  placeholder='活動'
                                />
                              </label>
                              <label className='block'>
                                日期
                                <input
                                  type="text"
                                  name="date"
                                  value={postForm.date}
                                  onChange={handlePostFormChange}
                                  placeholder='2024/01/01'
                                />
                              </label>
                              <label className='block'>
                                內容
                                <textarea
                                  name="content"
                                  value={postForm.content}
                                  rows={12}
                                  onChange={handlePostFormChange}
                                />
                              </label>
                              <label className='block'>
                                圖片網址
                                <input
                                  type="text"
                                  name="imageUrl"
                                  value={postForm.imageUrl}
                                  onChange={handlePostFormChange}
                                  placeholder='http://xxx.jpg'
                                />
                              </label>
                            </Dialog.Description>
                            <div className='ml-auto text-sm w-fit'>
                              <button className='px-2 py-1 rounded-md hover:bg-gray-100' onClick={() => handleFormUpdate('posts', isAddOrEditPostForm)}>確定變更</button>
                              <button className='px-2 py-1 rounded-md hover:bg-gray-100' onClick={() => setIsAddOrEditPostForm('')}>取消</button>
                            </div>
                          </Dialog.Panel>
                        </div>
                      </Dialog>
                      <button className='hover:opacity-60' onClick={() => handleDelete('posts', post._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24">
                          <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button className='block mt-3 ml-auto text-sm w-fit text-secondary hover:text-primary hover:bg-secondary border-primary bg-primary btn-primary' onClick={() => handleFormOpen('posts', {
                title: '',
                category: '',
                date: '',
                content: '',
                imageUrl: '',
              })}>新增消息</button>
            </section>
          </div>
          <div className='w-full'>
            <h3 className="mb-2 text-base font-medium">訂單管理</h3>
            <ul className='p-3 overflow-y-auto border shadow max-h-80'>
              <div className='p-2 space-y-4 overflow-x-auto'>
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
                {ordersData ? (
                  <ul className='space-y-2'>
                    {ordersData.orders.map((order, index) => (
                      <li className='flex text-sm'>
                        <p className='min-w-20'>{index + 1}</p>
                        <p className='min-w-20'>{order.status}</p>
                        <p className='min-w-20'>{order.shippingStatus}</p>
                        <p className='min-w-20'>{order.paymentStatus}</p>
                        <p className='min-w-20'>{order.totalAmount.toLocaleString()}</p>
                        <p className='min-w-fit'>{new Date(order.createdAt).toLocaleString()}</p>
                        <button className={`${order.status !== '已付款' ? 'opacity-50' : 'hover:bg-zinc-100'} px-1 ml-auto py-0.5 text-xs`} onClick={() => handleDeliver(order._id)} disabled={order.status !== '已付款'}>進行出貨</button>
                      </li>
                    ))}
                  </ul>
                ) : <p className='text-sm'>尚未有訂單。</p>
                }
              </div>
            </ul>
          </div>
        </div>
      }
    </Layout>
  )
}

export default Dashboard
