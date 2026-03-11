import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ROOT ROUTE (ADD THIS)
app.get("/", (req, res) => {
    res.send("User Service API is running 🚀");
});

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleString()} - ${req.method} ${req.url}`);
    next();
});

import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';

app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
