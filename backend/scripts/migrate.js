// scripts/migrate.js
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const sqlFile = path.resolve(__dirname, '../database.sql'); // ajusta si tu SQL está en otra ruta

const cmd = `psql "postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}" -f "${sqlFile}"`;

console.log('Running migration:', cmd);

exec(cmd, (err, stdout, stderr) => {
  if (err) {
    console.error('Migration failed:', err);
    console.error(stderr);
    process.exit(1);
  }
  console.log('Migration applied:');
  console.log(stdout);
  process.exit(0);
});
