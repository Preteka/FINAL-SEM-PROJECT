import { useState, useEffect, useCallback } from 'react';
import { db } from '../../shared/services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const fetchedUsers = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(fetchedUsers);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { users, loading, error, fetchUsers };
};


