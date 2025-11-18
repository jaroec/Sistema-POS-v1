// src/utils/date.js
module.exports = {
  nowISO: () => new Date().toISOString(),
  todaySQL: () => new Date().toISOString().split('T')[0]
};
