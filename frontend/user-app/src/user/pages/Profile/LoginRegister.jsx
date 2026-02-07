import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import '../../../index.css';

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirection target
    const from = location.state?.from?.pathname || "/";

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                navigate(from, { replace: true });
            } else {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                await register(formData.email, formData.password, formData.name);
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred during authentication");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url("https://images.unsplash.com/photo-1549408929-4de79531e886?auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            paddingTop: '80px' // Offset for fixed header
        }}>
            {/* Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(93, 64, 55, 0.65)', // var(--color-primary) with opacity
                backdropFilter: 'blur(4px)'
            }}></div>

            <div style={{
                backgroundColor: 'var(--color-white)',
                padding: '50px',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                width: '100%',
                maxWidth: '480px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '10px' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ color: '#666' }}>
                        {isLogin ? 'Enter your details to sign in' : 'Join us for premium quality wood products'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {error && (
                        <div style={{
                            padding: '10px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Name Field (Register Only) */}
                    {!isLogin && (
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#444' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={20} color="#999" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#444' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} color="#999" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#444' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} color="#999" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 40px 12px 40px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer', color: '#999' }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>
                    </div>

                    {/* Confirm Password Field (Register Only) */}
                    {!isLogin && (
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#444' }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={20} color="#999" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 40px 12px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Links Row */}
                    {isLogin && (
                        <div style={{ textAlign: 'right' }}>
                            <Link to="#" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: '500' }}>
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        {loading && <Loader2 size={20} className="animate-spin" />}
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            color: 'var(--color-primary)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
