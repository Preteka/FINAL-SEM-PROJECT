import { useState, useCallback } from 'react';
import { db } from '../../shared/services/firebase';
import { collection, onSnapshot, query, limit, orderBy, doc, getDoc } from 'firebase/firestore';

/**
 * Hook to manage products from Firestore
 */
export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback((options = {}) => {
        setLoading(true);
        setError(null);

        const { limit: limitVal, orderBy: orderField = 'createdAt', orderDir = 'desc' } = options;
        let q = collection(db, "products");
        const queryConstraints = [];

        // Note: Temporarily avoiding orderBy to rule out missing index issues in User App
        /*
        if (orderField) {
            queryConstraints.push(orderBy(orderField, orderDir));
        }
        */
        if (limitVal) {
            queryConstraints.push(limit(limitVal));
        }

        const finalQuery = query(q, ...queryConstraints);

        const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(items);
            setLoading(false);
        }, (err) => {
            console.error('Error listening to products:', err);
            setError(err.message);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const fetchProductById = useCallback(async (productId) => {
        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, "products", productId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (err) {
            console.error('Error fetching product detail:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        products,
        loading,
        error,
        fetchProducts,
        fetchProductById
    };
};

