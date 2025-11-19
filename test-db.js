import dotenv from 'dotenv';
dotenv.config();

import sequelize from './backend/src/config/database.js';

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL exitosa');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    process.exit(1);
  });