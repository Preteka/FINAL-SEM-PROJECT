import React, { useEffect, useRef } from 'react';
import {
    Calculator, Palette, ArrowRight, Sparkles, Zap, Box, Compass,
    Layers, Hammer, Pencil, Ruler, Feather, Trees, Origami
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ConvenienceSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        const revealElements = sectionRef.current?.querySelectorAll('.reveal');
        revealElements?.forEach((el) => observer.observe(el));

        return () => revealElements?.forEach((el) => observer.unobserve(el));
    }, []);

    const bubbles = [
        { icon: Sparkles, top: '15%', left: '8%', delay: 0, size: 52, color: 'bg-amber-700' },
        { icon: Zap, top: '65%', left: '5%', delay: 1500, size: 42, color: 'bg-stone-800' },
        { icon: Box, top: '25%', right: '10%', delay: 800, size: 58, color: 'bg-stone-400' },
        { icon: Compass, top: '75%', right: '8%', delay: 2200, size: 46, color: 'bg-amber-800' },
        { icon: Layers, top: '10%', right: '22%', delay: 500, size: 50, color: 'bg-stone-300' },
        { icon: Hammer, top: '80%', left: '22%', delay: 1200, size: 54, color: 'bg-stone-500' },
        { icon: Pencil, top: '40%', left: '15%', delay: 2500, size: 45, color: 'bg-amber-700' },
        { icon: Ruler, top: '55%', right: '15%', delay: 1800, size: 48, color: 'bg-stone-800' },
        { icon: Feather, top: '12%', left: '30%', delay: 3000, size: 44, color: 'bg-stone-400' },
        { icon: Trees, top: '85%', right: '30%', delay: 200, size: 52, color: 'bg-amber-800' },
        { icon: Origami, top: '45%', right: '5%', delay: 1100, size: 40, color: 'bg-amber-700' },
    ];

    const dots = [
        { top: '20%', left: '25%', size: 8, delay: 500 },
        { top: '70%', left: '12%', size: 12, delay: 1200 },
        { top: '15%', right: '15%', size: 10, delay: 800 },
        { top: '80%', right: '25%', size: 6, delay: 2000 },
        { top: '50%', left: '5%', size: 14, delay: 1500 },
        { top: '40%', right: '35%', size: 8, delay: 300 },
    ];

    const tools = [
        {
            id: 1,
            title: 'Cost Calculator',
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
            link: '/cost-estimation',
            number: '01'
        },
        {
            id: 2,
            title: 'Color Palette',
            image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80',
            link: '/products',
            number: '02'
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-gradient-to-b from-stone-50 to-amber-50/30 py-24 lg:py-32"
        >
            {/* Background Decorative Dots */}
            {dots.map((dot, index) => (
                <div
                    key={`dot-${index}`}
                    className="absolute rounded-full bg-amber-700/10 animate-pulse-slow hidden lg:block"
                    style={{
                        top: dot.top,
                        left: dot.left,
                        right: dot.right,
                        width: `${dot.size}px`,
                        height: `${dot.size}px`,
                        animationDelay: `${dot.delay}ms`
                    }}
                />
            ))}

            {/* Background Floating Bubbles */}
            {bubbles.map((bubble, index) => {
                const Icon = bubble.icon;
                return (
                    <div
                        key={index}
                        className={`absolute rounded-full bg-white shadow-xl border border-stone-200/50 
                                   flex items-center justify-center backdrop-blur-sm
                                   transition-all duration-500 hover:scale-150 hover:bg-amber-800 
                                   hover:shadow-2xl hover:z-20 cursor-pointer group
                                   animate-float-bubble hidden lg:flex`}
                        style={{
                            top: bubble.top,
                            left: bubble.left,
                            right: bubble.right,
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            animationDelay: `${bubble.delay}ms`
                        }}
                    >
                        <Icon
                            size={bubble.size * 0.4}
                            className={`${bubble.color.replace('bg-', 'text-')} group-hover:text-white transition-colors duration-300`}
                        />
                    </div>
                );
            })}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-16 lg:mb-20 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6 reveal opacity-0 translate-y-4">
                        <div className="w-16 lg:w-20 h-px bg-amber-800/30"></div>
                        <span className="text-xs lg:text-sm font-bold text-amber-800 tracking-[0.2em] uppercase">
                            Professional Tools
                        </span>
                        <div className="w-16 lg:w-20 h-px bg-amber-800/30"></div>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 lg:mb-8 reveal opacity-0 translate-y-4">
                        Precision in Every Step
                    </h2>

                    <p className="text-base sm:text-lg lg:text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto reveal opacity-0 translate-y-4">
                        We provide the digital edge for your physical projects. Use our specialized tools to plan, budget, and visualize your perfect space with confidence.
                    </p>
                </div>

                {/* Tool Cards */}
                <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-20 max-w-5xl mx-auto">
                    {tools.map((tool, index) => (
                        <div
                            key={tool.id}
                            className={`reveal opacity-0 translate-y-4 w-full max-w-sm ${index === 1 ? 'lg:mt-10' : ''}`}
                        >
                            <Link to={tool.link} className="block group">
                                <div className="relative w-full aspect-[2/3] rounded-[120px] lg:rounded-[170px] overflow-hidden 
                                              shadow-2xl transition-all duration-700 ease-out
                                              group-hover:shadow-3xl group-hover:-translate-y-5 group-hover:scale-105">
                                    {/* Image */}
                                    <img
                                        src={tool.image}
                                        alt={tool.title}
                                        className="w-full h-full object-cover transition-transform duration-700 
                                                 group-hover:scale-110 group-hover:rotate-3"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent">
                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
                                            {/* Number */}
                                            <span className="block text-6xl lg:text-7xl font-black leading-none 
                                                           text-transparent mb-4"
                                                style={{ WebkitTextStroke: '1px white', opacity: 0.4 }}>
                                                {tool.number}
                                            </span>

                                            {/* Title */}
                                            <h3 className="text-2xl lg:text-3xl font-bold mb-5">
                                                {tool.title}
                                            </h3>

                                            {/* Arrow Button */}
                                            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border-2 border-white/70 
                                                          flex items-center justify-center
                                                          transition-all duration-500 ease-out
                                                          group-hover:bg-white group-hover:border-white 
                                                          group-hover:scale-125 group-hover:-rotate-45
                                                          group-hover:shadow-lg">
                                                <ArrowRight
                                                    size={28}
                                                    className="transition-colors duration-300 group-hover:text-amber-800"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes float-bubble {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-40px) rotate(15deg); }
                }
                
                .animate-float-bubble {
                    animation: float-bubble 7s ease-in-out infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite alternate;
                }
                
                @keyframes pulse-slow {
                    0% { transform: scale(1); opacity: 0.1; }
                    100% { transform: scale(1.5); opacity: 0.3; }
                }
                
                .reveal.animate-in {
                    animation: reveal-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                
                .reveal:nth-child(1).animate-in { animation-delay: 0.1s; }
                .reveal:nth-child(2).animate-in { animation-delay: 0.2s; }
                .reveal:nth-child(3).animate-in { animation-delay: 0.3s; }
                .reveal:nth-child(4).animate-in { animation-delay: 0.4s; }
                
                @keyframes reveal-up {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .shadow-3xl {
                    box-shadow: 0 40px 90px rgba(93, 64, 55, 0.3);
                }
            `}</style>
        </section>
    );
};

export default ConvenienceSection;