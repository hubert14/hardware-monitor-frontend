const { app, BrowserWindow, screen } = require('electron')
const steamService = require('./src/services/steamService');
const hardwareService = require('./src/services/hardwareService');
const { settings } = require('./settings.js')
const path = require('path')
try {
    require('electron-reloader')(module)
  } catch (_) {}

function createWindow () {
  const displays = screen.getAllDisplays();
  const targetDisplay = displays[settings.window.targetDisplay];

  const mainWindow = new BrowserWindow({
    x: targetDisplay.bounds.x + settings.window.x,
    y: targetDisplay.bounds.y + settings.window.y,
    width: settings.window.width,
    height: settings.window.height,
    alwaysOnTop: true,
    skipTaskbar: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const updateInterval = 5_000;
  setInterval(async () => {
    const result = await steamService.getProfiles();
    hardwareService.updateHardwareInfo(hardwareInfo => mainWindow.webContents.send('update-hardware', hardwareInfo));
    mainWindow.webContents.send('update-profiles', JSON.stringify(result));
  }, updateInterval);

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})