import cron from 'node-cron';
import axios from 'axios';
import prisma from '../config/prisma.js';
import dotenv from 'dotenv';

dotenv.config();

const fetchPrices = async () => {
  try {
    // 1. Ambil list koin dari database
    const symbols = await prisma.symbol.findMany();
    if (symbols.length === 0) {
      console.log('⚠️ [PriceJob] Tidak ada simbol koin di database.');
      return;
    }

    // Pastikan semua ticker jadi Uppercase dan gabung pake koma
    const tickers = symbols.map(s => s.ticker.toUpperCase().trim()).join(',');

    // 2. Tembak API CoinMarketCap (1 Request buat semua koin)
    const response = await axios.get(`${process.env.BASE_URL}/cryptocurrency/quotes/latest`, {
      params: { symbol: tickers, convert: 'USD' },
      headers: { 'X-CMC_PRO_API_KEY': process.env.API_KEY }
    });

    const data = response.data.data;

    // 3. Mapping data untuk disimpan ke table price
    const priceEntries = symbols.map(symbol => {
      // SINKRONISASI KEY: Paksa cari pake huruf besar biar pas sama JSON CMC
      const tickerKey = symbol.ticker.trim();
      const cryptoData = data[tickerKey];

      if (!cryptoData) {
        console.log(`❌ [PriceJob] Data untuk ${tickerKey} tidak ditemukan di respon API.`);
        return null;
      }

      return {
        symbol_id: symbol.id,
        price: cryptoData.quote.USD.price,
        interval: '1m',
        // timestamp otomatis diisi default now() oleh Prisma/DB
      };
    }).filter(entry => entry !== null); // Buang yang null (gagal fetch)

    // 4. Batch Insert (Hemat Query SQL)
    if (priceEntries.length > 0) {
      await prisma.price.createMany({
        data: priceEntries,
        skipDuplicates: true // Biar gak error kalau ada ID/Timestamp bentrok
      });
      
      const savedTickers = symbols
        .filter(s => priceEntries.some(e => e.symbol_id === s.id))
        .map(s => s.ticker)
        .join(', ');

      console.log(`✅ [${new Date().toLocaleTimeString()}] Saved ${priceEntries.length} prices: (${savedTickers})`);
    } else {
      console.log(`⚠️ [${new Date().toLocaleTimeString()}] Tidak ada data harga yang valid untuk disimpan.`);
    }

  } catch (error) {
    // Tangkap error API CMC (misal: 401 Unauthorized atau 400 Bad Request)
    const errorMsg = error.response?.data?.status?.error_message || error.message;
    console.error('❌ Price Job Error:', errorMsg);
  }
};

// Running tiap 1 menit
// const priceJob = cron.schedule('* * * * *', fetchPrices);
const priceJob = console.log('This Feature is under maintenance.');

export default priceJob;