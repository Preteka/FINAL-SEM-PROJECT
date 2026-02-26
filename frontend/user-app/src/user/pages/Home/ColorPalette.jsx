import React, { useState, useEffect } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    Home as HomeIcon,
    Palette,
    Maximize2,
    Check,
    RefreshCcw,
    Sparkles,
    Layout
} from 'lucide-react';

const rooms = [
    {
        id: 'kitchen',
        name: 'Kitchen',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        description: 'Vibrant and functional'
    },
    {
        id: 'hall',
        name: 'Living Room',
        image: 'https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&w=800&q=80',
        description: 'Warm and inviting'
    },
    {
        id: 'bedroom',
        name: 'Bedroom',
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
        description: 'Calm and serene'
    }
];

const primaryColors = [
    { id: 'natural-wood', name: 'Natural Wood', hex: '#8B5E3C', text: 'white' },
    { id: 'white-neutral', name: 'White Neutral', hex: '#F5F5F7', text: 'black' },
    { id: 'dark-neutral', name: 'Dark Neutral', hex: '#2D2D2D', text: 'white' },
    { id: 'deep-blue', name: 'Deep Blue', hex: '#1E3A8A', text: 'white' },
    { id: 'earthy-green', name: 'Earthy Green', hex: '#3F4E33', text: 'white' },
    { id: 'warm-yellow', name: 'Warm Yellow', hex: '#D97706', text: 'white' },
    { id: 'soft-pink', name: 'Soft Pink', hex: '#DB2777', text: 'white' },
    { id: 'pastel-purple', name: 'Pastel Purple', hex: '#7C3AED', text: 'white' },
    { id: 'bold-orange', name: 'Bold Orange', hex: '#EA580C', text: 'white' },
    { id: 'fresh-cyan', name: 'Fresh Cyan', hex: '#0891B2', text: 'white' }
];

// Simple matching logic: monochromatic or complementary shades
const getMatchingColor = (primaryHex) => {
    const matchingMap = {
        '#8B5E3C': { name: 'Warm White', hex: '#FFFCF8' }, // Natural Wood
        '#F5F5F7': { name: 'Chocolate Brown', hex: '#5D4037' }, // White Neutral
        '#2D2D2D': { name: 'Ivory Beige', hex: '#F5F1EC' }, // Dark Neutral
        '#1E3A8A': { name: 'Soft Cream', hex: '#FAF8F5' }, // Deep Blue
        '#3F4E33': { name: 'Sand Beige', hex: '#E5DDD4' }, // Earthy Green
        '#D97706': { name: 'Charcoal', hex: '#333333' }, // Warm Yellow
        '#DB2777': { name: 'Light Grey', hex: '#D1D5DB' }, // Soft Pink
        '#7C3AED': { name: 'Pure White', hex: '#FFFFFF' }, // Pastel Purple
        '#EA580C': { name: 'Soft Ivory White', hex: '#FFFDF5' }, // Bold Orange
        '#0891B2': { name: 'Light Warm Wood Beige', hex: '#E8DED5' } // Fresh Cyan
    };
    return matchingMap[primaryHex] || { name: 'Neutral Frost', hex: '#F2F2F2' };
};

