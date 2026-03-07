import prisma from '../../config/prisma.js';

export const getAnalyticsByTicker = async (ticker) => {
  // Ambil data dari tabel MarketAnalytics dengan join ke tabel Symbol
  const data = await prisma.marketAnalytics.findFirst({
    where: {
      symbol: {
        ticker: { equals: ticker, mode: 'insensitive' }
      }
    },
    include: { symbol: true }
  });

  if (!data) return null;

  // Kalkulasi jarak harga sekarang ke EMA 50 (Logic DSS)
  const currentPrice = parseFloat(data.price_usd);
  const ema50 = parseFloat(data.ema_50);
  const distanceToEma50 = ((currentPrice - ema50) / ema50) * 100;

  return {
    ...data,
    distance_to_ema50_pct: distanceToEma50.toFixed(2) + '%'
  };
};