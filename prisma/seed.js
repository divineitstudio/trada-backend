import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Demo User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const demoUser = await prisma.user.upsert({
    where: { email: 'admin@tradebackend.local' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@tradebackend.local',
      password_hash: passwordHash,
    },
  });
  console.log(`✔ User seeded: ${demoUser.username}`);

  // 2. Seed Crypto Symbols
  const symbolsData = [
    { ticker: 'BTC', name: 'Bitcoin', category: 'Crypto', icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    { ticker: 'ETH', name: 'Ethereum', category: 'Crypto', icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    { ticker: 'SOL', name: 'Solana', category: 'Crypto', icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
    { ticker: 'BNB', name: 'BNB', category: 'Crypto', icon: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  ];

  const symbols = {};
  for (const s of symbolsData) {
    const symbol = await prisma.symbol.upsert({
      where: { ticker: s.ticker },
      update: s,
      create: s,
    });
    symbols[s.ticker] = symbol;
    console.log(`✔ Symbol seeded: ${symbol.ticker} (${symbol.name})`);
  }

  // 3. Seed Market Analytics
  const analyticsData = [
    {
      symbol_id: symbols['BTC'].id,
      price_usd: 67500.50,
      price_idr: 1086758050.00,
      pct_change_1h: 1.25,
      point_change_1h: 830.50,
      ema_20: 67200.00,
      ema_50: 66800.00,
      ema_100: 65500.00,
      ema_200: 63000.00,
      trend_status: 'STRONG BULLISH',
    },
    {
      symbol_id: symbols['ETH'].id,
      price_usd: 3520.80,
      price_idr: 56684880.00,
      pct_change_1h: 0.85,
      point_change_1h: 29.80,
      ema_20: 3500.00,
      ema_50: 3450.00,
      ema_100: 3380.00,
      ema_200: 3200.00,
      trend_status: 'UPTREND',
    },
    {
      symbol_id: symbols['SOL'].id,
      price_usd: 182.40,
      price_idr: 2936640.00,
      pct_change_1h: -0.45,
      point_change_1h: -0.82,
      ema_20: 183.00,
      ema_50: 180.00,
      ema_100: 175.00,
      ema_200: 160.00,
      trend_status: 'NEUTRAL',
    },
  ];

  for (const a of analyticsData) {
    await prisma.marketAnalytics.upsert({
      where: { symbol_id: a.symbol_id },
      update: a,
      create: a,
    });
  }
  console.log(`✔ Market analytics seeded for BTC, ETH, SOL`);

  // 4. Seed Sample Prices
  await prisma.price.createMany({
    data: [
      { symbol_id: symbols['BTC'].id, interval: '1m', price: 67450.00 },
      { symbol_id: symbols['BTC'].id, interval: '1m', price: 67500.50 },
      { symbol_id: symbols['ETH'].id, interval: '1m', price: 3510.00 },
      { symbol_id: symbols['ETH'].id, interval: '1m', price: 3520.80 },
    ],
    skipDuplicates: true,
  });
  console.log(`✔ Sample price history seeded`);

  // 5. Seed Information / News
  await prisma.information.createMany({
    data: [
      {
        sender_id: demoUser.id,
        title: 'Global Market Sentiment: Bullish Momentum Ahead of FOMC',
        body: 'Institutional net inflows hit a 3-month high as macroeconomic conditions stabilize.',
      },
      {
        sender_id: demoUser.id,
        title: 'Bitcoin Hashrate Reaches New All-Time High',
        body: 'Miners continue to expand operations post-halving with improved hardware efficiency.',
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✔ Market news / information seeded`);

  // 6. Seed Sample Signals
  await prisma.signal.createMany({
    data: [
      {
        symbol: 'BTC',
        sender_id: demoUser.id,
        type: 'Long',
        entry_price: 67200.00,
        sl_price: 66000.00,
        tp_price: 70000.00,
        status: 'active',
      },
      {
        symbol: 'ETH',
        sender_id: demoUser.id,
        type: 'Long',
        entry_price: 3480.00,
        sl_price: 3380.00,
        tp_price: 3750.00,
        status: 'running',
      },
      {
        symbol: 'SOL',
        sender_id: demoUser.id,
        type: 'Short',
        entry_price: 185.00,
        sl_price: 192.00,
        tp_price: 172.00,
        status: 'active',
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✔ Trading signals seeded`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('✖ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

