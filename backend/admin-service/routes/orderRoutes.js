import express from 'express';
import { getStats, getLatestOrders, getActivity } from '../controllers/orderController.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/latest-orders', getLatestOrders);
router.get('/activity', getActivity);

export default router;
