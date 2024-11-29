import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import Layout from "@/layouts/AppLayout";
import Button from "@/components/atoms/Button";

import { ReactComponent as CartImg } from "@/assets/images/ecommerce-cart-illustration.inline.svg";

const QuantityInput = ({ productId, quantity, max = 99, changeQuantity }) => (
  <div className="inline-flex px-3 border-[0.96px] border-primary">
    <button
      onClick={() => changeQuantity(productId, quantity - 1)}
      disabled={quantity <= 1}
    >
      <svg className="w-2 text-gray-500 fill-current" viewBox="0 0 448 512">
        <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
      </svg>
    </button>
    <input
      className="w-[3.6vw] min-w-8 text-sm py-1 mx-2 text-center border-none"
      type="text"
      value={quantity}
      min={1}
      max={max}
    />
    <button
      onClick={() => changeQuantity(productId, quantity + 1)}
      disabled={quantity >= max}
    >
      <svg className="w-2 text-gray-500 fill-current" viewBox="0 0 448 512">
        <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
      </svg>
    </button>
  </div>
);

const RemoveBtn = ({ onClick }) => (
  <button onClick={onClick} className="hover:opacity-80">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 50 50"
    >
      <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z"></path>
    </svg>
  </button>
);

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, changeQuantity, getCart, clearCart } =
    useCart();
  const { user } = useAuth();

  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) getCart();
  });

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
    return subtotal + 65; // Adding shipping cost
  };

  const handleOrderPlaced = async () => {
    if (cart.length < 1) return alert("請先加入商品！");
    if (!buyerInfo.name || !buyerInfo.phone || !buyerInfo.address)
      return alert("請填寫完整資訊！");

    try {
      const { data, status } = await axios.new(
        `${process.env.REACT_APP_API_URL}/orders`,
        {
          name: buyerInfo.name,
          phone: buyerInfo.phone,
          address: buyerInfo.address,
          orderItems: cart.map(({ productId, quantity, product }) => ({
            productId,
            quantity,
            price: product.price,
          })),
          totalAmount: calculateTotal(),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (status === 200) {
        alert("訂單已送出！");
        clearCart();
        setBuyerInfo({ name: "", phone: "", address: "" });
        navigate(`/checkout/${data.order._id}`);
      }
    } catch (err) {
      console.error(err.message);
      alert("訂單送出失敗，請稍後再試");
    }
  };

  return !cart || cart.length === 0 ? (
    <Layout className="flex flex-col items-center justify-center gap-8 px-4 -mt-16 md:flex-row">
      <CartImg className="w-full max-w-96 sm:w-96" />
      <div className="space-y-6 text-center md:text-left">
        <p className="text-xl">購物車是空的，快去選購吧！</p>
        <Button onClick={() => navigate("/collections/all")} className="px-10">
          繼續購物
        </Button>
      </div>
    </Layout>
  ) : (
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
            <div className="flex justify-between pb-4 mt-10 mb-8 text-sm border-b">
              <p className="w-2/5">商品</p>
              <p className="hidden md:block">數量</p>
              <p>小計</p>
            </div>
            <ul className="flex flex-col gap-6">
              {cart.length > 0 &&
                cart.map((item) => (
                  <li className="flex items-start w-full" key={item._id}>
                    <div className="flex w-full gap-[2.5vw] md:gap-[1.5vw]">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="object-cover w-32 md:h-20"
                        loading="lazy"
                      />
                      <div className="space-y-2">
                        <Link
                          to={`/products/${item.productId}`}
                          className="text-sm hover:underline"
                        >
                          {item.product.title}
                        </Link>
                        <p className="text-sm text-gray-600">
                          NT${item.product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-[2vw] md:hidden">
                          {QuantityInput({
                            productId: item.productId,
                            quantity: item.quantity,
                            max: item.product.countInStock,
                            changeQuantity,
                          })}
                          {RemoveBtn({
                            onClick: () => removeFromCart(item._id),
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:w-1/2">
                      <div className="items-center hidden gap-[1.25vw] md:flex">
                        {QuantityInput({
                          productId: item.productId,
                          quantity: item.quantity,
                          max: item.product.countInStock,
                          changeQuantity,
                        })}
                        {RemoveBtn({ onClick: () => removeFromCart(item._id) })}
                      </div>
                      <span className="md:text-sm">
                        NT$
                        {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
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
                    value={buyerInfo.name}
                    onChange={(e) =>
                      setBuyerInfo({ ...buyerInfo, name: e.target.value })
                    }
                  />
                </label>
                <label className="flex-1 block">
                  聯絡電話
                  <input
                    type="text"
                    value={buyerInfo.phone}
                    onChange={(e) =>
                      setBuyerInfo({ ...buyerInfo, phone: e.target.value })
                    }
                    placeholder="0912345678"
                  />
                </label>
              </div>
              <label className="block w-full sm:space-y-3">
                配送地址
                <input
                  type="text"
                  value={buyerInfo.address}
                  onChange={(e) =>
                    setBuyerInfo({ ...buyerInfo, address: e.target.value })
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
                NT${calculateTotal() - 65}
              </span>{" "}
              {/* Subtotal without shipping */}
            </p>
            <p className="flex justify-between py-2 text-sm font-medium">
              <span>運費</span>
              <span className="font-semibold">NT$65</span>
            </p>
          </div>
          <p className="flex justify-between pt-4 pb-10 mt-8 text-sm font-medium border-t border-zinc-300">
            <span>總計</span>
            <span className="font-semibold">NT${calculateTotal()}</span>
          </p>
          <button
            className="w-full py-3 text-sm font-medium border-2 rounded border-primary hover:bg-secondary hover:text-primary text-secondary bg-primary"
            onClick={handleOrderPlaced}
          >
            前往付款
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default Cart;
