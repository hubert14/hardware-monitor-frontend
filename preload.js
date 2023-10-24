const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('profilesApi', {
  updateProfiles: (callback) => ipcRenderer.on('update-profiles', callback),
  updateHardware: (callback) => ipcRenderer.on('update-hardware', callback)
})