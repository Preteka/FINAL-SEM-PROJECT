import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import FeaturedProducts from './components/FeaturedProducts';
import WhyChooseUs from './components/WhyChooseUs';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import ProductCategory from './pages/ProductCategory';
import CostEstimation from './pages/CostEstimation';
import LoginRegister from './pages/LoginRegister';
import ProductDetails from './pages/ProductDetails';
import './index.css';

const LandingPage = () => (
  <>
    <Hero />
    <Highlights />
    <FeaturedProducts />
    <WhyChooseUs />
  </>
);

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products/:filterType/:filterValue" element={<ProductCategory />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/cost-estimation" element={<CostEstimation />} />
          <Route path="/login" element={<LoginRegister />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
