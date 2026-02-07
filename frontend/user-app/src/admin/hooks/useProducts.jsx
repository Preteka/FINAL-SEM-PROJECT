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

        const { limit: limitVal, orderBy: orderField, orderDir = 'desc' } = options;
        let q = collection(db, "products");
        const queryConstraints = [];

        if (orderField) {
            queryConstraints.push(orderBy(orderField, orderDir));
        }
        if (limitVal) {
            queryConstraints.push(limit(limitVal));
        }

        const finalQuery = query(q, ...queryConstraints);

        // Use onSnapshot for real-time updates
        const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
            console.log(`Firestore Fetch: ${querySnapshot.size} products found`);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Debug: Log product names
            if (items.length > 0) {
                console.log("Sample product names:", items.slice(0, 3).map(p => p.name));
            } else {
                console.log("No products returned from Firestore query.");
            }

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


