// src/utils/bcrypt.js
const bcrypt = require('bcrypt');

module.exports = {
  hash: (pw) => bcrypt.hash(pw, 10),
  compare: (pw, hash) => bcrypt.compare(pw, hash)
};
