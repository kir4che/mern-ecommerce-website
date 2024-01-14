import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import About from './pages/about';
import Login from './pages/account/login';
import Register from './pages/account/register';
import Dashboard from './pages/admin/dashboard';
import Cart from './pages/cart';
import Collections from './pages/collections/[category]';
import Contact from './pages/contact';
import FAQ from './pages/faq';
import News from './pages/news';
import Post from './pages/news/[id]';
import Product from './pages/products/[id]';
import UserProfile from './pages/user';
import './style.css';
import Checkout from './pages/checkout/[id]';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/pages/about', element: <About /> },
  { path: '/blogs/news', element: <News /> },
  { path: '/blogs/news/:id', element: <Post /> },
  { path: '/pages/faq', element: <FAQ /> },
  { path: '/pages/contact', element: <Contact /> },
  { path: '/collections/:category', element: <Collections /> },
  { path: '/products/:id', element: <Product /> },
  { path: '/account/register', element: <Register /> },
  { path: '/account/login', element: <Login /> },
  { path: '/cart', element: <Cart /> },
  { path: '/checkout/:id', element: <Checkout /> },
  { path: '/user', element: <UserProfile /> },
  { path: '/admin/dashboard', element: <Dashboard /> },
]);

createRoot(document.getElementById('root') as HTMLElement).render(
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>
);