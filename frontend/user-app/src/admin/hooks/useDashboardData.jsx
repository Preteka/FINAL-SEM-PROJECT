import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../../shared/services/firebase';

export const useDashboardData = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockCount: 0,
        totalOrders: 0,
        totalUsers: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribers = [];

        // Subscribe to products collection
        const productsQuery = query(collection(db, 'products'));
        const unsubProducts = onSnapshot(productsQuery, (snapshot) => {
            const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const lowStock = products.filter(p => Number(p.stockCount) < 10 && Number(p.stockCount) > 0);

            setStats(prev => ({
                ...prev,
                totalProducts: products.length,
                lowStockCount: lowStock.length
            }));

            setLowStockItems(lowStock.slice(0, 5)); // Top 5 low stock items
        });
        unsubscribers.push(unsubProducts);

        // Subscribe to users collection
        const usersQuery = query(collection(db, 'users'));
        const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
            setStats(prev => ({
                ...prev,
                totalUsers: snapshot.size
            }));
        });
        unsubscribers.push(unsubUsers);

        // Fetch orders (if collection exists)
        const fetchOrders = async () => {
            try {
                const ordersSnapshot = await getDocs(collection(db, 'orders'));
                const orders = ordersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Sort by createdAt descending
                const sortedOrders = orders.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                    return dateB - dateA;
                });

                setRecentOrders(sortedOrders.slice(0, 5)); // Top 5 recent orders
                setStats(prev => ({
                    ...prev,
                    totalOrders: orders.length
                }));
            } catch (error) {
                console.log('Orders collection might not exist yet:', error);
                setRecentOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, []);

    return { stats, recentOrders, lowStockItems, loading };
};
