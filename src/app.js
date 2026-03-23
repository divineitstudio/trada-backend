import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import infoRoutes from './features/information/info.routes.js';
import signalRoutes from './features/signal/signal.routes.js';

// Import Middlewares & Routes
import { errorHandler } from './middlewares/error.handler.js';
// import authRoutes from './features/auth/auth.routes.js'; // Nanti diuncomment kalau file sudah ada

dotenv.config();

const app = express();

// --- Global Middlewares ---
app.use(helmet());                // Security headers
app.use(cors());                  // Allow cross-origin requests
app.use(morgan('dev'));           // Logger
app.use(express.json());          // Parse JSON body
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({ 
      success: true, 
      message: 'DivineIT Trading DSS API is running' 
    });
  });
// --- Health Check ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'DivineIT Trading DSS API is running' });
});

//Information Routes
app.use('/information', infoRoutes);
app.use('/signal', signalRoutes);
// --- API Routes ---
// app.use('/api/auth', authRoutes);
// app.use('/api/market', marketRoutes);

// --- Error Handling ---
app.use(errorHandler);

export default app;