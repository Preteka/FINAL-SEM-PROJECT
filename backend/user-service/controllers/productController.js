import fs from 'fs';
import path from 'path';
import { DB_PATH } from '../config/dbConfig.js';

const readData = (filename) => {
    const filePath = path.join(DB_PATH, filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

export const getProducts = (req, res) => {
    try {
        const products = readData('products.json');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