const ColorPalette = () => {
    const [step, setStep] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedPrimary, setSelectedPrimary] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleNext = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setStep(prev => prev + 1);
            setIsAnimating(false);
        }, 500);
    };

    const handleBack = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setStep(prev => prev - 1);
            setIsAnimating(false);
        }, 500);
    };

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        if (!selectedRoom || !selectedPrimary) return;

        setIsExporting(true);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        // Ensure CORS is handled for Unsplash images
        img.crossOrigin = 'anonymous';
        img.src = selectedRoom.image;

        img.onload = () => {
            // Set canvas size to match image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw base image
            ctx.drawImage(img, 0, 0);

            // Step 1: Apply Primary Color (Multiply overlap)
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = selectedPrimary.hex;
            ctx.globalAlpha = 0.25;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Step 2: Apply Color Burn (Simulated)
            ctx.globalCompositeOperation = 'color-burn';
            ctx.fillStyle = selectedPrimary.hex;
            ctx.globalAlpha = 0.1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Step 3: Draw Branding / Label
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;

            // Background for text
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.roundRect(40, 40, 350, 150, 20);
            ctx.fill();

            // Text details
            ctx.fillStyle = '#1C1917'; // stone-900
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.fillText('VINAYAGA INTERIORS', 60, 80);

            ctx.font = 'bold 36px Inter, sans-serif';
            ctx.fillText(selectedRoom.name, 60, 130);

            ctx.fillStyle = '#92400E'; // amber-800
            ctx.font = 'bold 18px Inter, sans-serif';
            ctx.fillText(`PALETTE: ${selectedPrimary.name}`, 60, 165);

            // Reset composite for accent block
            ctx.fillStyle = secondaryColor.hex;
            ctx.beginPath();
            ctx.roundRect(canvas.width - 250, canvas.height - 250, 200, 200, 30);
            ctx.fill();
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'white';
            ctx.stroke();

            ctx.fillStyle = '#1C1917';
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ACCENT', canvas.width - 150, canvas.height - 100);

            // Trigger Download
            const link = document.createElement('a');
            link.download = `Vinayaga-Design-${selectedRoom.id}-${selectedPrimary.id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            setIsExporting(false);
        };

        img.onerror = () => {
            console.error('Failed to load image for export');
            setIsExporting(false);
            alert('Could not export design due to image loading issues.');
        };
    };

    const secondaryColor = selectedPrimary ? getMatchingColor(selectedPrimary.hex) : { name: 'Neutral Frost', hex: '#F2F2F2' };

    return (
        <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 text-amber-800 font-bold tracking-widest uppercase text-sm mb-4">
                        <Sparkles size={16} />
                        Visualization Tools
                    </div>
                    <h1 className="text-5xl font-bold text-stone-900 mb-6">Interactive Color Palette</h1>
                    <p className="text-stone-600 max-w-2xl mx-auto">
                        Bring your dream space to life. Experiment with textures and tones to find the perfect harmony for your home.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-12 max-w-md mx-auto relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 -translate-y-1/2 -z-10 rounded-full"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-amber-800 -translate-y-1/2 -z-10 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(step - 1) * 50}%` }}
                    ></div>
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-stone-50 transition-all duration-500 
                                ${step >= i ? 'bg-amber-800 text-white scale-110 shadow-lg' : 'bg-stone-200 text-stone-500'}`}
                        >
                            {step > i ? <Check size={18} /> : i}
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className={`transition-all duration-700 transform ${isAnimating ? 'opacity-0 translate-y-10 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>

                    {/* STEP 1: ROOM SELECTION */}
                    {step === 1 && (
                        <div className="relative">
                            {/* Decorative background element */}
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl -z-10 animate-pulse"></div>

                            <h2 className="text-3xl font-black text-center mb-12 text-stone-900 tracking-tight">Step 1: Choose your canvas</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {rooms.map(room => (
                                    <div
                                        key={room.id}
                                        onClick={() => setSelectedRoom(room)}
                                        className={`group relative h-[450px] rounded-[50px] overflow-hidden cursor-pointer transition-all duration-700 
                                            ${selectedRoom?.id === room.id ? 'ring-2 ring-amber-800 ring-offset-8 ring-offset-stone-50 scale-105 shadow-[0_30px_60px_-15px_rgba(93,64,55,0.3)]' : 'hover:scale-[1.02] shadow-2xl shadow-stone-200'}`}
                                    >
                                        <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />

                                        {/* Dynamic Gradient Overlay */}
                                        <div className={`absolute inset-0 transition-opacity duration-700 ${selectedRoom?.id === room.id ? 'bg-stone-900/40' : 'bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90'}`}></div>

                                        <div className="absolute bottom-12 left-12 text-white z-10">
                                            <div className="inline-block px-4 py-1 rounded-full bg-amber-800 text-[10px] font-bold uppercase tracking-widest mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                                Featured Space
                                            </div>
                                            <h3 className="text-4xl font-black mb-3 tracking-tighter">{room.name}</h3>
                                            <p className="text-white/80 font-medium text-lg max-w-[200px] leading-tight">{room.description}</p>
                                        </div>

                                        {/* Selection Indicator */}
                                        <div className={`absolute top-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform 
                                            ${selectedRoom?.id === room.id ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                            <Check size={24} className="text-amber-800" strokeWidth={3} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-20 flex justify-center">
                                <button
                                    disabled={!selectedRoom}
                                    onClick={handleNext}
                                    className={`group px-14 py-6 rounded-full font-black text-lg flex items-center gap-4 transition-all duration-500 
                                        ${selectedRoom ? 'bg-stone-900 text-white hover:bg-amber-800 hover:px-16 shadow-[0_20px_50px_-10px_rgba(44,54,57,0.5)] hover:shadow-amber-800/30' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
                                >
                                    Proceed to Palette
                                    <ChevronRight size={24} className="transition-transform group-hover:translate-x-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: COLOR SELECTION */}
                    {step === 2 && (
                        <div className="max-w-5xl mx-auto relative">
                            {/* Decorative element */}
                            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-stone-200/50 rounded-full blur-3xl -z-10"></div>

                            <h2 className="text-3xl font-black text-center mb-12 text-stone-900 tracking-tight">Step 2: Define the Mood</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {primaryColors.map((color, idx) => (
                                    <div
                                        key={color.id}
                                        onClick={() => setSelectedPrimary(color)}
                                        className={`group p-8 rounded-[40px] bg-white border-2 cursor-pointer transition-all duration-500 relative overflow-hidden
                                            ${selectedPrimary?.id === color.id ? 'border-amber-800 shadow-2xl scale-105' : 'border-stone-100 hover:border-stone-200 hover:shadow-xl'}`}
                                        style={{ transitionDelay: `${idx * 50}ms` }}
                                    >
                                        <div
                                            className="w-full aspect-square rounded-[30px] mb-6 shadow-inner flex items-center justify-center transition-transform duration-500 group-hover:scale-95"
                                            style={{ backgroundColor: color.hex }}
                                        >
                                            <div className={`w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-500 
                                                ${selectedPrimary?.id === color.id ? 'scale-100' : 'scale-0'}`}>
                                                <Check size={24} className={color.text === 'white' ? 'text-white' : 'text-stone-800'} strokeWidth={3} />
                                            </div>
                                        </div>
                                        <h4 className="text-center font-black text-stone-800 text-lg">{color.name}</h4>
                                        <p className="text-center text-xs font-mono text-stone-400 mt-2 uppercase tracking-widest">{color.hex}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-20 flex justify-center gap-8">
                                <button
                                    onClick={handleBack}
                                    className="px-10 py-5 rounded-full font-bold border-2 border-stone-200 text-stone-600 hover:bg-stone-100 hover:border-stone-300 transition-all flex items-center gap-3"
                                >
                                    <ChevronLeft size={20} />
                                    Change Space
                                </button>
                                <button
                                    disabled={!selectedPrimary}
                                    onClick={handleNext}
                                    className={`group px-14 py-5 rounded-full font-black text-lg flex items-center gap-4 transition-all duration-500 
                                        ${selectedPrimary ? 'bg-stone-900 text-white hover:bg-amber-800 hover:px-16 shadow-[0_20px_50px_-10px_rgba(44,54,57,0.5)]' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
                                >
                                    Magic Preview
                                    <Layout size={20} className="transition-transform group-hover:rotate-12" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PREVIEW */}
                    {step === 3 && (
                        <div className="flex flex-col xl:flex-row gap-16 items-start">
                            {/* Visual Preview Container */}
                            <div className="xl:w-3/5 w-full relative">
                                <div className="rounded-[80px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative group border-[20px] border-white ring-1 ring-stone-100">
                                    <img src={selectedRoom.image} alt="Room Preview" className="w-full aspect-[4/3] object-cover" />

                                    {/* Advanced Color Overlays */}
                                    <div
                                        className="absolute inset-0 opacity-25 mix-blend-multiply transition-all duration-1000"
                                        style={{ backgroundColor: selectedPrimary.hex }}
                                    ></div>
                                    <div
                                        className="absolute top-0 left-0 w-full h-full opacity-10 mix-blend-color-burn transition-all duration-1000"
                                        style={{ backgroundColor: selectedPrimary.hex }}
                                    ></div>

                                    {/* Room Label Glassmorphism */}
                                    <div className="absolute top-12 left-12 p-8 rounded-[40px] bg-white/70 backdrop-blur-xl shadow-2xl border border-white/50 animate-float translate-y-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-amber-800 animate-ping"></div>
                                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-[0.3em]">Live Simulation</span>
                                        </div>
                                        <h4 className="text-3xl font-black text-stone-900 tracking-tighter">{selectedRoom.name}</h4>
                                        <p className="text-stone-600 font-medium text-sm mt-1">Premium Interior Setup</p>
                                    </div>

                                    {/* Action Floating Buttons */}
                                    <div className="absolute bottom-12 right-12 flex flex-col gap-4">
                                        <button className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-stone-800 shadow-2xl hover:bg-stone-900 hover:text-white transition-all transform hover:-translate-y-2">
                                            <Maximize2 size={24} />
                                        </button>
                                    </div>
                                </div>

                                {/* Secondary matching color splash */}
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-[40px] shadow-2xl animate-bounce-slow border-8 border-white"
                                    style={{ backgroundColor: secondaryColor.hex }}>
                                    <div className="absolute inset-x-0 bottom-4 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-800/50">Accent</p>
                                    </div>
                                </div>
                            </div>

                            {/* Control Panel */}
                            <div className="xl:w-2/5 w-full">
                                <div className="bg-white p-12 rounded-[60px] shadow-[0_40px_80px_-15px_rgba(93,64,55,0.15)] border border-stone-100 relative overflow-hidden">
                                    {/* Designer Note */}
                                    <div className="absolute top-0 right-0 p-8">
                                        <Palette className="text-stone-100 w-24 h-24 rotate-12" />
                                    </div>

                                    <h3 className="text-3xl font-black text-stone-900 mb-10 tracking-tight relative z-10">Architectural Harmony</h3>

                                    <div className="space-y-10 mb-12 relative z-10">
                                        {/* Primary Block */}
                                        <div className="flex items-center gap-8 group">
                                            <div className="w-24 h-24 rounded-[30px] shadow-2xl ring-8 ring-stone-50 transition-transform duration-500 group-hover:rotate-6 scale-100"
                                                style={{ backgroundColor: selectedPrimary.hex }}></div>
                                            <div>
                                                <p className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Canvas Foundation</p>
                                                <h4 className="text-2xl font-black text-stone-800">{selectedPrimary.name}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="px-3 py-1 bg-stone-100 rounded-full text-[10px] font-mono font-bold text-stone-500 uppercase">{selectedPrimary.hex}</span>
                                                    <span className="text-[10px] text-stone-400 font-bold">100% Satin Finish</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="flex items-center gap-4">
                                            <div className="h-[2px] flex-1 bg-stone-100"></div>
                                            <Sparkles className="text-amber-800/20" size={16} />
                                            <div className="h-[2px] flex-1 bg-stone-100"></div>
                                        </div>

                                        {/* Secondary Block */}
                                        <div className="flex items-center gap-8 group">
                                            <div className="w-24 h-24 rounded-[30px] shadow-2xl ring-8 ring-stone-50 transition-transform duration-500 group-hover:-rotate-6 scale-100"
                                                style={{ backgroundColor: secondaryColor.hex }}></div>
                                            <div>
                                                <p className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Accent Complement</p>
                                                <h4 className="text-2xl font-black text-stone-800">{secondaryColor.name}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="px-3 py-1 bg-stone-100 rounded-full text-[10px] font-mono font-bold text-stone-500 uppercase">{secondaryColor.hex}</span>
                                                    <span className="text-[10px] text-stone-400 font-bold">Recommended Trim</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Insight */}
                                    <div className="p-8 bg-amber-50/50 rounded-[40px] border border-amber-100/50 mb-10 relative">
                                        <div className="absolute top-4 right-4 text-amber-800 opacity-20"><Sparkles size={24} /></div>
                                        <p className="text-stone-700 leading-relaxed font-medium">
                                            "This pairing leverages <span className="text-amber-900 font-bold">architectural contrast</span> to expand perceived volume. The {selectedPrimary.name} base ground the space, while Vinayaga Frost accents reflect natural light pathing."
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-5">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 px-8 py-5 rounded-3xl font-black border-2 border-stone-100 text-stone-600 hover:bg-stone-50 hover:border-stone-200 flex items-center justify-center gap-3 transition-all"
                                        >
                                            <RefreshCcw size={20} className="text-stone-400" />
                                            Start Over
                                        </button>
                                        <button
                                            onClick={handleExport}
                                            disabled={isExporting}
                                            className={`flex-1 px-8 py-5 rounded-3xl font-black transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3
                                                ${isExporting ? 'bg-stone-400 cursor-not-allowed text-stone-200' : 'bg-stone-900 text-white hover:bg-amber-800 shadow-[0_20px_40px_-10px_rgba(44,54,57,0.4)]'}`}
                                        >
                                            {isExporting ? (
                                                <>
                                                    <RefreshCcw size={20} className="animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Export Design'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default ColorPalette;
