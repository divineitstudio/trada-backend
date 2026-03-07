import cron from 'node-cron';
import prisma from '../config/prisma.js';

// Fungsi helper hitung EMA dari array harga
const calculateEMAFromArray = (prices, period) => {
  if (prices.length < period) return prices[0]; // Belum cukup data, pake harga awal
  
  const k = 2 / (period + 1);
  // Dimulai dari SMA (Simple Moving Average) sebagai bibit pertama
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  // Lanjut hitung EMA untuk sisa datanya
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] * k) + (ema * (1 - k));
  }
  return ema;
};

const updateMarketAnalytics = async () => {
  try {
    console.log(`[${new Date().toLocaleTimeString()}] 📈 Calculating Indicators from Price Table...`);
    
    const symbols = await prisma.symbol.findMany();
    const USD_TO_IDR = 16100;

    for (const symbol of symbols) {
      // 1. Ambil 200 data harga terakhir dari tabel price (buat EMA 200)
      // Data diurutkan dari yang terlama ke terbaru (asc) buat itung EMA
      const priceHistory = await prisma.price.findMany({
        where: { symbol_id: symbol.id },
        orderBy: { timestamp: 'desc' },
        take: 200
      });

      if (priceHistory.length === 0) continue;

      // Balik urutan jadi terlama -> terbaru untuk perhitungan
      const prices = priceHistory.map(p => parseFloat(p.price)).reverse();
      const currentPrice = prices[prices.length - 1];
      const prevPrice = prices[prices.length - 2] || currentPrice;

      // 2. Hitung semua EMA langsung dari array prices
      const ema20 = calculateEMAFromArray(prices, 20);
      const ema50 = calculateEMAFromArray(prices, 50);
      const ema100 = calculateEMAFromArray(prices, 100);
      const ema200 = calculateEMAFromArray(prices, 200);

      // 3. Hitung Change
      const pointChange = currentPrice - prevPrice;
      const pctChange = ((currentPrice - prevPrice) / prevPrice) * 100;

      // 4. Logika Trend (DSS)
      let trend = 'NEUTRAL';
      if (currentPrice > ema200 && ema20 > ema50) trend = 'STRONG BULLISH';
      else if (ema20 > ema50) trend = 'UPTREND';
      else if (ema20 < ema50) trend = 'DOWNTREND';

      // 5. Update ke market_analytics
      await prisma.marketAnalytics.upsert({
        where: { symbol_id: symbol.id },
        update: {
          price_usd: currentPrice,
          price_idr: currentPrice * USD_TO_IDR,
          pct_change_1h: pctChange,
          point_change_1h: pointChange,
          ema_20: ema20,
          ema_50: ema50,
          ema_100: ema100,
          ema_200: ema200,
          trend_status: trend,
          updated_at: new Date()
        },
        create: {
          symbol_id: symbol.id,
          price_usd: currentPrice,
          price_idr: currentPrice * USD_TO_IDR,
          pct_change_1h: pctChange,
          point_change_1h: pointChange,
          ema_20: ema20,
          ema_50: ema50,
          ema_100: ema100,
          ema_200: ema200,
          trend_status: trend
        }
      });
    }

    console.log(`✅ [${new Date().toLocaleTimeString()}] Analytics Re-calculated from Price Source.`);
  } catch (error) {
    console.error('❌ Analytics Job Error:', error.message);
  }
};

const marketAnalyticsJob = cron.schedule('*/10 * * * *', updateMarketAnalytics);
export default marketAnalyticsJob;