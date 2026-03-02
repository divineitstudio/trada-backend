import cron from 'node-cron';
import axios from 'axios';
import prisma from '../config/prisma.js';
import * as marketService from '../features/market/market.service.js'; // Import service-nya

const fetchPrices = async () => {
  try {
    const symbols = await prisma.symbol.findMany();
    if (symbols.length === 0) return;

    const tickers = symbols.map(s => s.ticker).join(',');
    const response = await axios.get(`${process.env.BASE_URL}/cryptocurrency/quotes/latest`, {
      params: { symbol: tickers, convert: 'USD' },
      headers: { 'X-CMC_PRO_API_KEY': process.env.API_KEY }
    });

    const data = response.data.data;

    for (const symbol of symbols) {
      const cryptoData = data[symbol.ticker];
      if (!cryptoData) continue;

      const currentPrice = cryptoData.quote.USD.price;

      // 1. Cuma simpan data mentah (Price History)
      await prisma.price.create({
        data: {
          symbol_id: symbol.id,
          price: currentPrice,
          interval: '1m'
        }
      });

      // 2. Suruh Market Service buat update analytics (EMA, Trend, dll)
      // Kita kirim datanya ke sana biar diolah di folder market
      await marketService.updateMarketAnalytics(symbol.id, cryptoData);
    }

    console.log(`✅ [${new Date().toLocaleTimeString()}] Raw prices saved. Analytics delegated to Market Service.`);
  } catch (error) {
    console.error('❌ Price Job Error:', error.message);
  }
};

const priceJob = cron.schedule('* * * * *', fetchPrices);
export default priceJob;