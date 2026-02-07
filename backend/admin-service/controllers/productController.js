import fs from 'fs';
import path from 'path';
import { DB_PATH } from '../config/dbConfig.js';

const readData = (filename) => {
    const filePath = path.join(DB_PATH, filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeData = (filename, data) => {
    const filePath = path.join(DB_PATH, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
};

export const getProducts = (req, res) => {
    try {
        const productsData = readData('products.json');
        // Flatten the object of category arrays into a single array
        const allProducts = Object.keys(productsData).reduce((acc, category) => {
            const itemsWithCategory = productsData[category].map(item => ({
                ...item,
                category // Add category back to product object
            }));
            return [...acc, ...itemsWithCategory];
        }, []);
        res.json(allProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const createProduct = (req, res) => {
    try {
        const newProduct = req.body;
        const productsData = readData('products.json');
        const category = newProduct.category;

        if (!productsData[category]) {
            productsData[category] = [];
        }

        newProduct.id = `${category.charAt(0)}${Date.now()}`;
        const categoryToAdd = newProduct.category;
        const { category: _, ...productToSave } = newProduct;

        productsData[categoryToAdd].push(productToSave);
        writeData('products.json', productsData);
        res.status(201).json(productToSave);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save product' });
    }
};
