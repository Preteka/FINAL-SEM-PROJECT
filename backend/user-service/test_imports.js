import 'dotenv/config';
console.log("1. dotenv loaded");
import express from 'express';
console.log("2. express loaded");
import cors from 'cors';
console.log("3. cors loaded");
import productRoutes from './routes/productRoutes.js';
console.log("4. productRoutes loaded");
import chatRoutes from './routes/chatRoutes.js';
console.log("5. chatRoutes loaded");
import authRoutes from './routes/authRoutes.js';
console.log("6. authRoutes loaded");
import paymentRoutes from './routes/paymentRoutes.js';
console.log("7. paymentRoutes loaded");

const app = express();
console.log("8. app created");
