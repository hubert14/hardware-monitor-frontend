const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appAPI', {
  updateProfiles: (callback) => ipcRenderer.on('update-profiles', callback),
  updateHardware: (callback) => ipcRenderer.on('update-hardware', callback),
  updateSensors: (callback) => ipcRenderer.on('update-sensors', callback)
})