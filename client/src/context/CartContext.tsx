import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    getCart()
  }, [])

  const getCart = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      })
      const data = await res.json();
      if (res.ok) {
        setCart(data.cart)
        setTotalQuantity(data.cart.reduce((total, cartItem) => total + cartItem.quantity, 0))
      }
    } catch (err: any) {
      console.error(err.message);
    }
  }

  const addToCart = async (product) => {
    const token = Cookies.get('token');
    if (!token) {
      window.location.href = '/account/login';
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json();
      if (res.ok) {
        setCart(data.cart)
        getCart()
        setIsAdded(true);
      }
      setTimeout(() => setIsAdded(false), 2500);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  const removeFormCart = async (itemId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      })

      const data = await res.json();
      if (res.ok) {
        setCart(data.cart)
        getCart()
      }
    }
    catch (err: any) {
      console.error(err.message);
    }
  }

  const changeQuantity = async (productId, quantity) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      })

      const data = await res.json();
      if (res.ok) {
        setCart(data.cart)
        getCart()
      }
    } catch (err: any) {
      console.error(err.message);
    }
  }

  const clearCart = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      })

      if (res.ok) getCart()
    } catch (err: any) {
      console.error(err.message);
    }
  }

  return <CartContext.Provider value={{ cart, setCart, getCart, totalQuantity, setTotalQuantity, addToCart, isAdded, removeFormCart, changeQuantity, clearCart }}>{children}</CartContext.Provider>
}