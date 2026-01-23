import React, { useState, useEffect } from 'react';

// Cost Estimation Page Component
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

    const [errors, setErrors] = useState({});

    // Pricing Constants (Approximate)
    const PRICING = {
        plywood: {
            'Commercial': 80,
            'MR': 110,
            'BWR': 140,
            'BWP': 180
        },
        laborBase: 450, // Per sq ft
        hardware: {
            'Budget': 100,
            'Standard': 250,
            'Premium': 500
        },
        finishMultiplier: {
            'Budget': 1.0,   // Laminate basic
            'Standard': 1.2, // Premium Laminate / Acrylic
            'Premium': 1.5   // PU / Veneer
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for that field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.length || formData.length <= 0) newErrors.length = "Length must be greater than 0";
        if (!formData.width || formData.width <= 0) newErrors.width = "Width must be greater than 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateCost = () => {
        if (!validate()) return;

        const length = parseFloat(formData.length);
        const width = parseFloat(formData.width);

        // Assumption: We are calculating cost for cupboards running along the specified length and width?
        // Or just total running feet? Let's assume (Length + Width) is the running feet of cupboard.
        // Height: Full = 7ft, Half = 3.5ft
        // Depth: Standard 2ft (implied in sqft rate)

        const height = formData.cupboardType === 'Full Height' ? 7 : 3.5;
        const runningFeet = length + width;
        const totalSqFt = runningFeet * height;

        const plyRate = PRICING.plywood[formData.plywoodGrade];
        const hardwareRate = PRICING.hardware[formData.budgetCategory];
        const laborRate = PRICING.laborBase;
        const finishMult = PRICING.finishMultiplier[formData.budgetCategory];

        // Costs
        const rawMaterialCost = (plyRate * totalSqFt);
        const totalHardwareCost = (hardwareRate * totalSqFt);
        const baseInstallationCost = (laborRate * totalSqFt);

        // Apply finish multiplier to material and installation (often finish affects labor and material)
        const finalMaterialCost = rawMaterialCost * finishMult;
        const finalInstallationCost = baseInstallationCost * finishMult; // More complex finish = more labor

        const total = finalMaterialCost + totalHardwareCost + finalInstallationCost;

        setResult({
            totalCost: Math.round(total),
            materialCost: Math.round(finalMaterialCost),
            hardwareCost: Math.round(totalHardwareCost),
            installationCost: Math.round(finalInstallationCost),
            isCalculated: true
        });
    };

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
    };

    // Dynamic update if needed, but requirements said "Price update when budget category changes". 
    // Let's make it auto-calculate if results are already shown? 
    // Or just rely on the button as per "Primary button: Calculate Cost". I'll stick to button to be safe, but can add auto-refreshes.
    useEffect(() => {
        if (result.isCalculated) {
            calculateCost();
        }
    }, [formData.budgetCategory, formData.plywoodGrade, formData.cupboardType]);


    return (
        <div className="cost-estimation-page fade-in">
            <header className="page-header">
                <div className="container">
                    <h1 className="text-primary">Plan Your Dream Interiors</h1>
                    <p className="subtitle">Get an approximate cost estimate for your custom plywood cupboards.</p>
                </div>
            </header>

            <section className="estimation-container container">
                <div className="estimation-card">

                    {/* Input Section */}
                    <div className="input-section">
                        <h2 className="section-title">Room & Details</h2>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Room Type</label>
                                <select name="roomType" value={formData.roomType} onChange={handleInputChange}>
                                    <option value="Bedroom">Bedroom</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Living Room">Living Room</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Cupboard Type</label>
                                <select name="cupboardType" value={formData.cupboardType} onChange={handleInputChange}>
                                    <option value="Full Height">Full Height (7ft)</option>
                                    <option value="Half Height">Half Height (3.5ft)</option>
                                </select>
                            </div>

                            <div className="form-group half">
                                <label>Wall 1 Length (ft)</label>
                                <input
                                    type="number"
                                    name="length"
                                    value={formData.length}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 10"
                                    className={errors.length ? 'error' : ''}
                                />
                                {errors.length && <span className="error-msg">{errors.length}</span>}
                            </div>

                            <div className="form-group half">
                                <label>Wall 2 Length (ft)</label>
                                <input
                                    type="number"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 0 if straight"
                                    className={errors.width ? 'error' : ''}
                                />
                                {errors.width && <span className="error-msg">{errors.width}</span>}
                            </div>

                            <div className="form-group">
                                <label>
                                    Plywood Grade
                                    <span className="info-tooltip" title="Commercial: Standard usage. MR: Moisture Resistant. BWR: Kitchens. BWP: High waterproof.">?</span>
                                </label>
                                <select name="plywoodGrade" value={formData.plywoodGrade} onChange={handleInputChange}>
                                    <option value="Commercial">Commercial (Standard)</option>
                                    <option value="MR">MR (Moisture Resistant)</option>
                                    <option value="BWR">BWR (Boiling Water Resistant)</option>
                                    <option value="BWP">BWP (Marine Grade)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Budget Category
                                    <span className="info-tooltip" title="Budget: Basic laminates. Standard: Premium laminates/accessories. Premium: High-end finishes & hardware.">?</span>
                                </label>
                                <select name="budgetCategory" value={formData.budgetCategory} onChange={handleInputChange}>
                                    <option value="Budget">Budget</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>
                        </div>

                        <div className="actions">
                            <button className="btn btn-primary" onClick={calculateCost}>Calculate Cost</button>
                            <button className="btn btn-outline" onClick={handleReset}>Reset</button>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className={`result-section ${result.isCalculated ? 'active' : ''}`}>
                        {result.isCalculated ? (
                            <>
                                <h2 className="section-title">Estimated Cost</h2>
                                <div className="total-cost">
                                    ₹ {result.totalCost.toLocaleString('en-IN')}
                                </div>
                                <p className="disclaimer-text">Approximate cost for {formData.cupboardType} cupboards.</p>

                                <div className="breakdown-cards">
                                    <div className="breakdown-card">
                                        <span>Material Cost</span>
                                        <strong>₹ {result.materialCost.toLocaleString('en-IN')}</strong>
                                    </div>
                                    <div className="breakdown-card">
                                        <span>Hardware</span>
                                        <strong>₹ {result.hardwareCost.toLocaleString('en-IN')}</strong>
                                    </div>
                                    <div className="breakdown-card">
                                        <span>Installation</span>
                                        <strong>₹ {result.installationCost.toLocaleString('en-IN')}</strong>
                                    </div>
                                </div>

                                <div className="note-box">
                                    <p><strong>Note:</strong> Cost is approximate and may vary based on final design selections and site conditions.</p>
                                </div>
                            </>
                        ) : (
                            <div className="placeholder-state">
                                <p>Enter details on the left to see your estimate.</p>
                            </div>
                        )}
                    </div>

                </div>

                <div className="footer-note">
                    <p>For exact pricing and 3D designs, please contact our showroom or <a href="/contact">place an inquiry</a>.</p>
                </div>
            </section>
        </div>
    );
};

export default CostEstimation;
