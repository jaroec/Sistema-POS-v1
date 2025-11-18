const { contextBridge } = require('electron');

// Exponer APIs seguras al frontend si es necesario
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron
});