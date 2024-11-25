import { useEffect } from "react";
import { useCart } from "./hooks/useCart";

import About from "./components/Home/About";
import Campaign from "./components/Home/Campaign";
import News from "./components/Home/News";
import Recommend from "./components/Home/Recommend";
import ShopList from "./components/Home/ShopList/ShopList";
import Layout from "./layouts/AppLayout";

export default function App() {
  const { getCart } = useCart();

  useEffect(() => {
    getCart();
  }, []);

  return (
    <Layout>
      <Recommend />
      <Campaign />
      <About />
      <ShopList />
      <News />
    </Layout>
  );
}
