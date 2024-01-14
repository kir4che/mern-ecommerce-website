import About from "./components/Home/About/About";
import Campaign from "./components/Home/Campaign/Campaign";
import News from './components/Home/News/News';
import Recommend from "./components/Home/Recommend/Recommend";
import ShopList from "./components/Home/ShopList/ShopList";
import Layout from "./components/Layout/Layout";

function App() {
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

export default App;
