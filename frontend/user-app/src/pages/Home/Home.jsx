import React from 'react';
import Hero from '../../components/Hero';
import Highlights from '../../components/Highlights';
import FeaturedProducts from '../../components/ProductCard/FeaturedProducts';
import WhyChooseUs from '../../components/WhyChooseUs';

const Home = () => {
    return (
        <>
            <Hero />
            <Highlights />
            <FeaturedProducts />
            <WhyChooseUs />
        </>
    );
};

export default Home;
