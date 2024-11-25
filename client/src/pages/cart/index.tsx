import Layout from "../../layouts/AppLayout";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../../components/Cart";
import { useCart } from "../../hooks/useCart";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, getCart, clearCart } = useCart();
  const isLogin = Cookies.get("isLogin");

  const [BuyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (!isLogin) navigate("/account/login");
  }, [isLogin === false]);

  if (!cart || cart.length < 0) return <Loading />;

  const handleOrderPlaced = async () => {
    if (cart.length < 1) return alert("請先加入商品！");
    if (!BuyerInfo.name || !BuyerInfo.phone || !BuyerInfo.address)
      return alert("請填寫完整資訊！");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          name: BuyerInfo.name,
          phone: BuyerInfo.phone,
          address: BuyerInfo.address,
          orderItems: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totalAmount:
            cart.reduce(
              (acc, item) => acc + item.product.price * item.quantity,
              0,
            ) + 65,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("訂單已送出！");
        clearCart();
        setBuyerInfo({
          name: "",
          phone: "",
          address: "",
        });
        navigate(`/checkout/${data.order._id}`);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <Layout>
      <div className="flex md:flex-row flex-col p-10 px-[5vw]">
        <section className="space-y-8 md:w-3/4">
          <section className="px-10 py-6 bg-white shadow-md">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-medium">您的購物車</h1>
              <Link to="/collections/all" className="text-sm hover:underline">
                繼續購物
              </Link>
            </div>
            <div className="flex justify-between pb-4 mt-10 mb-8 text-xs border-b">
              <p className="w-2/5">商品</p>
              <p className="hidden md:block">數量</p>
              <p>小計</p>
            </div>
            <CartItem />
          </section>
          <section>
            <h3 className="pb-2 mb-4 text-base border-b border-zinc-300">
              購買人資訊
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row">
                <label className="flex-1 block">
                  姓名
                  <input
                    type="text"
                    name="name"
                    value={BuyerInfo.name}
                    onChange={(e) =>
                      setBuyerInfo({ ...BuyerInfo, name: e.target.value })
                    }
                  />
                </label>
                <label className="flex-1 block">
                  聯絡電話
                  <input
                    type="text"
                    name="phone"
                    value={BuyerInfo.phone}
                    onChange={(e) =>
                      setBuyerInfo({ ...BuyerInfo, phone: e.target.value })
                    }
                    placeholder="0912345678"
                  />
                </label>
              </div>
              <label className="block w-full sm:space-y-3">
                配送地址
                <input
                  type="text"
                  name="address"
                  value={BuyerInfo.address}
                  onChange={(e) =>
                    setBuyerInfo({ ...BuyerInfo, address: e.target.value })
                  }
                  placeholder="請填寫完整地址"
                />
              </label>
            </div>
          </section>
        </section>
        <section className="px-[2vw] md:w-1/4 pt-8">
          <h1 className="pb-4 mb-4 text-xl font-medium border-b border-zinc-300">
            訂單摘要
          </h1>
          <div>
            <p className="flex justify-between py-2 text-sm font-medium">
              <span>小計</span>
              <span className="font-semibold">
                NT$
                {cart.length > 0 &&
                  cart.reduce(
                    (acc, item) => acc + item.product.price * item.quantity,
                    0,
                  )}
              </span>
            </p>
            <p className="flex justify-between py-2 text-sm font-medium">
              <span>運費</span>
              <span className="font-semibold">NT$65</span>
            </p>
          </div>
          <p className="flex justify-between pt-4 pb-10 mt-8 text-sm font-medium border-t border-zinc-300">
            <span>總計</span>
            <span className="font-semibold">
              NT$
              {cart.length > 0 &&
                cart.reduce(
                  (acc, item) => acc + item.product.price * item.quantity,
                  0,
                ) + 65}
            </span>
          </p>
          <button
            className="w-full py-3 text-sm font-medium border-2 rounded border-primary hover:bg-secondary hover:text-primary text-secondary bg-primary"
            onClick={handleOrderPlaced}
          >
            前往付款
          </button>
        </section>
      </div>
      <div></div>
    </Layout>
  );
};

export default Cart;
