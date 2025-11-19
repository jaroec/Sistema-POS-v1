// src/config/database.js
// Backend/src/config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde la raíz del proyecto
dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('📍 Cargando .env desde:', path.join(__dirname, '../../.env'));
console.log('DATABASE_URL disponible:', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL no está definida en .env');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false,
    useUTC: true,
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize;
