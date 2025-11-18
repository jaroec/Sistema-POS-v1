// src/app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config({ path: __dirname + '/../.env' });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ message: 'API Sistema POS' }));

// mount API routes
app.use('/api', routes);

// health
const { testConnection } = require('./config/database');
app.get('/api/health', async (req, res) => {
  const ok = await testConnection();
  res.json({ status: ok ? 'ok' : 'error' });
});

// global error handler (last middleware)
app.use(errorHandler);

module.exports = app;
