import React, { useState, useEffect, useRef } from 'react';
import {
    Calculator,
    Home,
    ChefHat,
    Layout,
    Maximize,
    Minimize,
    ShieldCheck,
    Info,
    RotateCcw,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import './CostEstimation.css';

const CostEstimation = () => {
    const [formData, setFormData] = useState({
        roomType: 'Bedroom',
        length: '',
        width: '',
        cupboardType: 'Full Height',
        plywoodGrade: 'Commercial',
        budgetCategory: 'Standard'
    });

    const [result, setResult] = useState({
        totalCost: 0,
        materialCost: 0,
        hardwareCost: 0,
        installationCost: 0,
        isCalculated: false
    });

    const [displayTotal, setDisplayTotal] = useState(0); // For rolling number effect
    const [errors, setErrors] = useState({});

    // Pricing Constants
    const PRICING = {
        plywood: {
            'Commercial': 80,
            'MR': 110,
            'BWR': 140,
            'BWP': 180
        },
        laborBase: 450,
        hardware: {
            'Budget': 100,
            'Standard': 250,
            'Premium': 500
        },
        finishMultiplier: {
            'Budget': 1.0,
            'Standard': 1.2,
            'Premium': 1.5
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const selectRoom = (type) => {
        setFormData(prev => ({ ...prev, roomType: type }));
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.length || formData.length <= 0) newErrors.length = "Required";
        if (!formData.width && formData.width !== 0) newErrors.width = "Required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateCost = () => {
        if (!validate()) return;

        const length = parseFloat(formData.length);
        const width = parseFloat(formData.width) || 0;

        const height = formData.cupboardType === 'Full Height' ? 7 : 3.5;
        const runningFeet = length + width;
        const totalSqFt = runningFeet * height;

        const plyRate = PRICING.plywood[formData.plywoodGrade];
        const hardwareRate = PRICING.hardware[formData.budgetCategory];
        const laborRate = PRICING.laborBase;
        const finishMult = PRICING.finishMultiplier[formData.budgetCategory];

        const rawMaterialCost = (plyRate * totalSqFt);
        const totalHardwareCost = (hardwareRate * totalSqFt);
        const baseInstallationCost = (laborRate * totalSqFt);

        const finalMaterialCost = rawMaterialCost * finishMult;
        const finalInstallationCost = baseInstallationCost * finishMult;

        const total = finalMaterialCost + totalHardwareCost + finalInstallationCost;

        setResult({
            totalCost: Math.round(total),
            materialCost: Math.round(finalMaterialCost),
            hardwareCost: Math.round(totalHardwareCost),
            installationCost: Math.round(finalInstallationCost),
            isCalculated: true
        });
    };

    // Auto-calculate on changes if already calculated once
    useEffect(() => {
        if (result.isCalculated) {
            calculateCost();
        }
    }, [formData]);

    // Rolling Number Animation
    useEffect(() => {
        if (result.isCalculated) {
            let start = displayTotal;
            const end = result.totalCost;
            const duration = 800;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function: easeOutExpo
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                const currentCount = Math.floor(start + (end - start) * easeProgress);
                setDisplayTotal(currentCount);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [result.totalCost, result.isCalculated]);

    const handleReset = () => {
        setFormData({
            roomType: 'Bedroom',
            length: '',
            width: '',
            cupboardType: 'Full Height',
            plywoodGrade: 'Commercial',
            budgetCategory: 'Standard'
        });
        setResult({ ...result, isCalculated: false });
        setErrors({});
        setDisplayTotal(0);
    };

    return (
        <div className="cost-estimation-page">
            <header className="calc-header" style={{
                background: '#3e2723',
                backgroundImage: `radial-gradient(circle, rgba(139, 94, 60, 0.4) 0%, rgba(26, 18, 11, 0.9) 100%), url('https://images.unsplash.com/photo-1508891015082-293e8006120e?auto=format&fit=crop&w=1600&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                {/* Vignette Overlay for extra depth */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8)',
                    zIndex: 1
                }}></div>

                <div className="container animate-slide-up" style={{
                    zIndex: 2,
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                        fontWeight: '900',
                        letterSpacing: '-2px',
                        marginBottom: '10px',
                        color: 'white',
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        lineHeight: 1
                    }}>Plan Your Space</h1>
                    <p style={{
                        fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                        color: 'rgba(255,255,255,0.9)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        fontWeight: '500',
                        lineHeight: 1.6,
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>Experience precision budgeting for your custom interiors with our advanced Plywood Cost Estimator.</p>
                </div>
            </header>

            <div className="calculator-wrapper">

                {/* Inputs Section */}
                <div className="calc-card animate-slide-up delay-1">

                    <div className="calc-section-title">
                        <span>01</span>
                        <h3>Choose Your Room</h3>
                    </div>

                    <div className="room-type-grid">
                        {[
                            { id: 'Bedroom', icon: <Home size={24} />, label: 'Bedroom' },
                            { id: 'Kitchen', icon: <ChefHat size={24} />, label: 'Kitchen' },
                            { id: 'Living Room', icon: <Layout size={24} />, label: 'Living Room' }
                        ].map((item) => (
                            <div
                                key={item.id}
                                className={`room-type-item ${formData.roomType === item.id ? 'active' : ''}`}
                                onClick={() => selectRoom(item.id)}
                            >
                                <i>{item.icon}</i>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="calc-section-title">
                        <span>02</span>
                        <h3>Dimensions & Style</h3>
                    </div>

                    <div className="form-grid">
                        <div className="premium-form-group">
                            <label>Cupboard Type</label>
                            <div className="input-with-icon">
                                <select name="cupboardType" value={formData.cupboardType} onChange={handleInputChange}>
                                    <option value="Full Height-7ft">Full Height (7ft)</option>
                                    <option value="Half Height-3.5ft">Half Height (3.5ft)</option>
                                </select>
                            </div>
                        </div>

                        <div className="premium-form-group">
                            <label>Plywood Grade <Info size={14} className="tooltip-trigger" title="Grade affects durability." /></label>
                            <div className="input-with-icon">
                                <select name="plywoodGrade" value={formData.plywoodGrade} onChange={handleInputChange}>
                                    <option value="Commercial">Commercial (Standard)</option>
                                    <option value="MR">MR (Moisture Resistant)</option>
                                    <option value="BWR">BWR (Water Resistant)</option>
                                    <option value="BWP">BWP (Marine Grade)</option>
                                </select>
                            </div>
                        </div>

                        <div className="premium-form-group">
                            <label>Wall 1 Length</label>
                            <div className="input-with-icon">
                                <input
                                    type="number"
                                    name="length"
                                    value={formData.length}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 10"
                                    style={errors.length ? { borderColor: '#d32f2f' } : {}}
                                />
                                <span className="input-unit">ft</span>
                            </div>
                        </div>

                        <div className="premium-form-group">
                            <label>Wall 2 Length (L-shape)</label>
                            <div className="input-with-icon">
                                <input
                                    type="number"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleInputChange}
                                    placeholder="0 for straight"
                                />
                                <span className="input-unit">ft</span>
                            </div>
                        </div>
                    </div>

                    <div className="premium-form-group">
                        <label>Finish Category</label>
                        <div className="input-with-icon">
                            <select name="budgetCategory" value={formData.budgetCategory} onChange={handleInputChange}>
                                <option value="Budget">Basic (Laminate)</option>
                                <option value="Standard">Standard (Premium Laminate)</option>
                                <option value="Premium">Elite (PU/Veneer/Acrylic)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '18px', borderRadius: '12px' }}
                            onClick={calculateCost}
                        >
                            Calculate Now
                        </button>
                        <button
                            className="btn btn-outline"
                            style={{ width: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={handleReset}
                            title="Reset"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>

                </div>

                {/* Results Section */}
                <div className="results-card animate-slide-up delay-2">
                    <div className="results-header">
                        <span className="amount-label">Estimate for {formData.roomType}</span>
                        <div className="total-amount-display">
                            ₹ {displayTotal.toLocaleString('en-IN')}
                        </div>
                        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                            Calculated for {formData.length && formData.width ? 'L-Shape' : 'Straight'} {formData.cupboardType}
                        </p>
                    </div>

                    <div className="breakdown-list">
                        <div className="breakdown-item">
                            <div className="breakdown-label"><ShieldCheck size={18} /> Material Cost</div>
                            <div className="breakdown-value">₹ {result.materialCost.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="breakdown-item">
                            <div className="breakdown-label"><Layout size={18} /> Premium Hardware</div>
                            <div className="breakdown-value">₹ {result.hardwareCost.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="breakdown-item">
                            <div className="breakdown-label"><Calculator size={18} /> Professional Labor</div>
                            <div className="breakdown-value">₹ {result.installationCost.toLocaleString('en-IN')}</div>
                        </div>
                    </div>

                    <div className="expert-cta">
                        <p>Need a detailed 3D design and site measurements?</p>
                        <a href="/contact" className="btn-white">Book Expert Consultation</a>
                    </div>
                </div>

            </div>

            <div className="container" style={{ marginTop: '60px', textAlign: 'center', color: '#888' }}>
                <p>Note: These are approximate estimates based on standard dimensions. Actual site conditions may affect final pricing.</p>
            </div>
        </div>
    );
};

export default CostEstimation;
