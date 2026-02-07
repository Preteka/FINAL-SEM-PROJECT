import React from 'react';
import HeroSlider from '../../components/HeroSlider';
import WhyChooseUs from '../../components/WhyChooseUs'; // Advantage Strip
import ProductShowcase from '../../components/ProductShowcase'; // NEW: Red/Brown Split Section
import BrandStory from '../../components/BrandStory';
import ConvenienceSection from '../../components/ConvenienceSection'; // NEW: Pill-shaped promo
import FeaturedProducts from '../../components/ProductCard/FeaturedProducts'; // Horizontal List
import Applications from '../../components/Applications';
import WhyVinayaga from '../../components/WhyVinayaga'; // NEW: Why Vinayaga Plywoods?

const Home = () => {
    return (
        <div style={{ backgroundColor: 'white' }}>
            <HeroSlider />

            {/* 1. Advantage Icon Strip */}
            <WhyChooseUs />

            {/* 2. New Product Showcase (Split Layout) - Matches user reference */}
            <ProductShowcase />

            {/* 3. Brand Story Video */}
            <BrandStory />

            {/* 4. Horizontal Product Carousel */}
            <FeaturedProducts />

            {/* 5. Cost Calculator / Convenience Section - Matches user reference */}
            <ConvenienceSection />

            {/* 6. Applications / Spaces Grid */}
            <Applications />

            {/* 7. Why Vinayaga (Replaces Testimonials) */}
            <WhyVinayaga />
        </div>
    );
};

export default Home;
