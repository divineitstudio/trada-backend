import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

import infoRoutes from './features/information/info.routes.js';
import signalRoutes from './features/signal/signal.routes.js';
import marketRoutes from './features/market/market.routes.js';

// Import Middlewares & Routes
import { errorHandler } from './middlewares/error.handler.js';
// import authRoutes from './features/auth/auth.routes.js'; // Nanti diuncomment kalau file sudah ada

dotenv.config();

const app = express();

// --- Global Middlewares ---
app.use(helmet({ contentSecurityPolicy: false })); // Allow Swagger UI inline scripts & styles
app.use(cors());                                  // Allow cross-origin requests
app.use(morgan('dev'));                           // Logger
app.use(express.json());                          // Parse JSON body
app.use(express.urlencoded({ extended: true }));

// --- Swagger Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'DivineIT Trading DSS - API Docs',
}));

app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'DivineIT Trading DSS API is running',
    docs: '/api-docs'
  });
});

// --- Health Check ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'DivineIT Trading DSS API is running' });
});

// --- Feature Routes ---
app.use('/information', infoRoutes);
app.use('/signal', signalRoutes);
app.use('/market', marketRoutes);

// --- Error Handling ---
app.use(errorHandler);

export default app;
