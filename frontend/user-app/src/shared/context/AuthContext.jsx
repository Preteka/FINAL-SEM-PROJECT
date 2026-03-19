import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const register = async (name, email, password) => {
        try {
            // 1. Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // 2. Update Firebase profile
            await updateProfile(firebaseUser, { displayName: name });

            // 3. Store user data in Firestore
            const firstName = name.split(' ')[0];
            const lastName = name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : '';

            await setDoc(doc(db, "users", firebaseUser.uid), {
                uid: firebaseUser.uid,
                name: name,
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: 'user',
                createdAt: new Date().toISOString()
            });

            // 4. Record user in local backend database (users.json)
            await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, password })
            });

            return firebaseUser;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const login = async (email, password) => {
        const isAdminBypass = email === 'admin@gmail.com' && password === 'admin12345';

        try {
            let userCredential;
            try {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } catch (signInError) {
                if (isAdminBypass && (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential')) {
                    userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        name: 'System Admin',
                        email: email,
                        role: 'admin',
                        createdAt: new Date().toISOString()
                    });
                } else {
                    throw signInError;
                }
            }

            const activeUser = userCredential.user;

            if (isAdminBypass) {
                const adminData = {
                    uid: activeUser.uid,
                    email: activeUser.email,
                    displayName: 'System Admin',
                    role: 'admin',
                    isMock: false
                };
                setUser(adminData);
                localStorage.setItem('mock_admin_session', JSON.stringify(adminData));
                return adminData;
            }

            return activeUser;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const sendOTP = async (email) => {
        const response = await fetch('http://localhost:5000/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
        return data;
    };

    const registerUser = async (email, name) => {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return data;
    };

    const verifyOTP = async (email, otp) => {
        const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Verification failed');
        return data; // Success: true
    };

    const logout = async () => {
        localStorage.removeItem('mock_admin_session');
        localStorage.removeItem('auth_user_otp');
        setUser(null); // Force state update for the UI immediately
        try {
            return await signOut(auth);
        } catch (e) {
            console.error('Firebase signout error:', e);
            // Even if Firebase fails (e.g. not logged in to Firebase), we still want to log out of the mock session
            return;
        }
    };

    useEffect(() => {
        // Check for mock admin session or regular OTP session first
        const mockAdminSession = localStorage.getItem('mock_admin_session');
        const mockUserSession = localStorage.getItem('auth_user_otp');

        if (mockAdminSession) {
            try {
                setUser(JSON.parse(mockAdminSession));
                setLoading(false);
                return;
            } catch (e) {
                console.error("Failed to parse mock session", e);
                localStorage.removeItem('mock_admin_session');
            }
        } else if (mockUserSession) {
            try {
                setUser(JSON.parse(mockUserSession));
                setLoading(false);
                return;
            } catch (e) {
                console.error("Failed to parse mock user session", e);
                localStorage.removeItem('auth_user_otp');
            }
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // If we have a mock session and no firebase user, don't override with null immediately
            if (!currentUser && (localStorage.getItem('mock_admin_session') || localStorage.getItem('auth_user_otp'))) {
                setLoading(false);
                return;
            }

            if (currentUser) {
                // Clear mock if we log in with real firebase account
                localStorage.removeItem('mock_admin_session');
                localStorage.removeItem('auth_user_otp');

                // Fetch additional user data from Firestore if needed
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                const userData = userDoc.exists() ? userDoc.data() : {};
                setUser({ ...currentUser, ...userData });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        register,
        registerUser,
        login,
        logout,
        sendOTP,
        verifyOTP,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
