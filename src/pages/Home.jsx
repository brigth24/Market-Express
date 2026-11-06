import { useState } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Ticker from '../components/Ticker.jsx';
import Features from '../components/Features.jsx';
import Categories from '../components/Categories.jsx';
import Catalog from '../components/Catalog.jsx';
import About from '../components/About.jsx';
import Footer from '../components/Footer.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import Toast from '../components/Toast.jsx';

export default function Home() {
  const [category, setCategory] = useState('todos');

  const shop = (cat) => {
    setCategory(cat);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <main>
        <Hero onShop={shop} />
        <Ticker />
        <Features />
        <Categories onSelect={shop} />
        <Catalog category={category} setCategory={setCategory} />
        <About />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}
