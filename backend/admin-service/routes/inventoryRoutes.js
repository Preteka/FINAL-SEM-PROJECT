import express from 'express';
import { getLowStock } from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/low-stock', getLowStock);

export default router;
