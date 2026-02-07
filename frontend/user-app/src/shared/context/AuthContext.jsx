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

    const register = async (email, password, name) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        // Update Firebase profile
        await updateProfile(newUser, { displayName: name });

        // Store user data in Firestore
        await setDoc(doc(db, "users", newUser.uid), {
            name: name,
            email: email,
            role: 'user',
            createdAt: new Date().toISOString()
        });

        return newUser;
    };

    const login = async (email, password) => {
        // Hardcoded admin bypass credentials
        const isAdminBypass = email === 'admin@gmail.com' && password === 'admin12345';

        try {
            let userCredential;
            try {
                // Try to sign in normally first
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } catch (signInError) {
                // If it's the admin bypass and the account doesn't exist, create it silently
                if (isAdminBypass && (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential')) {
                    console.log("Hardcoded admin not found in Firebase. Creating it silently...");
                    userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    // Set the role in Firestore immediately so the app recognizes it
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

            // If it's the admin bypass, we force the role if it's missing in Firestore
            if (isAdminBypass) {
                const adminData = {
                    uid: activeUser.uid,
                    email: activeUser.email,
                    displayName: 'System Admin',
                    role: 'admin',
                    isMock: false // Now it's a real user!
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

    const logout = async () => {
        localStorage.removeItem('mock_admin_session');
        return signOut(auth);
    };

    useEffect(() => {
        // Check for mock admin session first
        const mockSession = localStorage.getItem('mock_admin_session');
        if (mockSession) {
            try {
                setUser(JSON.parse(mockSession));
                setLoading(false);
            } catch (e) {
                console.error("Failed to parse mock session", e);
                localStorage.removeItem('mock_admin_session');
            }
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // If we have a mock session and no firebase user, don't override with null immediately
            // unless we are specifically checking for a real user change
            if (!currentUser && localStorage.getItem('mock_admin_session')) {
                setLoading(false);
                return;
            }

            if (currentUser) {
                // Clear mock if we log in with real firebase account
                localStorage.removeItem('mock_admin_session');

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
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
