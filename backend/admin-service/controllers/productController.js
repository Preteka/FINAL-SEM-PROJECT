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
        const products = readData('products.json');
        res.json(products);
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
