import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging to show the user that the server is alive and receiving requests
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
    console.log('Press Ctrl+C to stop the server.');
});

// Diagnostic listeners to catch why the process might be exiting
process.on('uncaughtException', (err) => {
    console.error('CRITICAL ERROR (Uncaught Exception):', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL ERROR (Unhandled Rejection):', reason);
});
