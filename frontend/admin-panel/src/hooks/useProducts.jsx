import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, limit, orderBy, doc, getDoc } from 'firebase/firestore';

/**
 * Hook to manage products from Firestore
 */
export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async (options = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { limit: limitVal, orderBy: orderField = 'createdAt', orderDir = 'desc' } = options;

            let q = collection(db, "products");

            const queryConstraints = [];
            if (orderField) {
                queryConstraints.push(orderBy(orderField, orderDir));
            }
            if (limitVal) {
                queryConstraints.push(limit(limitVal));
            }

            const finalQuery = query(q, ...queryConstraints);
            const querySnapshot = await getDocs(finalQuery);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setProducts(items);
            return items;
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
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
            console.error('Error fetching product:', err);
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
