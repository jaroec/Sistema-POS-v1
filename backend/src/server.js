// ============================================
// SERVIDOR PRINCIPAL - ES MODULES
// ============================================

// Backend/src/server.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde la raíz
dotenv.config({ path: path.join(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/exchange-rates', exchangeRateRoutes);
app.use('/api/users', usersRoutes);

// Sincronizar base de datos
sequelize.sync({ alter: false })
  .then(() => console.log('✅ Base de datos sincronizada'))
  .catch(err => {
    console.error('❌ Error al sincronizar BD:', err.message);
    process.exit(1);
  });

// Conectar a la BD
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🧪 Test: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con la BD:', err.message);
    process.exit(1);
  });

export default app;
