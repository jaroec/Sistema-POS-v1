// ============================================
// SERVIDOR PRINCIPAL - ES MODULES
// ============================================

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { testConnection } from './config/database.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// RUTAS
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: '✅ API Sistema POS funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: dbConnected ? 'healthy' : 'unhealthy',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Montar rutas de la API
app.use('/api', routes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo global de errores
app.use(errorHandler);

// ============================================
// INICIAR SERVIDOR
// ============================================

const startServer = async () => {
  try {
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log('🚀 SERVIDOR INICIADO');
      console.log('='.repeat(50));
      console.log(`📡 Puerto: ${PORT}`);
      console.log(`🌍 URL: http://localhost:${PORT}`);
      console.log(`💾 Base de datos: ${process.env.DB_NAME}`);
      console.log('='.repeat(50) + '\n');
    });
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

startServer();

export default app;
