import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import '../../../index.css';

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const { login, sendOTP, verifyOTP, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirection target
    const from = location.state?.from?.pathname || "/";

    /**
     * flowSteps:
     * 0: Info Entry (Name, Email)
     * 1: OTP Verification
     * 2: Password Creation
     */
    const [regStep, setRegStep] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccessMsg('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    // Registration Flow - Step 1: Send OTP
    const handleRegisterStep1 = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await sendOTP(formData.email);
            setSuccessMsg(`OTP sent to ${formData.email}`);
            setRegStep(1);
        } catch (err) {
            setError(err.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Registration Flow - Step 2: Verify OTP
    const handleRegisterStep2 = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await verifyOTP(formData.email, formData.otp);
            setSuccessMsg("OTP verified successfully!");
            setRegStep(2);
        } catch (err) {
            setError(err.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Registration Flow - Step 3: Set Password & Finalize
    const handleRegisterStep3 = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            setSuccessMsg("Account created successfully!");
            // After successful registration, AuthContext onAuthStateChanged will handle the user state
            // But we can nudge them to home
            setTimeout(() => navigate(from, { replace: true }), 1500);
        } catch (err) {
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Toggle between Login and Registration
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setRegStep(0);
        setError('');
        setSuccessMsg('');
    };

    const renderInput = (label, icon, props) => (
        <div className="input-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }}>{icon}</span>
                <input
                    {...props}
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        outline: 'none',
                        fontSize: '1rem',
                        transition: 'var(--transition)',
                        backgroundColor: 'var(--color-gray-50)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                />
                {props.type === 'password' && (
                    <button
                        type="button"
                        onClick={() => props.name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', padding: 0, color: '#999' }}
                    >
                        {props.name === 'password' ? (showPassword ? <EyeOff size={18} /> : <Eye size={18} />) : (showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />)}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1549408929-4de79531e886?auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '20px'
        }}>
            <div className="animate-scale-in" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '40px',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-2xl)',
                width: '100%',
                maxWidth: '450px',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.3)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--color-beige)', borderRadius: '50%', marginBottom: '15px' }}>
                        <Lock size={32} color="var(--color-primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '8px' }}>
                        {isLogin ? 'Welcome Back' : (
                            regStep === 0 ? 'Create Account' :
                                regStep === 1 ? 'Verify Email' : 'Secure Account'
                        )}
                    </h2>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
                        {isLogin ? 'Login to access your premium plywood orders' : (
                            regStep === 0 ? 'Step 1: Tell us about yourself' :
                                regStep === 1 ? `Step 2: Enter code sent to your email` : 'Step 3: Create a strong password'
                        )}
                    </p>
                </div>

                {/* Notifications */}
                {(error || successMsg) && (
                    <div style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: error ? '#fff5f5' : '#f0fff4',
                        color: error ? '#c53030' : '#2f855a',
                        border: `1px solid ${error ? '#feb2b2' : '#9ae6b4'}`,
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        {error ? <div style={{ fontSize: '1.2rem' }}>⚠️</div> : <CheckCircle2 size={18} />}
                        <span>{error || successMsg}</span>
                    </div>
                )}

                {/* Forms */}
                {isLogin ? (
                    /* LOGIN FORM */
                    <form onSubmit={handleLoginSubmit}>
                        {renderInput('Email Address', <Mail size={18} />, {
                            type: 'email',
                            name: 'email',
                            placeholder: 'Email',
                            value: formData.email,
                            onChange: handleChange,
                            required: true
                        })}
                        {renderInput('Password', <Lock size={18} />, {
                            type: showPassword ? 'text' : 'password',
                            name: 'password',
                            placeholder: '••••••••',
                            value: formData.password,
                            onChange: handleChange,
                            required: true
                        })}
                        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '500' }}>Forgot password?</a>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)' }}
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
                        </button>
                    </form>
                ) : (
                    /* REGISTRATION FLOW */
                    <div>
                        {regStep === 0 && (
                            <form onSubmit={handleRegisterStep1}>
                                {renderInput('Full Name', <User size={18} />, {
                                    type: 'text',
                                    name: 'name',
                                    placeholder: 'Annu Sri',
                                    value: formData.name,
                                    onChange: handleChange,
                                    required: true
                                })}
                                {renderInput('Email Address', <Mail size={18} />, {
                                    type: 'email',
                                    name: 'email',
                                    placeholder: 'email@example.com',
                                    value: formData.email,
                                    onChange: handleChange,
                                    required: true
                                })}
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)' }}
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : (
                                        <>Send OTP <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>
                        )}

                        {regStep === 1 && (
                            <form onSubmit={handleRegisterStep2}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: 'var(--color-primary-dark)', textAlign: 'center' }}>
                                        Enter 6-Digit OTP
                                    </label>
                                    <input
                                        type="text"
                                        name="otp"
                                        maxLength="6"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                        style={{
                                            textAlign: 'center',
                                            fontSize: '1.5rem',
                                            letterSpacing: '8px',
                                            fontWeight: '700',
                                            color: 'var(--color-primary)'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setRegStep(0)}
                                        className="btn btn-outline"
                                        style={{ flex: 1 }}
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                        style={{ flex: 3 }}
                                    >
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Verify Code'}
                                    </button>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                    <button
                                        type="button"
                                        onClick={handleRegisterStep1}
                                        disabled={loading}
                                        style={{ background: 'none', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: '600' }}
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </form>
                        )}

                        {regStep === 2 && (
                            <form onSubmit={handleRegisterStep3}>
                                {renderInput('New Password', <Lock size={18} />, {
                                    type: showPassword ? 'text' : 'password',
                                    name: 'password',
                                    placeholder: 'Create password',
                                    value: formData.password,
                                    onChange: handleChange,
                                    required: true
                                })}
                                {renderInput('Confirm Password', <Lock size={18} />, {
                                    type: showConfirmPassword ? 'text' : 'password',
                                    name: 'confirmPassword',
                                    placeholder: 'Confirm password',
                                    value: formData.confirmPassword,
                                    onChange: handleChange,
                                    required: true
                                })}
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)' }}
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : 'Finish Setup'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* Footer Link */}
                <div style={{
                    marginTop: '30px',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--color-border)',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                        {isLogin ? "New to Vinayaga Plywood?" : "Already Have an Account?"}
                        <button
                            onClick={toggleMode}
                            style={{
                                background: 'none',
                                color: 'var(--color-primary)',
                                fontWeight: '700',
                                marginLeft: '8px',
                                textDecoration: 'underline'
                            }}
                        >
                            {isLogin ? 'Create Account' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
