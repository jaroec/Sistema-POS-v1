// src/config/database.js
import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Evento cuando se conecta
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

// Evento de error
pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en PostgreSQL:', err);
  process.exit(-1);
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('🔗 Conexión a BD exitosa:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la BD:', error.message);
    return false;
  }
};

// Función helper para consultas
const query = (text, params) => pool.query(text, params);

// Función helper para transacciones
const getClient = () => pool.connect();

export {
  query,
  getClient,
  pool,
  testConnection
};

export default {
  query,
  getClient,
  pool,
  testConnection
};
