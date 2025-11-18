// src/config/logger.js
const util = require('util');

function formatArg(a) {
  if (typeof a === 'object') return util.inspect(a, { depth: 2, colors: false });
  return a;
}

function log(level, ...args) {
  const ts = new Date().toISOString();
  const message = args.map(formatArg).join(' ');
  console.log(`${ts} [${level.toUpperCase()}] ${message}`);
}

module.exports = {
  info: (...args) => log('info', ...args),
  warn: (...args) => log('warn', ...args),
  error: (...args) => log('error', ...args),
};
