import { useState, useEffect, useCallback } from 'react';
import { collection, query, getDocs, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../shared/services/firebase';

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(ordersData);
            setError(null);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteOrder = async (orderId) => {
        try {
            await deleteDoc(doc(db, 'orders', orderId));
            return { success: true };
        } catch (err) {
            console.error("Error deleting order:", err);
            return { success: false, error: err.message };
        }
    };

    useEffect(() => {
        // Use real-time listener for orders
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(ordersData);
            setLoading(false);
        }, (err) => {
            console.error("Orders listener error:", err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { orders, loading, error, fetchOrders, deleteOrder };
};

