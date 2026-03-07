import express from 'express';
import * as marketController from './market.controller.js';

const router = express.Router();

// Route untuk ringkasan harga (USD, IDR, Change)
router.get('/summary/:symbol', marketController.getMarketSummary);

// Route untuk analisa teknikal (EMA, Trend, Distance)
router.get('/analytic/:symbol', marketController.getMarketAnalytic);

export default router;