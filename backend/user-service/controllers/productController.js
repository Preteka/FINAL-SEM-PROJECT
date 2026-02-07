import fs from 'fs';
import path from 'path';
import { DB_PATH } from '../config/dbConfig.js';

const readData = (filename) => {
    const filePath = path.join(DB_PATH, filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

export const getProducts = (req, res) => {
    try {
        const productsData = readData('products.json');
        // Flatten the object of category arrays into a single array
        const allProducts = Object.keys(productsData).reduce((acc, category) => {
            const itemsWithCategory = productsData[category].map(item => ({
                ...item,
                category
            }));
            return [...acc, ...itemsWithCategory];
        }, []);
        res.json(allProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
