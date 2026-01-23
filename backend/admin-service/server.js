import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/admin', orderRoutes); // stats, latest-orders, activity
app.use('/api/admin', inventoryRoutes); // low-stock

app.listen(PORT, () => {
    console.log(`Admin Service running on port ${PORT}`);
});
