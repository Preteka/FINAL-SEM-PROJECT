import { API_BASE_URL } from '../config';

export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
};

export const fetchStats = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
};

export const fetchActivity = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/activity`);
    if (!response.ok) throw new Error('Failed to fetch activity');
    return response.json();
};
