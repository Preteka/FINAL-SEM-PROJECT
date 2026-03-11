import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Admin Service API is running 🚀");
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    service: "Admin Service",
    status: "OK"
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/admin', orderRoutes);
app.use('/api/admin', inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Admin Service running on port ${PORT}`);
});
