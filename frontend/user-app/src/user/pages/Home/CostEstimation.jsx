import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../shared/services/firebase';
import { collection, getDocs, query, where, doc, getDoc, orderBy } from 'firebase/firestore';
import {
    Calculator,
    Home,
    ChefHat,
    Layout,
    Check,
    ArrowRight,
    ChevronRight,
    Search,
    Info,
    ShieldCheck,
    RotateCcw
} from 'lucide-react';
import './CostEstimation.css';

const CostEstimation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roomType: 'Bedroom',
        cupboardHeight: '6 ft Wardrobe',
        cupboardHeightCustom: '',
        plywoodGrade: 'Commercial (Standard)',
        wall1Size: '6 ft Wardrobe',
        wall1Custom: '',
        wall2Size: '0 for straight',
        wall2Custom: '',
        finishCategory: 'Standard (Premium Laminate)'
    });

    const [matchedPackage, setMatchedPackage] = useState(null);
    const [allMatches, setAllMatches] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'details'
    const [packageProducts, setPackageProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingProducts, setFetchingProducts] = useState(false);
    const [finalEstimate, setFinalEstimate] = useState(0);
    const [calculatedArea, setCalculatedArea] = useState(0);
    const [perSqFtRate, setPerSqFtRate] = useState(0);
    const [hasCalculated, setHasCalculated] = useState(false);

    const parseDimension = (selection, customValue) => {
        if (selection === 'Custom Size') return parseFloat(customValue || 0);
        if (selection === '0 for straight') return 0;
        // Extract number from strings like "6 ft Wardrobe" or "10 ft Wardrobe"
        const match = selection.match(/\d+/);
        return match ? parseFloat(match[0]) : 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setHasCalculated(false);
    };

    const normalizeBreakdown = (pkg) => {
        let mRate = parseFloat(pkg.materialRate || 0);
        let hRate = parseFloat(pkg.hardwareRate || 0);
        let lRate = parseFloat(pkg.labourRate || pkg.labourCost || 0);
        const totalRate = pkg.totalCost || 0;

        if (totalRate > 0 && (mRate + hRate + lRate) !== totalRate) {
            if (mRate === 0 && hRate === 0) {
                mRate = totalRate - lRate;
                if (mRate < 0) { mRate = 0; lRate = totalRate; }
            } else {
                mRate = totalRate - (hRate + lRate);
                if (mRate < 0) mRate = 0;
            }
        }
        return { ...pkg, materialRate: mRate, hardwareRate: hRate, labourRate: lRate };
    };

    const handleSelectPackage = async (pkg) => {
        const normalizedPkg = normalizeBreakdown(pkg);
        setMatchedPackage(normalizedPkg);
        setPerSqFtRate(normalizedPkg.totalCost || 0);
        setFinalEstimate(calculatedArea * (normalizedPkg.totalCost || 0));
        setViewMode('details');
        setPackageProducts([]);

        const allProductIds = [
            ...(normalizedPkg.materialProductIds || []), 
            ...(normalizedPkg.hardwareProductIds || []),
            ...(normalizedPkg.productIds || [])
        ].filter((id, index, self) => 
            typeof id === 'string' && id.trim() !== '' && self.indexOf(id) === index
        );

        if (allProductIds.length > 0) {
            setFetchingProducts(true);
            try {
                const productDocs = await Promise.all(
                    allProductIds.map(id => getDoc(doc(db, "products", id)))
                );
                const productDetails = productDocs
                    .filter(d => d.exists())
                    .map(d => ({ id: d.id, ...d.data() }));
                setPackageProducts(productDetails);
            } catch (err) {
                console.error("Error fetching product details:", err);
            } finally {
                setFetchingProducts(false);
            }
        }
    };

    const handleCalculate = async () => {
        setLoading(true);
        setMatchedPackage(null);
        setAllMatches([]);
        setPackageProducts([]);
        setViewMode('list');
        
        try {
            let pkgType = 'Standard';
            if (formData.finishCategory.startsWith('Basic')) pkgType = 'Budget';
            else if (formData.finishCategory.startsWith('Premium')) pkgType = 'Premium';

            const q = query(
                collection(db, "estimation_packages"), 
                where("roomType", "==", formData.roomType),
                where("packageType", "==", pkgType)
            );
            
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const allMatchesFound = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                allMatchesFound.sort((a, b) => {
                    const dateA = new Date(a.updatedAt || a.createdAt || 0);
                    const dateB = new Date(b.updatedAt || b.createdAt || 0);
                    return dateB - dateA;
                });

                setAllMatches(allMatchesFound);
                const firstPkg = normalizeBreakdown(allMatchesFound[0]);
                setMatchedPackage(firstPkg);

                const height = parseDimension(formData.cupboardHeight, formData.cupboardHeightCustom);
                const wall1 = parseDimension(formData.wall1Size, formData.wall1Custom);
                const wall2 = parseDimension(formData.wall2Size, formData.wall2Custom);
                
                const totalLinearFt = wall1 + wall2;
                const totalSqFt = totalLinearFt * height;

                setCalculatedArea(totalSqFt);
                setPerSqFtRate(firstPkg.totalCost || 0);
                setFinalEstimate(totalSqFt * (firstPkg.totalCost || 0));
                setHasCalculated(true);

                // Pre-fetch products for the first package by default
                handleSelectPackage(allMatchesFound[0]);
                setViewMode('list'); // Keep list view after default selection setup
            } else {
                setHasCalculated(true);
            }
        } catch (error) {
            console.error("Error fetching matching package:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            roomType: 'Bedroom',
            cupboardHeight: '6 ft Wardrobe',
            cupboardHeightCustom: '',
            plywoodGrade: 'Commercial (Standard)',
            wall1Size: '6 ft Wardrobe',
            wall1Custom: '',
            wall2Size: '0 for straight',
            wall2Custom: '',
            finishCategory: 'Standard (Premium Laminate)'
        });
        setMatchedPackage(null);
        setPackageProducts([]);
        setHasCalculated(false);
    };

    return (
        <div className="cost-estimation-page">
            <header className="calc-header-exact">
                <div className="container animate-fade-in">
                    <h1 className="hero-title-exact">Plan Your Space</h1>
                    <p className="hero-subtitle-exact">
                        Experience precision budgeting for your custom interiors with our 
                        advanced Plywood Cost Estimator.
                    </p>
                </div>
            </header>

            <div className="calculator-wrapper-exact container">
                {/* Left Side: Inputs */}
                <div className="calc-card-main">
                    <div className="step-group">
                        <div className="step-header">
                            <span className="step-num">01</span>
                            <span className="step-label">Choose Your Room</span>
                        </div>
                        <div className="room-selector-exact">
                            {[
                                { id: 'Bedroom', icon: <Home size={24} />, label: 'Bedroom' },
                                { id: 'Kitchen', icon: <ChefHat size={24} />, label: 'Kitchen' },
                                { id: 'Hall', icon: <Layout size={24} />, label: 'Hall/Living' }
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    className={`room-item-exact ${formData.roomType === item.id ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, roomType: item.id }))}
                                >
                                    <i>{item.icon}</i>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="step-group">
                        <div className="step-header">
                            <span className="step-num">02</span>
                            <span className="step-label">Dimensions & Style</span>
                        </div>
                        <div className="form-grid-exact">
                            <div className="form-field">
                                <label>Cupboard Height</label>
                                <select name="cupboardHeight" value={formData.cupboardHeight} onChange={handleInputChange}>
                                    <option value="" disabled>Select Size</option>
                                    <option>6 ft Wardrobe</option>
                                    <option>8 ft Wardrobe</option>
                                    <option>10 ft Wardrobe</option>
                                    <option>12 ft Wardrobe</option>
                                    <option>Custom Size</option>
                                </select>
                                {formData.cupboardHeight === 'Custom Size' && (
                                    <div className="input-group-ft mt-2">
                                        <input type="number" name="cupboardHeightCustom" value={formData.cupboardHeightCustom} onChange={handleInputChange} placeholder="Enter height" />
                                        <span className="unit-ft">ft</span>
                                    </div>
                                )}
                            </div>
                            <div className="form-field">
                                <label>Plywood Grade <Info size={14} className="info-icon" /></label>
                                <select name="plywoodGrade" value={formData.plywoodGrade} onChange={handleInputChange}>
                                    <option>Commercial (Standard)</option>
                                    <option>MR Grade (Water Resistant)</option>
                                    <option>BWP Marine Grade</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Wall 1 Length</label>
                                <select name="wall1Size" value={formData.wall1Size} onChange={handleInputChange}>
                                    <option value="" disabled>Select Size</option>
                                    <option>6 ft Wardrobe</option>
                                    <option>8 ft Wardrobe</option>
                                    <option>10 ft Wardrobe</option>
                                    <option>12 ft Wardrobe</option>
                                    <option>Custom Size</option>
                                </select>
                                {formData.wall1Size === 'Custom Size' && (
                                    <div className="input-group-ft mt-2">
                                        <input type="number" name="wall1Custom" value={formData.wall1Custom} onChange={handleInputChange} placeholder="e.g. 10" />
                                        <span className="unit-ft">ft</span>
                                    </div>
                                )}
                            </div>
                            <div className="form-field">
                                <label>Wall 2 Length (L-shape)</label>
                                <select name="wall2Size" value={formData.wall2Size} onChange={handleInputChange}>
                                    <option>0 for straight</option>
                                    <option>6 ft Wardrobe</option>
                                    <option>8 ft Wardrobe</option>
                                    <option>10 ft Wardrobe</option>
                                    <option>12 ft Wardrobe</option>
                                    <option>Custom Size</option>
                                </select>
                                {formData.wall2Size === 'Custom Size' && (
                                    <div className="input-group-ft mt-2">
                                        <input type="number" name="wall2Custom" value={formData.wall2Custom} onChange={handleInputChange} placeholder="e.g. 5" />
                                        <span className="unit-ft">ft</span>
                                    </div>
                                )}
                            </div>
                            <div className="form-field full-width">
                                <label>Finish Category</label>
                                <select name="finishCategory" value={formData.finishCategory} onChange={handleInputChange}>
                                    <option>Standard (Premium Laminate)</option>
                                    <option>Basic (Standard Laminate)</option>
                                    <option>Premium (Acrylic / Gloss)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="calc-footer-actions">
                        <button className="btn-calculate-exact" onClick={handleCalculate} disabled={loading}>
                            {loading ? 'Calculated...' : 'Calculate Now'}
                        </button>
                        <button className="btn-reset-exact" onClick={handleReset}>
                            <RotateCcw size={18} />
                        </button>
                    </div>

                    {/* Left Column Dynamic Content */}
                    {hasCalculated && allMatches.length > 0 && (
                        <div className="dynamic-content-below animate-fade-in">
                            {viewMode === 'list' ? (
                                <>
                                    <h4 className="p-list-title">Explore Available Catalogs</h4>
                                    <div className="catalog-grid">
                                        {allMatches.map(pkg => (
                                            <div 
                                                key={pkg.id} 
                                                className={`catalog-card ${matchedPackage?.id === pkg.id ? 'active' : ''}`}
                                                onClick={() => handleSelectPackage(pkg)}
                                            >
                                                <div className="card-badge">{pkg.packageType}</div>
                                                <div className="card-info">
                                                    <h5>{pkg.name || "Custom Catalog"}</h5>
                                                    <div className="card-price">₹ {pkg.totalCost}/sq.ft</div>
                                                </div>
                                                <button className="btn-explore">
                                                    View Products <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="details-header">
                                        <button className="btn-back" onClick={() => setViewMode('list')}>
                                            <RotateCcw size={14} /> Back to Catalogs
                                        </button>
                                        <h4 className="p-list-title">{matchedPackage?.name} - Included Products</h4>
                                    </div>
                                    
                                    {fetchingProducts ? (
                                        <p className="fetching-msg">Fetching product details...</p>
                                    ) : packageProducts.length > 0 ? (
                                        <div className="p-grid-small">
                                            {packageProducts.map(p => (
                                                <div 
                                                    key={p.id} 
                                                    className="p-item-tiny clickable" 
                                                    onClick={() => navigate(`/product/${p.id}`)}
                                                    title={`View ${p.name}`}
                                                >
                                                    <img src={p.image || 'https://via.placeholder.com/50'} alt={p.name} />
                                                    <div className="p-text">
                                                        <h6>{p.name}</h6>
                                                        <p>{p.brand || 'Generic'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-p-msg">Standard materials and hardware included as per specifications.</p>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Sidebar Results */}
                <div className="calc-sidebar-exact">
                    <div className="sidebar-content">
                        <span className="summary-label">ESTIMATE FOR {formData.roomType.toUpperCase()} ({matchedPackage?.name})</span>
                        <div className="total-estimate-large">
                            <span className="curr">₹</span>
                            <span className="val">{hasCalculated ? finalEstimate.toLocaleString('en-IN') : '0'}</span>
                        </div>
                        <span className="sub-calculation">
                            {hasCalculated ? (
                                <>₹ {perSqFtRate.toLocaleString('en-IN')}/sq.ft × {calculatedArea} sq.ft</>
                            ) : (
                                <>Calculated for {formData.wall1Size === 'Custom Size' ? `${formData.wall1Custom}ft` : formData.wall1Size} × {formData.cupboardHeight === 'Custom Size' ? `${formData.cupboardHeightCustom}ft` : formData.cupboardHeight}</>
                            )}
                        </span>

                        <div className="breakdown-list">
                            <div className="br-row">
                                <div className="br-item"><ShieldCheck size={18} /> <span>Material Cost</span></div>
                                <div className="br-val">₹ {hasCalculated && matchedPackage ? Math.round((matchedPackage.materialRate || 0) * calculatedArea).toLocaleString('en-IN') : '0'}</div>
                            </div>
                            <div className="br-row">
                                <div className="br-item"><Layout size={18} /> <span>Premium Hardware</span></div>
                                <div className="br-val">₹ {hasCalculated && matchedPackage ? Math.round((matchedPackage.hardwareRate || 0) * calculatedArea).toLocaleString('en-IN') : '0'}</div>
                            </div>
                            <div className="br-row">
                                <div className="br-item"><Calculator size={18} /> <span>Professional Labor</span></div>
                                <div className="br-val">₹ {hasCalculated && matchedPackage ? Math.round((matchedPackage.labourRate || 0) * calculatedArea).toLocaleString('en-IN') : '0'}</div>
                            </div>
                        </div>

                        <div className="estimation-notes-exact">
                            <h4>Important Notes</h4>
                            <ul>
                                <li><Info size={14} /> Estimates are based on standard site conditions.</li>
                                <li><Info size={14} /> Final prices may vary based on actual on-site measurements.</li>
                                <li><Info size={14} /> Subject to material availability in your region.</li>
                                <li><Info size={14} /> Taxes and transportation are extra as applicable.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <p className="note-text">
                Note: These are approximate estimates based on standard dimensions. Actual site conditions may affect final pricing.
            </p>

            <style>{`
                .cost-estimation-page {
                    background: #fdfdfd;
                    min-height: 100vh;
                    padding-bottom: 50px;
                }
                .calc-header-exact {
                    background: #2b1d16;
                    padding: 80px 0 120px;
                    text-align: center;
                    color: white;
                }
                .hero-title-exact { font-size: 3.5rem; font-weight: 900; margin-bottom: 15px; }
                .hero-subtitle-exact { font-size: 1.1rem; opacity: 0.8; max-width: 600px; margin: 0 auto; line-height: 1.6; }

                .calculator-wrapper-exact {
                    display: flex;
                    gap: 30px;
                    margin-top: -80px;
                    align-items: flex-start;
                }

                .calc-card-main {
                    flex: 1.6;
                    background: white;
                    padding: 50px;
                    border-radius: 20px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.08);
                }

                .step-group { margin-bottom: 40px; }
                .step-header { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
                .step-num { font-size: 0.8rem; font-weight: 800; color: #4e342e; background: #f5f0ee; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
                .step-label { font-size: 0.95rem; font-weight: 700; color: #333; }

                .room-selector-exact { display: flex; gap: 15px; }
                .room-item-exact { 
                    flex: 1; border: 1.5px solid #eee; padding: 25px; border-radius: 16px;
                    display: flex; flex-direction: column; align-items: center; gap: 12px;
                    cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .room-item-exact:hover { border-color: #4e342e; background: #fafafa; }
                .room-item-exact.active {
                    background: #4e342e; color: white; border-color: #4e342e;
                    box-shadow: 0 10px 25px rgba(78, 52, 46, 0.25);
                }
                .room-item-exact span { font-weight: 700; font-size: 0.85rem; letter-spacing: 0.5px; }

                .form-grid-exact { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-field label { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 700; color: #555; margin-bottom: 10px; }
                .form-field.full-width { grid-column: span 2; }
                .form-field select, .form-field input { 
                    width: 100%; padding: 16px; border-radius: 12px; border: 1.5px solid #eee; 
                    background: #fcfcfc; font-weight: 600; font-size: 0.9rem; transition: 0.3s;
                }
                .form-field select:focus, .form-field input:focus { border-color: #4e342e; outline: none; background: white; }
                
                .input-group-ft { position: relative; }
                .mt-2 { margin-top: 10px; }
                .unit-ft { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-weight: 700; color: #bbb; font-size: 0.8rem; }

                .calc-footer-actions { display: flex; gap: 12px; margin-top: 40px; }
                .btn-calculate-exact { 
                    flex: 1; background: #4e342e; color: white; border: none; padding: 20px; 
                    border-radius: 14px; font-size: 1rem; font-weight: 800; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 8px 16px rgba(78, 52, 46, 0.2);
                }
                .btn-calculate-exact:hover { background: #3e2723; transform: translateY(-2px); box-shadow: 0 12px 20px rgba(78, 52, 46, 0.3); }
                .btn-reset-exact { 
                    width: 64px; border: 1.5px solid #eee; border-radius: 14px; 
                    display: flex; align-items: center; justify-content: center; color: #888; cursor: pointer; transition: 0.3s;
                }
                .btn-reset-exact:hover { background: #f5f5f5; color: #333; }

                /* Dynamic Content Area */
                .dynamic-content-below { margin-top: 40px; border-top: 1.5px solid #f0f0f0; padding-top: 35px; }
                .p-list-title { font-size: 1.1rem; font-weight: 850; color: #2b1d16; margin-bottom: 25px; letter-spacing: -0.2px; }
                
                /* Catalog Grid */
                .catalog-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .catalog-card { 
                    padding: 25px; border: 1.5px solid #eee; border-radius: 18px; cursor: pointer;
                    transition: 0.3s; position: relative; overflow: hidden;
                    display: flex; flex-direction: column; justify-content: space-between;
                    background: #fdfdfd;
                }
                .catalog-card:hover { border-color: #4e342e; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
                .catalog-card.active { border-color: #4e342e; background: #fcf8f6; }
                
                .card-badge { 
                    position: absolute; top: 0; right: 0; background: #4e342e; color: white; 
                    font-size: 0.65rem; font-weight: 800; padding: 4px 12px; border-bottom-left-radius: 10px;
                    text-transform: uppercase; letter-spacing: 0.5px;
                }
                .card-info h5 { font-size: 1rem; font-weight: 800; color: #333; margin: 0 0 8px; }
                .card-price { font-size: 1.15rem; font-weight: 900; color: #4e342e; }
                
                .btn-explore { 
                    margin-top: 20px; background: none; border: none; color: #4e342e; 
                    font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;
                    padding: 0; transition: 0.2s;
                }
                .catalog-card:hover .btn-explore { gap: 10px; color: #2b1d16; }

                /* Details View */
                .details-header { display: flex; align-items: start; flex-direction: column; gap: 15px; margin-bottom: 25px; }
                .btn-back { 
                    background: #f5f0ee; border: none; padding: 8px 16px; border-radius: 30px; 
                    color: #4e342e; font-size: 0.8rem; font-weight: 800; cursor: pointer;
                    display: flex; align-items: center; gap: 8px; transition: 0.3s;
                }
                .btn-back:hover { background: #4e342e; color: white; }

                .p-grid-small { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .p-item-tiny { display: flex; gap: 12px; align-items: center; padding: 15px; background: #f9f9f9; border-radius: 12px; transition: 0.2s; }
                .p-item-tiny.clickable { cursor: pointer; }
                .p-item-tiny.clickable:hover { background: #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.03); transform: translateY(-2px); border: 1.5px solid #4e342e; }
                .p-item-tiny img { width: 50px; height: 50px; object-fit: cover; border-radius: 8px; background: white; }
                .p-text h6 { font-size: 0.85rem; margin: 0; font-weight: 800; color: #333; }
                .p-text p { font-size: 0.75rem; color: #888; margin: 3px 0 0; font-weight: 500; }

                .fetching-msg, .no-p-msg { 
                    font-size: 0.9rem; color: #888; padding: 40px 20px; 
                    background: #fafafa; border-radius: 16px; border: 1.5px dashed #eee;
                    text-align: center; font-weight: 500;
                }

                /* Sidebar */
                .calc-sidebar-exact { 
                    flex: 1; background: #4e342e; color: white; border-radius: 20px; 
                    position: sticky; top: 20px; overflow: hidden; height: fit-content;
                    box-shadow: 0 20px 60px rgba(78, 52, 46, 0.3);
                }
                .sidebar-content { padding: 50px 40px; }
                .total-estimate-large { display: flex; align-items: flex-start; gap: 10px; margin: 25px 0 10px; }
                .total-estimate-large .curr { font-size: 2.22rem; font-weight: 700; margin-top: 12px; }
                .total-estimate-large .val { font-size: 5.5rem; font-weight: 900; line-height: 1; letter-spacing: -3px; }
                .sub-calculation { font-size: 0.9rem; opacity: 0.7; display: block; margin-bottom: 50px; }

                .breakdown-list { display: flex; flex-direction: column; gap: 25px; margin-bottom: 50px; }
                .br-row { display: flex; justify-content: space-between; align-items: center; }
                .br-item { display: flex; align-items: center; gap: 12px; font-size: 1rem; font-weight: 600; }
                .br-val { font-weight: 800; font-size: 1rem; }

                .estimation-notes-exact {
                    background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; 
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .estimation-notes-exact h4 { font-size: 0.9rem; margin-bottom: 15px; font-weight: 800; letter-spacing: 0.5px; }
                .estimation-notes-exact ul { list-style: none; padding: 0; margin: 0; }
                .estimation-notes-exact li { 
                    font-size: 0.8rem; margin-bottom: 10px; opacity: 0.8; 
                    display: flex; align-items: flex-start; gap: 8px; line-height: 1.4;
                    text-align: left;
                }
                .estimation-notes-exact li svg { flex-shrink: 0; margin-top: 2px; }

                .note-text { text-align: center; font-size: 0.85rem; color: #888; margin-top: 50px; padding: 0 20px; line-height: 1.6; }

                .products-list-below { margin-top: 40px; border-top: 1px solid #f5f5f5; padding-top: 30px; }
                .p-list-title { font-size: 1.1rem; font-weight: 800; color: #4e342e; margin-bottom: 20px; }
                .p-grid-small { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .p-item-tiny { display: flex; gap: 12px; align-items: center; padding: 12px; border: 1px solid #f8f8f8; border-radius: 10px; }
                .p-item-tiny img { width: 45px; height: 45px; object-fit: cover; border-radius: 6px; }
                .p-text h6 { font-size: 0.85rem; margin: 0; font-weight: 700; color: #333; }
                .p-text p { font-size: 0.75rem; color: #888; margin: 2px 0 0; }

                .fetching-msg, .no-p-msg { 
                    font-size: 0.9rem; color: #888; padding: 20px; 
                    background: #fdfdfd; border-radius: 10px; border: 1px dashed #eee;
                    text-align: center;
                }

                @media (max-width: 900px) {
                    .calculator-wrapper-exact { flex-direction: column; }
                    .calc-sidebar-exact { width: 100%; position: static; }
                }

                @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.6s ease-out; }
            `}</style>
        </div>
    );
};

export default CostEstimation;
