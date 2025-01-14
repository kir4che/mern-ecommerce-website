import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetData } from "@/hooks/useGetData";

import { useAuth } from "@/context/AuthContext";
import { addComma } from "@/utils/addComma";

import Layout from "@/layouts/AppLayout";
import NotFound from "@/pages/notFound";
import ProductEditForm from "@/components/organisms/FormEditProduct";
import FormEditNew from "@/components/organisms/FormEditPost";
import Loading from "@/components/atoms/Loading";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: productsData,
    loading: productLoading,
    error: productError,
  } = useGetData("/products");
  const {
    data: newsData,
    loading: newLoading,
    error: newError,
  } = useGetData("/news");
  const {
    data: ordersData,
    loading: orderLoading,
    error: orderError,
  } = useGetData("/orders/admin");
  const products = productsData?.products;
  const news = newsData?.news;
  const orders = ordersData?.orders;

  const [isAddOrEditProductForm, setIsAddOrEditProductForm] = useState("");
  const [isAddOrEditNewForm, setIsAddOrEditNewForm] = useState("");
  const [productForm, setProductForm] = useState({
    _id: "",
    title: "",
    tagline: "",
    categories: [],
    description: "",
    price: 0,
    content: "",
    expiryDate: "",
    allergens: [],
    delivery: "",
    storage: "",
    ingredients: "",
    nutrition: "",
    countInStock: 0,
    imageUrl: "",
    updatedAt: "",
  });
  const [newForm, setNewForm] = useState({
    _id: "",
    title: "",
    category: "",
    date: "",
    content: "",
    imageUrl: "",
    updatedAt: "",
  });

  // useEffect(() => {
  //   if (role.includes('user')) navigate('/')
  // }, [role])

  if (productLoading || newLoading || orderLoading) return <Loading />;
  if (productError || newError || orderError)
    return <NotFound message={[productError, newError, orderError]} />;

  const handleFormUpdate = async (item: string, todo: string) => {
    if (todo === "add") {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/${item}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          credentials: "include",
          body: JSON.stringify(
            item === "products"
              ? {
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
                }
              : {
                  title: newForm.title,
                  category: newForm.category,
                  date: newForm.date,
                  content: newForm.content,
                  imageUrl: newForm.imageUrl,
                },
          ),
        });
        if (res.ok) {
          if (item === "products") setIsAddOrEditProductForm("");
          else setIsAddOrEditNewForm("");
        }
      } catch (error) {
        console.error(error.message);
      }
    } else if (todo === "edit") {
      if (item === "products")
        setProductForm({ ...productForm, updatedAt: new Date().toISOString() });
      else setNewForm({ ...newForm, updatedAt: new Date().toISOString() });
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/${item}/${item === "products" ? productForm._id : newForm._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            credentials: "include",
            body: JSON.stringify(item === "products" ? productForm : newForm),
          },
        );
        if (res.ok) {
          if (item === "products") setIsAddOrEditProductForm("");
          else setIsAddOrEditNewForm("");
        }
      } catch (error) {
        console.error(error.message);
      }
    }
    navigate(0);
  };

  const handleDelete = async (item, id) => {
    window.confirm("確定要刪除嗎？") && deleteItem(item, id);
  };

  const deleteItem = async (item, id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/${item}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          credentials: "include",
        },
      );
      if (res.ok) {
        alert("刪除成功！");
        navigate(0); // 重新整理頁面
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // 暫時不處理實際出貨流程
  const handleDeliver = async (id) => {
    // 更新訂單狀態
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          status: "已出貨",
          shippingStatus: "運送中",
        }),
      });
      if (res.ok) {
        alert("出貨成功！");
        navigate(0);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <Layout>
      {user.role === "admin" && (
        <div className="px-[5vw]">
          <section className="flex items-baseline justify-between py-4 mb-4 border-b border-gray-400">
            <h1 className="w-full text-lg">管理員後台</h1>
          </section>
          <div className="flex flex-col w-full gap-8 sm:flex-row">
            <section className="flex-1">
              <h3 className="mb-2 text-base font-medium">商品管理</h3>
              <ul className="p-3 overflow-y-auto border shadow max-h-80">
                {products.map((product) => (
                  <li
                    className="flex items-center justify-between py-3 text-sm border-b border-gray-300 border-dashed cursor-pointer"
                    key={product._id}
                  >
                    <p className="hover:opacity-80">{product.title}</p>
                    <div className="space-x-4">
                      <button
                        className="hover:opacity-60"
                        onClick={() => {
                          setProductForm(product);
                          setIsAddOrEditProductForm("edit");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="18"
                          height="18"
                          viewBox="0 0 50 50"
                        >
                          <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                        </svg>
                      </button>
                      <ProductEditForm
                        isAddOrEdit={isAddOrEditProductForm}
                        setIsAddOrEdit={setIsAddOrEditProductForm}
                        form={productForm}
                        setForm={setProductForm}
                        handleFormUpdate={handleFormUpdate}
                      />
                      <button
                        className="hover:opacity-60"
                        onClick={() => handleDelete("products", product._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                        >
                          <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="block mt-3 ml-auto text-sm w-fit text-secondary hover:text-primary hover:bg-secondary border-primary bg-primary btn-primary"
                onClick={() => {
                  setProductForm({
                    _id: "",
                    title: "",
                    tagline: "",
                    categories: [],
                    description: "",
                    price: 0,
                    content: "",
                    expiryDate: "",
                    allergens: [],
                    delivery: "",
                    storage: "",
                    ingredients: "",
                    nutrition: "",
                    countInStock: 0,
                    imageUrl: "",
                    updatedAt: "",
                  });
                  setIsAddOrEditProductForm("add");
                }}
              >
                新增商品
              </button>
            </section>
            <section className="flex-1">
              <h3 className="mb-2 text-base font-medium">最新消息管理</h3>
              <ul className="p-4 overflow-y-auto border shadow max-h-80">
                {news.map((newsItem) => (
                  <li
                    className="flex items-center justify-between py-3 text-sm border-b border-gray-300 border-dashed cursor-pointer"
                    key={newsItem._id}
                  >
                    <p className="hover:opacity-80">{newsItem.title}</p>
                    <div className="space-x-4">
                      <button
                        className="hover:opacity-60"
                        onClick={() => {
                          setNewForm(newsItem);
                          setIsAddOrEditNewForm("edit");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="18"
                          height="18"
                          viewBox="0 0 50 50"
                        >
                          <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                        </svg>
                      </button>
                      <FormEditNew
                        isAddOrEdit={isAddOrEditNewForm}
                        setIsAddOrEdit={setIsAddOrEditNewForm}
                        form={newForm}
                        setForm={setNewForm}
                        handleFormUpdate={handleFormUpdate}
                      />
                      <button
                        className="hover:opacity-60"
                        onClick={() => handleDelete("news", newsItem._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                        >
                          <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                className="block mt-3 ml-auto text-sm w-fit text-secondary hover:text-primary hover:bg-secondary border-primary bg-primary btn-primary"
                onClick={() => {
                  setNewForm({
                    _id: "",
                    title: "",
                    category: "",
                    date: "",
                    content: "",
                    imageUrl: "",
                    updatedAt: "",
                  });
                  setIsAddOrEditNewForm("add");
                }}
              >
                新增消息
              </button>
            </section>
          </div>
          <div className="w-full">
            <h3 className="mb-2 text-base font-medium">訂單管理</h3>
            <ul className="p-3 overflow-y-auto border shadow max-h-80">
              <div className="p-2 pb-4 space-y-4 overflow-x-auto">
                <ul className="w-full pb-3 border-b border-gray-300 min-w-fit">
                  <li className="flex text-sm">
                    <p className="min-w-20">訂單編號</p>
                    <p className="min-w-20">訂單狀態</p>
                    <p className="min-w-20">出貨狀態</p>
                    <p className="min-w-20">付款狀態</p>
                    <p className="min-w-20">總金額</p>
                    <p className="min-w-44">成立日期</p>
                  </li>
                </ul>
                {orders.length > 0 ? (
                  <ul className="space-y-4">
                    {orders.map((order, index) => (
                      <li className="flex text-sm">
                        <p className="min-w-20">{index + 1}</p>
                        <p className="min-w-20">{order.status}</p>
                        <p className="min-w-20">{order.shippingStatus}</p>
                        <p className="min-w-20">{order.paymentStatus}</p>
                        <p className="min-w-20">
                          {addComma(order.subtotal)}
                        </p>
                        <p className="min-w-44">
                          {new Date(order.createdAt)}
                        </p>
                        <button
                          className={`${order.status !== "已付款" ? "opacity-50" : "hover:bg-gray-100"} px-1 min-w-fit ml-8 md:ml-auto py-0.5 text-sm`}
                          onClick={() => handleDeliver(order._id)}
                          disabled={order.status !== "已付款"}
                        >
                          進行出貨
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm">尚未有訂單。</p>
                )}
              </div>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
