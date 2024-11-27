import { createContext, useState, ReactNode, useContext } from "react";
import axios from "axios";

interface CartItem {
  id: string;
  product: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  totalQuantity: number;
  setTotalQuantity: React.Dispatch<React.SetStateAction<number>>;
  isAdded: boolean;
  setIsAdded: React.Dispatch<React.SetStateAction<boolean>>;
  getCart: () => Promise<void>;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  changeQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const getCart = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.status === 200) {
        setCart(res.data.cart);
        setTotalQuantity(
          res.data.cart.reduce(
            (total: number, cartItem: CartItem) => total + cartItem.quantity,
            0,
          ),
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const addToCart = async (product: CartItem) => {
    const token = document.cookie.includes("token=");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart`,
        product,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        setCart(res.data.cart);
        getCart();
        setIsAdded(true);
      }

      setTimeout(() => setIsAdded(false), 2500);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/cart/${itemId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        setCart(res.data.cart);
        getCart();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const changeQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/cart/${productId}`,
        { quantity },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.status === 200) {
        setCart(res.data.cart);
        getCart();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const clearCart = async () => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/cart`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.status === 200) getCart();
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        totalQuantity,
        setTotalQuantity,
        isAdded,
        setIsAdded,
        getCart,
        addToCart,
        removeFromCart,
        changeQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
