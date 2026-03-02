import app from './app.js';
import prisma from './config/prisma.js';
import { startJobSet } from './jobs/priceJob.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 1. Tes koneksi database
    await prisma.$connect();
    console.log('✔ Database connected successfully');
    //2.  Job set
    startJobSet();

    // 3. Jalankan server
    app.listen(PORT, () => {
      console.log(`
        DivineIT Trading DSS Server Started!
        Port: ${PORT}
        URL: http://localhost:${PORT}
      `);
    });
  } catch (error) {
    console.error('✖ Failed to start server:');
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();