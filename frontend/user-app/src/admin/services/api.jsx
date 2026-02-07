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

export const createProduct = async (product) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
};

export const updateProduct = async (id, product) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
};

