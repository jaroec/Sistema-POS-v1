// src/utils/codes.js
function generateSaleCode() {
  return 'S' + Date.now();
}
module.exports = { generateSaleCode };
