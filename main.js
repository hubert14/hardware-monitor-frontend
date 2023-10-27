const { app, BrowserWindow, screen } = require('electron');

const steamService = require('./src/services/steamService');
const hardwareService = require('./src/services/hardwareService');
const hassService = require('./src/services/hassService');

const { settings } = require('./settings-profiler.js');

const path = require('path');

try {
  require('electron-reloader')(module)
} catch (_) { }

function createWindow() {
  const displays = screen.getAllDisplays();
  const targetDisplay = displays.filter(d =>
    d.size.width == settings.window.display_size_x &&
    d.size.height == settings.window.display_size_y)[0];

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
    hardwareService.updateHardwareInfo(hardwareInfo => mainWindow.webContents.send('update-hardware', hardwareInfo));

    const sensorValue = await hassService.getCo2SensorData();
    mainWindow.webContents.send('update-sensor', sensorValue.state);

    const profiles = await steamService.getProfiles();
    mainWindow.webContents.send('update-profiles', JSON.stringify(profiles));
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